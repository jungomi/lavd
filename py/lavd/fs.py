import base64
import csv
import io
import json
import mimetypes
import os
from typing import Dict, List, Optional, Union

from PIL import Image
from .data import Data

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
            if len(line) == 1:
                lines.append({"message": line[0]})
            elif len(line) == 2:
                lines.append({"message": line[1], "timestamp": line[0]})
            else:
                lines.append({"message": line[2], "timestamp": line[0], "tag": line[1]})
    return {"lines": lines}


def prepare_image(abs_path: str, root: str = "", thumbnail_size: int = 40) -> Dict:
    image = Image.open(abs_path)
    width, height = image.size
    # Creates a thumbnail with the specified max size, but keeping the aspect ratio.
    image.thumbnail((thumbnail_size, thumbnail_size))
    with io.BytesIO() as buffer:
        image.save(buffer, "jpeg")
        thumbnail = base64.b64encode(buffer.getvalue()).decode()
    return {
        "source": os.path.join("/data/", os.path.relpath(abs_path, root)),
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


def categorise_file(path: str) -> Optional[str]:
    mime_type, _ = mimetypes.guess_type(path)
    if mime_type is None:
        return None
    elif mime_type == "text/markdown":
        return "markdown"
    elif mime_type == "application/json":
        return "json"
    elif mime_type.startswith("image"):
        return "image"
    elif mime_type.startswith("text"):
        if path.endswith(".log"):
            return "log"
        else:
            return "text"
    else:
        return None


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
                category = os.path.join(rel_path, base_name)
                full_path = os.path.join(dir, file_name)
                if file_category == "json":
                    json_data = load_json(full_path)
                    if "scalars" in json_data:
                        data.set("scalars", name, step, category, json_data["scalars"])
                    if "texts" in json_data:
                        text = json_data["texts"]
                        text_len = len(text.get("actual", "")) + len(
                            text.get("expeted", "")
                        )
                        data.set(
                            "texts",
                            name,
                            step,
                            category,
                            text,
                            truncate=text_len > MAX_TEXT_LEN,
                        )
                elif file_category == "image":
                    data.set(
                        "images",
                        name,
                        step,
                        category,
                        prepare_image(full_path, root=root),
                    )
                elif file_category == "text":
                    text = read_text_file(full_path)
                    data.set(
                        "texts",
                        name,
                        step,
                        category,
                        {"actual": text},
                        truncate=len(text) > MAX_TEXT_LEN,
                    )
                elif file_category == "log":
                    logs = read_log_file(full_path)
                    data.set(
                        "logs",
                        name,
                        step,
                        category,
                        logs,
                        truncate=len(logs["lines"]) > MAX_LINES,
                    )
                elif file_category == "markdown":
                    markdown = read_text_file(full_path)
                    data.set(
                        "markdown",
                        name,
                        step,
                        category,
                        {"raw": markdown},
                        truncate=len(markdown) > MAX_TEXT_LEN,
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
