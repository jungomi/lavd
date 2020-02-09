import os
from typing import Any, Dict, Optional, Set, Union


def get_or_insert_dict(d: Dict, key: Any) -> Dict:
    data = d.get(key)
    if data is None:
        d[key] = {}
    return d[key]


class Data(object):
    """
    Holds the data from the log directory

    Data {
        [name: str]: {
            [kind: Kind]: {
                [category: str]: {
                    global: Item,
                    steps: {
                        [step: int]: Item
                    }
                }
            }
        }
    }
    with Kind = "scalars" | "images" | "texts" | "logs" | "markdown" | "command"
    """

    def __init__(self):
        super(Data, self).__init__()
        self.full = {}
        self.truncated = {}

    def add_name(self, name: str):
        if name not in self.full:
            self.full[name] = {}
        if name not in self.truncated:
            self.truncated[name] = {}

    # Always returns the full data (not truncated)
    def get(
        self, kind: str, name: str, step: Union[str, int], category: str
    ) -> Optional[Any]:
        name_data = self.full.get(name)
        if name_data is None:
            return None
        kind_data = name_data.get(kind)
        if kind_data is None:
            return None
        category_data = kind_data.get(category)
        if category_data is None:
            return None
        if isinstance(step, int):
            step_data = category_data.get("steps")
            if step_data is None:
                return None
            else:
                return step_data.get(step)
        elif step == "global":
            return category_data.get("global")
        else:
            raise RuntimeError('Step must be int or "global" - got {}'.format(step))

    def set(
        self,
        kind: str,
        name: str,
        step: Union[str, int],
        category: str,
        value: Dict,
        truncate: bool = False,
    ):
        # The truncated value is the URL for the Api, but if the value shouldn't be
        # truncated, the actual value is used (i.e. it is not too big and can be sent
        # directly)
        truncated_value = (
            {"api": {"url": os.path.join("/api", kind, name, str(step), category)}}
            if truncate
            else value
        )
        name_data = get_or_insert_dict(self.full, name)
        name_truncated = get_or_insert_dict(self.truncated, name)
        kind_data = get_or_insert_dict(name_data, kind)
        kind_truncated = get_or_insert_dict(name_truncated, kind)
        category_data = get_or_insert_dict(kind_data, category)
        category_truncated = get_or_insert_dict(kind_truncated, category)
        if isinstance(step, int):
            step_data = get_or_insert_dict(category_data, "steps")
            step_truncated = get_or_insert_dict(category_truncated, "steps")
            step_data[step] = value
            step_truncated[step] = truncated_value
        elif step == "global":
            category_data["global"] = value
            category_truncated["global"] = truncated_value
        else:
            raise RuntimeError('Step must be int or "global" - got {}'.format(step))

    def set_command(self, name: str, value: Dict):
        name_data = get_or_insert_dict(self.full, name)
        name_truncated = get_or_insert_dict(self.truncated, name)
        command = value.get("command")
        if command is not None:
            name_data["command"] = command
            name_truncated["command"] = command

    def remove_command(self, name: str):
        name_data = get_or_insert_dict(self.full, name)
        name_truncated = get_or_insert_dict(self.truncated, name)
        name_data.pop("command", None)
        name_truncated.pop("command", None)

    # Removes the specified data
    # Only the cases that are reflected in the file structure are covered.
    # Assumes that full and truncated are in sync.
    def remove(
        self,
        name: Optional[str] = None,
        step: Optional[Union[str, int]] = None,
        category: Optional[str] = None,
        kind: Optional[str] = None,
        is_dir: bool = False,
    ):
        if name is None:
            self.full = {}
            self.truncated = {}
            return
        if step is None:
            self.full.pop(name, None)
            self.truncated.pop(name, None)
            return
        name_full = self.full.get(name)
        name_truncated = self.truncated.get(name)
        if name_full is None:
            return
        for kind_key in name_full:
            if kind is not None and kind != kind_key:
                continue
            kind_full = name_full.get(kind_key)
            kind_truncated = name_truncated.get(kind_key)
            empty_categories: Set[str] = set()
            for category_key in kind_full:
                if category is not None:
                    if is_dir and category_key.startswith(category):
                        continue
                    elif category != category_key:
                        continue
                category_full = kind_full.get(category_key)
                category_truncated = kind_truncated.get(category_key)
                if isinstance(step, int):
                    step_full = category_full.get("steps")
                    step_truncated = category_truncated.get("steps")
                    if step_full is not None:
                        step_full.pop(step, None)
                        step_truncated.pop(step, None)
                        if len(step_full) == 0:
                            category_full.pop("steps", None)
                            category_truncated.pop("steps", None)
                elif step == "global":
                    category_full.pop("global", None)
                    category_truncated.pop("global", None)
                # Clean up empty category
                # Can't do that while looping over the keys
                if len(category_full) == 0:
                    empty_categories.add(category_key)
            for category_key in empty_categories:
                kind_full.pop(category_key, None)
                kind_truncated.pop(category_key, None)

    def __repr__(self):
        return repr(self.full)
