import os
from typing import Any, Dict, Optional, Union


def get_or_insert_dict(d: Dict, key: Any) -> Dict:
    data = d.get(key)
    if data is None:
        d[key] = {}
    return d[key]


class Data(object):
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
        name_data["command"] = value
        name_truncated["command"] = value

    def __repr__(self):
        return repr(self.full)
