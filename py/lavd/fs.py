import base64
import csv
import errno
import io
import json
import os
import pathlib
from typing import Dict, List, Optional, Union

from PIL import Image
from tornado import locks
from watchdog import events
from watchdog.observers import Observer

from .data import Data
from .file_types import categorise_file

MAX_TEXT_LEN = 1024
MAX_LINES = 100


def load_json(path: str) -> Dict:
    try:
        with open(path, "r", encoding="utf-8") as fd:
            json_data = json.load(fd)
            if isinstance(json_data, dict):
                return json_data
            else:
                return {}
    except json.JSONDecodeError:
        return {}


def read_text_file(path: str) -> str:
    with open(path, "r", encoding="utf-8") as fd:
        return fd.read()


def read_log_file(path: str) -> Dict[str, List[Dict]]:
    lines = []
    with open(path, "r", encoding="utf-8") as fd:
        reader = csv.reader(fd, delimiter="\t", quoting=csv.QUOTE_NONE, quotechar="")
        for line in reader:
            if len(line) == 0:
                lines.append({"message": ""})
            elif len(line) == 1:
                lines.append({"message": line[0]})
            elif len(line) == 2:
                lines.append({"message": line[1], "timestamp": line[0]})
            else:
                lines.append({"message": line[2], "timestamp": line[0], "tag": line[1]})
    return {"lines": lines}


def prepare_image(
    abs_path: str, root: str = "", thumbnail_size: int = 40
) -> Optional[Dict]:
    try:
        image = Image.open(abs_path).convert("RGB")
        width, height = image.size
        # Creates a thumbnail with the specified max size, but keeping the aspect ratio.
        image.thumbnail((thumbnail_size, thumbnail_size))
        with io.BytesIO() as buffer:
            image.save(buffer, "jpeg")
            thumbnail = base64.b64encode(buffer.getvalue()).decode()
    except (OSError, SyntaxError):
        # The image may be invalid, in which case it's just ignored.
        # When the image is not fully written to disk, it will fail, since the file is
        # truncated. Since that mainly affects the watcher, it is okay to move on, since
        # at least another event will be fired when it's fully written to disk.
        return None
    return {
        "source": pathlib.Path("/data/", os.path.relpath(abs_path, root)).as_posix(),
        "thumbnail": {
            "base64": "data:image/jpeg;base64,{}".format(thumbnail),
            "width": width,
            "height": height,
        },
    }


def list_experiments(path: str) -> List[str]:
    _, dir_names, _ = next(os.walk(path))
    dir_names.sort()
    return dir_names


def insert_file(
    data: Data,
    abs_path: str,
    name: str,
    step: Union[str, int],
    category: str,
    file_category: Optional[str],
    root: str = "",
):
    if file_category == "json":
        json_data = load_json(abs_path)
        if "scalars" in json_data:
            data.set("scalars", name, step, category, json_data["scalars"])
        if "texts" in json_data:
            text = json_data["texts"]
            text_len = len(text.get("actual", "")) + len(text.get("expeted", ""))
            data.set(
                "texts",
                name,
                step,
                category,
                text,
                truncate=text_len > MAX_TEXT_LEN,
            )
        if "images" in json_data:
            image_dict = json_data["images"]
            image_source = image_dict.get("source")
            if image_source:
                image_path = pathlib.Path(os.path.dirname(abs_path), image_source)
                image = prepare_image(str(image_path), root=root)
                if image is not None:
                    image_dict.update(image)
                    data.set("images", name, step, category, image_dict)

    elif file_category == "image":
        image = prepare_image(abs_path, root=root)
        if image is not None:
            old_image = data.get("images", name, step, category)
            # Only overwrite if the sources are not the same. This is a conflict,
            # otherwise the JSON has always priority.
            if old_image is None or old_image.get("source") != image.get("source"):
                data.set("images", name, step, category, image)
    elif file_category == "text":
        text = read_text_file(abs_path)
        data.set(
            "texts",
            name,
            step,
            category,
            {"actual": text},
            truncate=len(text) > MAX_TEXT_LEN,
        )
    elif file_category == "log":
        logs = read_log_file(abs_path)
        data.set(
            "logs",
            name,
            step,
            category,
            logs,
            truncate=len(logs["lines"]) > MAX_LINES,
        )
    elif file_category == "markdown":
        markdown = read_text_file(abs_path)
        data.set(
            "markdown",
            name,
            step,
            category,
            {"raw": markdown},
            truncate=len(markdown) > MAX_TEXT_LEN,
        )


def gather_files(
    data: Data,
    abs_path: str,
    step: Union[str, int],
    name: str,
    root: str = "",
    ignore_dirs: List[str] = [],
):
    assert os.path.isabs(abs_path), "abs_path needs to be an absolute path"
    for dir, dir_names, file_names in os.walk(abs_path, topdown=True):
        rel_path = os.path.relpath(dir, abs_path)
        if rel_path == ".":
            # This is the top level (start of the walk)
            rel_path = ""
            # Directories can be ignored by changing dir_names in place (hence the [:])
            dir_names[:] = [d for d in dir_names if d not in ignore_dirs]

        for file_name in file_names:
            file_category = categorise_file(file_name)
            if file_category is not None:
                base_name, _ = os.path.splitext(file_name)
                category = pathlib.Path(rel_path, base_name)
                full_path = pathlib.Path(dir, file_name)
                insert_file(
                    data,
                    full_path.as_posix(),
                    name,
                    step,
                    category.as_posix(),
                    file_category,
                    root=root,
                )


def gather_experiment(data: Data, abs_path: str, name: str, root: str = ""):
    assert os.path.isabs(abs_path), "abs_path needs to be an absolute path"
    _, dir_names, file_names = next(os.walk(abs_path))
    if "command.json" in file_names:
        data.set_command(name, load_json(os.path.join(abs_path, "command.json")))
    # isdigit is only true for non-negative integers, so exactly what the steps can be.
    step_dirs = [d for d in dir_names if d.isdigit()]
    for step_dir in step_dirs:
        gather_files(
            data,
            os.path.join(abs_path, step_dir),
            step=int(step_dir),
            name=name,
            root=root,
        )
    gather_files(
        data, abs_path, step="global", root=root, name=name, ignore_dirs=step_dirs
    )


def gather_data(path: str) -> Data:
    data = Data()
    abs_path = os.path.abspath(path)
    experiment_names = list_experiments(abs_path)
    for experiment_name in experiment_names:
        # The experiment name is always added, to also include empty experiments.
        data.add_name(experiment_name)
        experiment_path = os.path.join(abs_path, experiment_name)
        gather_experiment(data, experiment_path, name=experiment_name, root=abs_path)
    return data


class FileWatcherHandler(events.FileSystemEventHandler):
    """Handler for file events"""

    def __init__(self, log_dir: str, data: Data, update_lock: locks.Condition):
        super(FileWatcherHandler, self).__init__()
        self.data = data
        self.log_dir = log_dir
        self.update_lock = update_lock

    def update_file(self, abs_path: str):
        rel_path = os.path.relpath(abs_path, self.log_dir)
        parts = pathlib.Path(rel_path).parts
        # Files depending on their paths
        # filename (ignored)
        # name, file (global of name)
        # name, i, */file (step i of name)
        # name, dir, */file (global but nested of name)
        if len(parts) == 2:
            name, file_name = parts
            if file_name == "command.json":
                self.data.set_command(name, load_json(abs_path))
            else:
                base_name, _ = os.path.splitext(file_name)
                file_category = categorise_file(file_name)
                insert_file(
                    self.data,
                    abs_path,
                    name,
                    "global",
                    base_name,
                    file_category,
                    root=self.log_dir,
                )
            self.update_lock.notify_all()
        elif len(parts) >= 3:
            name, first_dir, *rest = parts
            if first_dir.isdigit():
                step: Union[int, str] = int(first_dir)
                file_name = pathlib.Path(*rest).as_posix()
            else:
                step = "global"
                # The file is a nested on if it isn't part of a step, therefore the
                # file path is actually: dir/*/file
                file_name = pathlib.Path(first_dir, *rest).as_posix()
            base_name, _ = os.path.splitext(file_name)
            file_category = categorise_file(file_name)
            insert_file(
                self.data,
                abs_path,
                name,
                step,
                base_name,
                file_category,
                root=self.log_dir,
            )
            self.update_lock.notify_all()

    def remove_file(self, abs_path: str, is_dir: bool = False):
        rel_path = os.path.relpath(abs_path, self.log_dir)
        if is_dir:
            if rel_path == ".":
                # Resetting the data, since the whole directory is removed.
                self.data.remove()
                self.update_lock.notify_all()
                return
            parts = pathlib.Path(rel_path).parts
            # Directories depending on their paths
            # name
            # name, i (step i of name)
            # name, category (global of name)
            # name, i, category (category step i of name)
            # name, dir, category (global but nested of name)
            if len(parts) == 1:
                self.data.remove(parts[0])
            elif len(parts) == 2:
                name, first_dir = parts
                if first_dir.isdigit():
                    self.data.remove(name, step=int(first_dir), is_dir=True)
                else:
                    self.data.remove(
                        name, step="global", category=first_dir, is_dir=True
                    )
            elif len(parts) >= 3:
                name, first_dir, *rest = parts
                if first_dir.isdigit():
                    step: Union[int, str] = int(first_dir)
                    category = pathlib.Path(*rest).as_posix()
                else:
                    step = "global"
                    category = pathlib.Path(first_dir, *rest).as_posix()
                self.data.remove(name, step=step, category=category, is_dir=True)
            self.update_lock.notify_all()

        else:
            file_category = categorise_file(rel_path)
            # The extension needs to be removed, since the categories do not include the
            # extension
            rel_path_no_ext, _ = os.path.splitext(rel_path)
            parts = pathlib.Path(rel_path_no_ext).parts
            kind = None
            if file_category == "image":
                kind = "images"
            elif file_category == "text":
                kind = "texts"
            elif file_category == "log":
                kind = "logs"
            elif file_category == "markdown":
                kind = "markdown"
            # Files depending on their paths
            # filename (ignored)
            # name, file (global of name)
            # name, i, */file (step i of name)
            # name, dir, */file (global but nested of name)
            if len(parts) == 2:
                name, file_name = parts
                if file_name == "command":
                    self.data.remove_command(name)
                else:
                    self.data.remove(name, step="global", category=file_name, kind=kind)
                self.update_lock.notify_all()
            elif len(parts) >= 3:
                name, first_dir, *rest = parts
                if first_dir.isdigit():
                    step = int(first_dir)
                    category = pathlib.Path(*rest).as_posix()
                else:
                    step = "global"
                    category = pathlib.Path(first_dir, *rest).as_posix()
                self.data.remove(name, step=step, category=category, kind=kind)
                self.update_lock.notify_all()

    def on_created(self, event: Union[events.DirCreatedEvent, events.FileCreatedEvent]):
        full_path = event.src_path
        if isinstance(event, events.DirCreatedEvent):
            rel_path = os.path.relpath(full_path, self.log_dir)
            parts = pathlib.Path(rel_path).parts
            # Creating directory only adds the experiment if it didn't exist, but once
            # it exists there are no further changes
            self.data.add_name(parts[0])
            self.update_lock.notify_all()
        elif isinstance(event, events.FileCreatedEvent):
            self.update_file(full_path)

    def on_modified(
        self, event: Union[events.DirModifiedEvent, events.FileModifiedEvent]
    ):
        # Only modified files are relevant, modifications to the directories don't
        # change the data, the relevant changes are either on_moved or on_deleted.
        if isinstance(event, events.FileModifiedEvent):
            self.update_file(event.src_path)

    def on_deleted(self, event: Union[events.DirDeletedEvent, events.FileDeletedEvent]):
        if isinstance(event, events.DirDeletedEvent):
            self.remove_file(event.src_path, is_dir=True)
        elif isinstance(event, events.FileDeletedEvent):
            self.remove_file(event.src_path, is_dir=False)

    def on_moved(self, event: Union[events.DirMovedEvent, events.FileMovedEvent]):
        old_path = event.src_path
        new_path = event.dest_path
        if isinstance(event, events.DirMovedEvent):
            old_rel_path = os.path.relpath(old_path, self.log_dir)
            old_parts = pathlib.Path(old_rel_path).parts
            # Moving a directory is only relevant to the experiment names, all others
            # have no effect unless there are files moved inside the directory, which
            # all fire a separate event.
            if len(old_parts) == 1:
                self.remove_file(old_path, is_dir=True)
            # If the destinatino is also an experiment, it needs to be created.
            new_rel_path = os.path.relpath(new_path, self.log_dir)
            new_parts = pathlib.Path(new_rel_path).parts
            if len(new_parts) == 1:
                self.data.add_name(new_parts[0])
                self.update_lock.notify_all()
        elif isinstance(event, events.FileMovedEvent):
            # Files are always updated
            self.remove_file(old_path)
            self.update_file(new_path)


class FileWatcher(object):
    """FileWatcher that watches the file system for changes in the logged data"""

    def __init__(self, log_dir: str, data: Data, update_lock: locks.Condition):
        super(FileWatcher, self).__init__()
        self.data = data
        self.log_dir = os.path.abspath(log_dir)
        self.update_lock = update_lock
        self.observer = Observer()
        self.observer.schedule(
            FileWatcherHandler(self.log_dir, self.data, self.update_lock),
            self.log_dir,
            recursive=True,
        )
        try:
            self.observer.start()
        except OSError as err:
            if err.errno == errno.ENOSPC:
                msg = (
                    "{}\n"
                    "\n"
                    "Try increasing the number of allowed watches:\n"
                    "\n"
                    "  sudo sysctl fs.inotify.max_user_watches=524288\n"
                    "\n"
                    "See also: "
                    "https://github.com/jungomi/lavd#inotify-watch-limit-reached"
                ).format(err.strerror)
                raise OSError(err.errno, msg)
            else:
                raise err

    def stop(self):
        self.observer.stop()

    def __del__(self):
        self.stop()


def write_json(data: Dict, path: pathlib.Path, merge: bool = True):
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.is_file():
        out = load_json(str(path))
        out.update(data)
    else:
        out = data
    with open(path, "w", encoding="utf-8") as fd:
        json.dump(out, fd)


def write_text_file(
    content: str, path: pathlib.Path, append: bool = False, ensure_newline: bool = True
):
    path.parent.mkdir(parents=True, exist_ok=True)
    mode = "a" if append else "w"
    with open(path, mode, encoding="utf-8") as fd:
        fd.write(content)
        if not content.endswith("\n"):
            fd.write("\n")
