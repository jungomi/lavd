import base64
import csv
import io
import json
import mimetypes
import os
from typing import Dict, List, Optional

from PIL import Image


def load_json(path: str) -> Dict:
    try:
        with open(path, "r", encoding="utf-8") as fd:
            return json.load(fd)
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
    abs_path: str, root: str = "", ignore_dirs: List[str] = []
) -> Dict[str, Dict]:
    assert os.path.isabs(abs_path), "abs_path needs to be an absolute path"
    files: Dict[str, Dict] = {}
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
                name = os.path.join(rel_path, base_name)
                full_path = os.path.join(dir, file_name)
                if name not in files:
                    files[name] = {}
                if file_category == "json":
                    json_data = load_json(full_path)
                    if "scalars" in json_data:
                        files[name]["scalars"] = json_data["scalars"]
                    elif "texts" in json_data:
                        files[name]["texts"] = json_data["texts"]
                elif file_category == "image":
                    files[name]["images"] = prepare_image(full_path, root=root)
                elif file_category == "text":
                    files[name]["texts"] = {"actual": read_text_file(full_path)}
                elif file_category == "log":
                    files[name]["logs"] = read_log_file(full_path)
                elif file_category == "markdown":
                    files[name]["markdown"] = {"raw": read_text_file(full_path)}
    return files


def gather_experiment(abs_path: str, root: str = "") -> Dict[str, Dict[str, Dict]]:
    assert os.path.isabs(abs_path), "abs_path needs to be an absolute path"
    data: Dict[str, Dict[str, Dict]] = {
        "scalars": {},
        "images": {},
        "texts": {},
        "logs": {},
        "markdown": {},
    }
    data_types = list(data.keys())
    _, dir_names, file_names = next(os.walk(abs_path))
    if "command.json" in file_names:
        data["command"] = load_json(os.path.join(abs_path, "command.json"))
    # isdigit is only true for non-negative integers, so exactly what the steps can be.
    step_dirs = [d for d in dir_names if d.isdigit()]
    for step_dir in step_dirs:
        step = int(step_dir)
        files = gather_files(os.path.join(abs_path, step_dir), root=root)
        for name, values in files.items():
            for data_type in data_types:
                data_of_type = values.get(data_type)
                if data_of_type is not None:
                    if name not in data[data_type]:
                        data[data_type][name] = {}
                    if "steps" not in data[data_type][name]:
                        data[data_type][name]["steps"] = {}
                    data[data_type][name]["steps"][step] = data_of_type
    files = gather_files(abs_path, root=root, ignore_dirs=step_dirs)
    for name, values in files.items():
        for data_type in data_types:
            data_of_type = values.get(data_type)
            if data_of_type is not None:
                if name not in data[data_type]:
                    data[data_type][name] = {}
                data[data_type][name]["global"] = data_of_type
    return data


def gather_data(path: str) -> Dict[str, Dict[str, Dict]]:
    data: Dict[str, Dict[str, Dict]] = {}
    abs_path = os.path.abspath(path)
    experiment_names = list_experiments(abs_path)
    for experiment_name in experiment_names:
        data[experiment_name] = {}
        experiment_path = os.path.join(abs_path, experiment_name)
        experiment_data = gather_experiment(experiment_path, root=abs_path)
        for data_type, value in experiment_data.items():
            data[experiment_name][data_type] = value
    return data
