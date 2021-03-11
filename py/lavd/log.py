import argparse
import os
import pathlib
import re
import subprocess
import sys
import time
from datetime import datetime
from typing import Any, Callable, Dict, List, Optional, TextIO, Tuple, Union

from halo import Halo
from PIL import Image
from tqdm import tqdm

from .file_types import SAVE_ALL_EXTENSIONS
from .fs import write_json, write_text_file
from .noop import maybe_disable

try:
    import torch
    import torch.nn as nn

    HAS_TORCH = True
except ImportError:
    HAS_TORCH = False

try:
    from torchvision.transforms import ToPILImage
except ImportError:
    ToPILImage = None

try:
    # Only for type annotations
    import numpy as np  # noqa: F401 - unused import
except ImportError:
    pass


table_separator_regex = re.compile("[^|]")


class Logger(object):
    disabled: bool
    name: str
    delimiter: str
    num_digits: int
    indent_size: int
    created_timestamp: datetime
    base_dir: pathlib.Path
    log_dir: pathlib.Path
    repo_path: Optional[str]
    git_hash: Optional[str]
    git_branch: Optional[str]
    events_file: Optional[TextIO]
    stdout_file: Optional[TextIO]
    stderr_file: Optional[TextIO]
    events_time: Dict[str, float]
    to_pil: Optional[Callable[[Union["torch.Tensor", "np.ndarray"]], Image.Image]]

    def __init__(
        self,
        name: str = None,
        log_dir: str = "./log",
        num_digits: int = 4,
        indent_size: int = 4,
        delimiter: str = "\t",
        disabled: bool = False,
    ):
        """
        Arguments:
            name (str):
                Name of the experiment. If not specified uses the current date and time
                as name.
                [Default: None]
            log_dir (str):
                Base directory of the logs [Default: ./log]
            num_digits (int):
                Minimum number of digits for the step/epoch directories.
                Smaller numbers are padded with leading zeros to ensure that utilities,
                which list them in lexicographical order (e.g. with ls), display them in
                the expected order. Lavd itself considers them as equal i.e. 9 == 0009
                [Default: 4]
            indent_size (int):
                Number of spaces to use when indenting text [Default: 4]
            delimiter (str):
                Delimiter to separate columns of the log files
                This should not be changed if the logs are visualised with Lavd.
                [Default: "\t"]
            disabled (bool):
                Whether to disable all logging actions, which use a no-op instead,
                allowing the use of all methods as usual but without having any output.
                Methods that produce some useful information without logging anything,
                such as `get_file_path` will still work as usual.
                Particularly useful when the same script is launched in multiple
                processing, but only the main process should create the logs.
                [Default: False]
        """
        super(Logger, self).__init__()
        self.base_dir = pathlib.Path(log_dir)
        self.delimiter = delimiter
        self.disabled = disabled
        self.num_digits = num_digits
        self.indent_size = indent_size
        self.created_timestamp = datetime.now()
        self.name = self.get_start_time() if name is None else name
        self.log_dir = pathlib.Path(log_dir, self.name)
        try:
            self.repo_path = (
                subprocess.check_output(["git", "rev-parse", "--show-toplevel"])
                .strip()
                .decode("utf-8")
            )
            self.git_hash = (
                subprocess.check_output(
                    ["git", "rev-parse", "HEAD"],
                    cwd=self.repo_path,
                )
                .strip()
                .decode("utf-8")
            )
            self.git_branch = (
                subprocess.check_output(
                    ["git", "rev-parse", "--abbrev-ref", "HEAD"],
                    cwd=self.repo_path,
                )
                .strip()
                .decode("utf-8")
            )
        except subprocess.CalledProcessError:
            self.repo_path = None
            self.git_hash = None
            self.git_branch = None
        self.events_file = None
        self.stdout_file = None
        self.stderr_file = None
        self.prefix = ""
        self.events_time = {}
        self.to_pil = None if ToPILImage is None else ToPILImage()
        if not self.disabled:
            self.log_dir.mkdir(parents=True, exist_ok=True)

    def __del__(self):
        if self.events_file is not None:
            self.events_file.close()
        if self.stdout_file is not None:
            self.stdout_file.close()
        if self.stderr_file is not None:
            self.stderr_file.close()

    def enable(self):
        """
        Enables all logging actions, should they have been disabled.
        """
        # Make sure the directory is created, which wouldn't be the case if a disabled
        # logger was created.
        self.log_dir.mkdir(parents=True, exist_ok=True)
        self.disabled = False

    def disable(self):
        """
        Disables all logging actions.
        """
        self.disabled = True

    def get_start_time(self) -> str:
        """
        Retrieves the time when the logger was created in a human readable format.

        Returns:
            timestamp (str): Date and time when the logger was created
        """
        return self.created_timestamp.strftime("%Y-%m-%d %H:%M:%S")

    def get_file_path(
        self, name: str, step: Optional[int] = None, extension: str = ""
    ) -> pathlib.Path:
        """
        Assembles the path that corresponds to the file corresponding to the name and
        step (if any) with the corresponding extension.

        Arguments:
            name (str):
                Name of the target
            step (int):
                Step/epoch to which the target belongs, If unspecified, it is located at
                the top level instead. [Default: None]
            extension (str):
                File extension for the target file.

        Returns:
            path (pathlib.Path):
                Path to the corresponding file
        """
        step_dir = (
            ""
            if step is None
            else "{num:0>{pad}}".format(num=step, pad=self.num_digits)
        )
        name += extension
        return pathlib.Path(self.log_dir, step_dir, name)

    def set_prefix(self, prefix: str):
        """
        Sets the prefix that commonly used in log messages. This can be useful to avoid
        having to keep passing around common message, for example the current step/epoch
        out of the total number of steps/epochs. It will also be included in the log
        files.

        Note: This does not apply to `[e]println()` and `log()` as they are considered
        the primitives for the primary IO operations.

        Arguments:
            prefix (str): Prefix string

        Example:
            >>> logger.set_prefix("[1 / 100]")
            >>> logger.start("Train") # Starts and logs event => [1 / 100] Train
        """
        self.prefix = prefix

    @maybe_disable
    def start(self, name: str, prefix: bool = True, tag: str = "START"):
        """
        Starts an event with the given name and keeps track of its execution time.

        Note: Starting an event with the same name will overwrite the old one if it
        didn't finish, i.e. the starting time of the latest call will be used.

        Arguments:
            name (str):
                Name of the event to log
            prefix (bool):
                Whether to include the prefix in the log message
                [Default: True]
            tag (str):
                Tag for the event message [Default: "START"]

        """
        self.events_time[name] = time.time()
        msg = (
            "{} {}".format(self.prefix, name) if prefix and self.prefix != "" else name
        )
        self.log(tag, msg)

    @maybe_disable
    def end(self, name: str, prefix: bool = True, tag: str = "END"):
        """
        Ends an event of the given name and logs its execution time if the event had
        previously been started.

        `start()` should have been called before with the same name, to initialise the
        event.

        Arguments:
            name (str):
                Name of the event to log
            prefix (bool):
                Whether to include the prefix in the log message
                [Default: True]
            tag (str):
                Tag for the event message [Default: "END"]

        """
        start_time = self.events_time.pop(name, None)
        end_time = time.time()
        msg = (
            "{} {}".format(self.prefix, name) if prefix and self.prefix != "" else name
        )
        if start_time is not None:
            time_difference = end_time - start_time
            elapsed_time = time.strftime("%H:%M:%S", time.gmtime(time_difference))
            msg = "{} - Duration: {}".format(msg, elapsed_time)
        self.log(tag, msg)

    @maybe_disable
    def progress_bar(
        self, name: str, *args, prefix: bool = True, **kwargs
    ) -> "ProgressBar":
        """
        Creates a progress bar for the given name. This is essentially a tqdm progress
        bar, but it additionally logs the start and end of the duration.

        Arguments:
            name (str):
                Name of the event. If the `desc` argument is not given, the name will
                automatically be used as the description for the progress bar.
            prefix (bool):
                Whether to use the prefix. It is added in front of the text, if set to
                True. [Default: True]
            *args, **kwargs:
                Arguments to tqdm, see https://github.com/tqdm/tqdm

        Returns:
            progressbar (ProgressBar):
                Can be use exactly like a tqdm() progress bar.
        """
        # The prefixed is added to the description if desired. When no description is
        # provided, the name is used as the description.
        description = kwargs.get("desc") or name
        kwargs["desc"] = (
            "{} {}".format(self.prefix, description) if prefix else description
        )
        return ProgressBar(self, name, prefix, *args, **kwargs)

    @maybe_disable
    def spinner(self, name: str, *args, prefix: bool = True, **kwargs) -> "Spinner":
        """
        Creates a spinner for the given name. This is essentially a Halo spinner, but it
        additionally logs the start and end of the duration.

        Arguments:
            name (str):
                Name of the event. If the `text` argument is not given, the name will
                automatically be used as the text for the spinner.
            prefix (bool):
                Whether to use the prefix. It is added in front of the text, if set to
                True. [Default: True]
            *args, **kwargs:
                Arguments to the spinner, see https://github.com/manrajgrover/halo

        Returns:
            spinner (Spinner):
                Can be use exactly like a Halo() spinner.
        """
        # The prefixed is added to the text if desired. When no text is provided, the
        # name is used as the text.
        text = kwargs.get("text") or name
        kwargs["text"] = "{} {}".format(self.prefix, text) if prefix else text
        return Spinner(self, name, prefix, *args, **kwargs)

    @maybe_disable
    def log(self, tag: str, msg: str):
        """
        Logs a message to the log file (events.log) with the given tag.

        Arguments:
            tag (str):
                Tag for the message
            msg (str):
                Actual message
        """
        now = datetime.now()
        if self.events_file is None:
            self.events_file = open(
                os.path.join(self.log_dir, "events.log"), "w", buffering=1
            )
        self.events_file.write(str(now))
        self.events_file.write(self.delimiter)
        self.events_file.write(tag)
        self.events_file.write(self.delimiter)
        self.events_file.write(msg)
        self.events_file.write("\n")

    @maybe_disable
    def println(self, msg: str, *args, **kwargs):
        """
        Prints a message to STDOUT while also logging it to the appropriate files.

        Arguments:
            msg (str):
                String to print. Can be a format string, where all replacements are
                specified as *args and **kwargs.
                It's identical to creating the msg with "".format(), just some syntactic
                sugar.

        Example:
            >>> logger.println("hello {} - {end}}", "world", end="bye")
            >>> # Same but with "".format()
            >>> logger.println("hello {} - {end}}".format("world", end="bye"))
        """
        if self.stdout_file is None:
            self.stdout_file = open(
                os.path.join(self.log_dir, "stdout.log"), "w", buffering=1
            )
        formatted_msg = msg.format(*args, **kwargs)
        self.stdout_file.write(formatted_msg)
        self.stdout_file.write("\n")
        self.log("STDOUT", formatted_msg)
        print(formatted_msg)

    @maybe_disable
    def eprintln(self, msg: str, *args, **kwargs):
        """
        Prints a message to STDERR while also logging it to the appropriate files.

        Arguments:
            msg (str):
                String to print. Can be a format string, where all replacements are
                specified as *args and **kwargs.
                It's identical to creating the msg with "".format(), just some syntactic
                sugar.

        Example:
            >>> logger.eprintln("hello {} - {end}}", "world", end="bye")
            >>> # Same but with "".format()
            >>> logger.eprintln("hello {} - {end}}".format("world", end="bye"))
        """
        if self.stderr_file is None:
            self.stderr_file = open(
                os.path.join(self.log_dir, "stderr.log"), "w", buffering=1
            )
        formatted_msg = msg.format(*args, **kwargs)
        self.stderr_file.write(formatted_msg)
        self.stderr_file.write("\n")
        self.log("STDERR", formatted_msg)
        print(formatted_msg, file=sys.stderr)

    @maybe_disable
    def print_table(
        self,
        header: List[str],
        rows: List[List[Optional[Union[str, int, float]]]],
        indent_level: int = 0,
        placeholder: str = "-",
        precision: int = 5,
    ):
        """
        Prints a nicely formatted table in the style of a Markdown table.

        Arguments:
            header (List[str]):
                Names for each column displayed as a table header.
            rows (List[List[str | int | float | None]]):
                Rows, where each row contains the columns for that row. Each row must
                have the same length as the header. Columns may be empty, but they need
                to be present in the list, hence can be set to None, which will be
                replaced with the placeholder. Floats are represented with a fixed
                precision (number of digits after the decimal point).
            indent_level (int):
                Indent the whole table to the specified level. The number of spaces used
                per indentation level respects the configured indent_size of the logger.
                [Default: 0]
            placeholder (str):
                Placeholder for empty columns.
                [Default: "-"]
            precision (int):
                Precision (number of digits after the decimal point) for float values.
                [Default: 5]

        Example:
            >>> header = ["Name", "Correct", "Total", "Accuracy"]
            >>> rows = [
            >>>     ["Train", 978, 1000, 0.978],
            >>>     ["Validation", 90, 100, 0.9],
            >>>     ["Test", None, 50, None],
            >>> ]
            >>> logger.print_table(header, rows)
            >>> # | Name       | Correct | Total | Accuracy |
            >>> # |------------|---------|-------|----------|
            >>> # | Train      | 978     | 1000  | 0.97800  |
            >>> # | Validation | 90      | 100   | 0.90000  |
            >>> # | Test       | -       | 50    | -        |
        """
        rows_formatted = []
        # Keeps track of the longest field length in each column, so that the table can
        # be aligned nicely.
        column_widths = [len(name) for name in header]
        for row in rows:
            row_formatted = []
            for column, field in enumerate(row):
                field_str = placeholder
                if isinstance(field, str):
                    field_str = field
                elif isinstance(field, int):
                    field_str = str(field)
                elif isinstance(field, float):
                    field_str = "{num:.{precision}f}".format(
                        num=field, precision=precision
                    )
                row_formatted.append(field_str)
                # Check whether the field is longer than current maximum column width
                # and expand it if necessary.
                if len(field_str) > column_widths[column]:
                    column_widths[column] = len(field_str)
            rows_formatted.append(row_formatted)
        indent = " " * indent_level * self.indent_size
        header = pad_table_row(header, column_widths)
        line = "| {fields} |".format(fields=" | ".join(header))
        self.println("{indent}{line}".format(indent=indent, line=line))
        separator = table_separator_regex.sub("-", line)
        self.println("{indent}{line}".format(indent=indent, line=separator))
        for r in rows_formatted:
            r = pad_table_row(r, column_widths)
            line = "| {fields} |".format(fields=" | ".join(r))
            self.println("{indent}{line}".format(indent=indent, line=line))

    @maybe_disable
    def log_summary(
        self,
        infos: Optional[Dict[str, Any]] = None,
        sections: Optional[Dict[str, Union[str, List[str]]]] = None,
        options: Optional[argparse.Namespace] = None,
    ):
        """
        Logs a summary of the experiment as a markdown file.

        Arguments:
            infos (dict):
                Infos that are displayed in a list, where the key is used as a label. It
                can contain nested infos, which create nested lists, for example
                {"size": {"train": 1000, "validation": 50}} displays the following list:
                - size
                    - train: 1000
                    - validation: 50
            sections (dict):
                Additional sections to add to the end of the markdown file, where the
                key is used as the title and the content is given as a raw string or
                a list of lines.
            options (argparse.Namespace):
                Command line options that are used for the current experiment.

        Example:
            >>> infos = {"size": {"train": 1000, "validation": 50}}
            >>> sections = {
            >>>     "Additional raw Information": "Some text\nand more",
            >>>     "Same but with Lines": ["Some text", "and more"],
            >>> }
            >>> logger.log_summary(infos, sections)
        """
        try:
            diff = subprocess.check_output(
                ["git", "diff", "HEAD"],
                cwd=self.repo_path,
            ).decode("utf-8")
        except subprocess.CalledProcessError:
            diff = ""
        diff_file = os.path.join(self.log_dir, "changes.patch")
        if len(diff) > 0:
            with open(diff_file, "w") as fd:
                fd.write(diff)
        with open(os.path.join(self.log_dir, "summary.md"), "w") as fd:
            fd.write("# {}\n\n".format(self.name))
            fd.write("- **Start**: {}\n".format(self.get_start_time()))
            fd.write("- **Git**:\n")
            fd.write(
                "{indent}- **Branch**: {branch}\n".format(
                    indent=" " * self.indent_size,
                    branch="-" if self.git_branch is None else self.git_branch,
                )
            )
            fd.write(
                "{indent}- **Commit**: {commit}\n".format(
                    indent=" " * self.indent_size,
                    commit="-" if self.git_hash is None else self.git_hash,
                )
            )
            if infos is not None:
                write_list(fd, infos, indent_size=self.indent_size)
            fd.write("\n")

            fd.write("## Command\n\n")
            fd.write("```sh\n")
            command = " ".join(["python", *sys.argv])
            fd.write(command)
            fd.write("\n")
            fd.write("```\n")

            if self.git_hash is not None:
                fd.write("\n")
                fd.write("## Restore Working Tree\n\n")
                fd.write(
                    "The working tree at the time of the experiment can be "
                    "restored with:"
                )
                fd.write("\n\n")
                fd.write("```sh\n")
                fd.write("git checkout {}\n".format(self.git_hash))
                if len(diff) > 0:
                    fd.write("git apply {}\n".format(diff_file))
                fd.write("```\n")

            if options is not None:
                fd.write("\n")
                fd.write("## Options\n\n")
                fd.write("```\n")
                options_dict = vars(options)
                for k, v in options_dict.items():
                    fd.write("{} = {}\n".format(k, v))
                fd.write("```\n")

            if len(diff) > 0:
                fd.write("\n")
                fd.write("## Git Changes\n\n")
                fd.write(
                    "There were uncommitted changes when running the experiment\n\n"
                )
                fd.write("````diff\n")
                fd.write(diff)
                fd.write("````\n")

            if sections is not None:
                for section_title, section_content in sections.items():
                    fd.write("\n")
                    fd.write("## {}\n\n".format(section_title))
                    if isinstance(section_content, list):
                        for line in section_content:
                            fd.write("{}\n".format(line))
                    else:
                        fd.write("{}\n".format(section_content))

    @maybe_disable
    def log_scalar(self, scalar: Union[int, float], name: str, step: int):
        """
        Logs a scalar

        Arguments:
            scalar (int | float):
                Scalar to be logged
            name (str):
                Name of the scalar to log
            step (int):
                Step/epoch to which the scalar belongs. Unlike other log methods, this
                one requires the step, since single scalars don't make sense on a global
                level.

        Example:
            >>> logger.log_scalar(0.8, "accuracy", step=1)
            >>> logger.log_scalar(0.6, "accuracy", step=2)
            >>> logger.log_scalar(0.1, "easy/accuracy", step=7)
            >>> logger.log_scalar(0.05, "easy/accuracy", step=14)
        """
        path = self.get_file_path(name, step, extension=".json")
        scalar_dict = {"scalars": {"value": scalar}}
        write_json(scalar_dict, path, merge=True)

    @maybe_disable
    def log_text(
        self,
        text: str,
        name: str,
        step: Optional[int] = None,
        expected: Optional[str] = None,
    ):
        """
        Logs a text and optionally the expected text, which will show a diff between the
        two.

        Arguments:
            text (str):
                Text to be logged
            name (str):
                Name of the text to log
            step (int):
                Step/epoch to which the text belongs, If unspecified, it is
                saved at the top level instead. [Default: None]
            expected (str):
                Expected text to compare to the actual text with a diff. If not
                specified, there will be no diff.
                [Default: None]

        Example:
            >>> logger.log_text("The quick brown fox...", "famous-sentence", step=1)
            >>> # With an expected text
            >>> logger.log_text(
            >>>     "hello world", "with-diff", step=2, expected="Hallo Welt"
            >>> )
        """
        if expected is not None:
            path = self.get_file_path(name, step, extension=".json")
            text_dict = {"texts": {"actual": text, "expected": expected}}
            write_json(text_dict, path, merge=True)
        else:
            path = self.get_file_path(name, step, extension=".txt")
            write_text_file(text, path)

    @maybe_disable
    def log_markdown(self, markdown: str, name: str, step: Optional[int] = None):
        """
        Logs a Markdown document

        Arguments:
            markdown (str):
                Raw markdown text to be logged as Markdown document
            name (str):
                Name of the Markdown document to log
            step (int):
                Step/epoch to which the Markdown document belongs, If unspecified, it is
                saved at the top level instead. [Default: None]

        Example:
            >>> logger.log_markdown("# Hello\n\nMore markdown...", "some-markdown")
            >>> logger.log_markdown("# Step 1\\nn## Result\n\nGood", "for-step", step=1)
        """
        path = self.get_file_path(name, step, extension=".md")
        write_text_file(markdown, path)

    @maybe_disable
    def log_image(
        self,
        image: Union[Image.Image, "torch.Tensor", "np.ndarray"],
        name: str,
        step: Optional[int] = None,
        boxes: Optional[List[Dict]] = None,
        classes: Optional[List[str]] = None,
        threshold: Optional[float] = None,
        extension: str = ".png",
    ):
        """
        Logs an image and optionally bounding boxes that are present in the image.

        Arguments:
            image (PIL.Image | torch.Tensor | np.array):
                Image to be logged. torch.Tensor and np.array are converted to a PIL
                Image, this requires torchvision to be installed.
            name (str):
                Name of the image to log
            step (int):
                Step/epoch to which the image belongs, If unspecified, it is
                saved at the top level instead. [Default: None]
            boxes (List[{ "xStart": int, "yStart": int, "xEnd": int, "yEnd": int,
                          "className": Optional[str], probability: Optional[float] }]):
                A list of bounding boxes given as dict. Defined with two points,
                top-left (xStart and yStart) and bottom-right (xEnd, yEnd), an optional
                class name (className) and an optional probability (probability).
                [Default: None]
            classes (List[str]):
                A list of the available bounding box classes. Only used if boxes are
                specified.
                [Default: None]
            threshold (float):
                Threshold that is used to determine positive and negative bounding
                boxes. Allows to only show bounding boxes with a probability higher than
                this threshold. All boxes are saved, but for the visualisation it serves
                as a filter to only show boxes that would actually be used. This value
                can be changed to see lower scoring boxes, instead of discarding them
                entirely. Only used if boxes are specified.
                [Default: None]
            extension (str):
                File extension for the image file.
                Note: Images with the same name but different extension will be in
                conflict. Always use a different name if you want two different images.
                The extension should only be changed if a different format is desired.
                [Default: ".png"]

        Example:
            >>> # Saves image to: log/some-experiment-name/0001/bird.png
            >>> logger.log_image(image, "bird", step=1)
            >>> # Saves image to: log/some-experiment-name/0001/other/bird.png
            >>> logger.log_image(image, "other/bird", step=1)
            >>> # With bounding boxes
            >>> boxes = [
            >>>     {
            >>>         "xStart": 100,
            >>>         "yStart": 100,
            >>>         "xEnd": 150,
            >>>         "yEnd": 200,
            >>>         "className": "bird",
            >>>         "probability": 0.4,
            >>>     },
            >>>     # Another bounding box, without class or probability
            >>>     {"xStart": 200, "yStart": 22, "xEnd": 233, "yEnd": 80,},
            >>> ]
            >>> classes = ["bird", "orange", "background"]
            >>> threshold = 0.2
            >>> logger.log_image(
            >>>     img,
            >>>     "birds-with-bounding-boxes",
            >>>     step=3,
            >>>     boxes=boxes,
            >>>     classes=class_names,
            >>>     threshold=threshold,
            >>> )
        """
        if not isinstance(image, Image.Image):
            assert (
                self.to_pil
            ), "Images as NumPy array or torch.Tensor requires torchvision"
            image = self.to_pil(image)
        img_path = self.get_file_path(name, step, extension=extension)
        img_path.parent.mkdir(parents=True, exist_ok=True)
        # The save_all is for animated images with multiple frames to save them as an
        # animated image, otherwise only the first frame is saved.
        image.save(img_path, save_all=extension in SAVE_ALL_EXTENSIONS)
        if boxes is not None:
            json_path = self.get_file_path(name, step, extension=".json")
            image_dict = {"images": {"source": img_path.name, "boxes": boxes}}
            if classes is not None:
                image_dict["images"]["classes"] = classes
            if threshold is not None:
                image_dict["images"]["minProbability"] = threshold
            write_json(image_dict, json_path, merge=True)

    @maybe_disable
    def log_command(
        self,
        parser: argparse.ArgumentParser,
        args: argparse.Namespace,
        binary: str = "python",
        script_name: Optional[str] = None,
    ):
        """
        Logs a command, which includes the command line arguments used as well as the
        available options in the parser.

        Arguments:
            parser (argparse.ArgumentParser):
                Parser that parsed the command line arguments.
            args (argparse.Namespace):
                Command line arguments parsed from the parser.
            binary (str):
                Binary that is used to run the program.
                [Default: "python"]
            script_name (str):
                Name of the script that is used as the entry point. If not specified it
                resorts to the first argument that started the program
                (i.e.  sys.argv[0]).
                [Default: None]

        Example:
            >>> import argparse
            >>> parser = argparse.ArgumentParser()
            >>> # Add all options with: parser.add_argument()
            >>> # ...
            >>> args = parser.parse_args()
            >>> logger.log_command(parser, args)
        """
        path = self.get_file_path("command", extension=".json")
        if script_name is None:
            script_name = sys.argv[0]
        command_dict: Dict[str, Dict] = {"command": {"bin": binary}}
        if script_name != "":
            command_dict["command"]["script"] = script_name
        positionals, options = extract_parser_options(parser)
        parser_dict: Dict[str, Union[List, Dict]] = {}
        if len(positionals) > 0:
            parser_dict["positional"] = list(positionals.values())
        if len(options) > 0:
            parser_dict["options"] = {opt["name"]: opt for opt in options.values()}
        if len(parser_dict) > 0:
            command_dict["command"]["parser"] = parser_dict
        arguments_dict = assign_args_to_options(args, positionals, options)
        if len(arguments_dict) > 0:
            command_dict["command"]["arguments"] = arguments_dict
        write_json(command_dict, path, merge=True)

    # The type annotation is given as string because torch might not be available, this
    # allows to still make it work while having type checking as well.
    @maybe_disable
    def save_model(
        self,
        model: "Union[nn.Module, nn.DataParallel, nn.parallel.DistributedDataParallel]",
        step: Optional[int] = None,
        name: str = "model",
        extension: str = ".pt",
        grads: bool = False,
    ):
        """
        Saves the state/checkpoint of the model, to be compatible with the actual model,
        multi GPU/Node models (nn.DataParallel and nn.parallel.DistributedDataParallel)
        are automatically unwrapped.

        Optionally, it also saves the current gradients.

        Requires torch

        Arguments:
            model (nn.Module | nn.DataParallel | nn.parallel.DistributedDataParallel):
                Model to be saved
            step (int):
                Step/epoch to which the model belongs, If unspecified, it is
                saved at the top level instead. [Default: None]
            name (str):
                Name of the model to be saved. This can be a nested path,
                for example: "gan/generator" [Default: "model"]
            extension (str):
                The extension of the saved model. It is recommended to use ".pt" for
                this. Even though ".pth" is frequently used, it is in conflict with
                Python's path configuration files
                (see https://docs.python.org/3/library/site.html).
                Might as well make sure to avoid that.
                To further avoid ambiguities, ".pt" is used for serialised data and
                ".ptc" is used for JIT exported modules (c = compiled).
                [Default: ".pt"]
            grads (bool):
                Save gradients of the model next to the checkpoint with .grad added to
                the name.
                [Default: False]
        """
        assert HAS_TORCH, "save_model requires torch (PyTorch) to be installed"
        # Multi GPU/Node models wrap the original model. To make the checkpoint
        # compatible with the original model, it is unwrapped.
        unwrapped_model = (
            model.module
            if isinstance(model, (nn.DataParallel, nn.parallel.DistributedDataParallel))
            else model
        )
        state_dict = unwrapped_model.state_dict()
        path = self.get_file_path(name, step, extension=extension)
        path.parent.mkdir(parents=True, exist_ok=True)
        torch.save(state_dict, path)
        if grads:
            grad_dict = {
                name: param.grad
                for name, param in unwrapped_model.named_parameters()
                if param.grad is not None
            }
            path = self.get_file_path("{}.grad".format(name), step, extension=extension)
            torch.save(grad_dict, path)

    @maybe_disable
    def save_obj(
        self,
        obj: Any,
        name: str,
        step: Optional[int] = None,
        extension: str = ".pt",
    ):
        """
        Saves any object by serialising it with `torch.save`.

        Requires torch

        Arguments:
            object (any):
                Object to be saved
            name (str):
                Name of the object to be saved.
            step (int):
                Step/epoch to which the object belongs, If unspecified, it is
                saved at the top level instead. [Default: None]
            extension (str):
                The extension of the serialised object. It is recommended to use ".pt"
                for this. Even though ".pth" is frequently used, it is in conflict with
                Python's path configuration files
                (see https://docs.python.org/3/library/site.html).
                Might as well make sure to avoid that.
                To further avoid ambiguities, ".pt" is used for serialised data and
                ".ptc" is used for JIT exported modules (c = compiled).
                [Default: ".pt"]
        """
        assert HAS_TORCH, "save_model requires torch (PyTorch) to be installed"
        path = self.get_file_path(name, step, extension=extension)
        path.parent.mkdir(parents=True, exist_ok=True)
        torch.save(obj, path)


class ProgressBar(tqdm):
    """
    A progress bar that logs the start and end of the progress
    """

    def __init__(self, logger: Logger, name: str, prefix: bool, *args, **kwargs):
        """
        Args:
            logger (Logger):
                The logger to log the start and end of the progress
            name (str):
                Name of the event to log
            prefix (bool):
                Whether to include the prefix in the log message
            *args, **kwargs:
                Arguments forwarded to tqdm
        """
        self.logger = logger
        self.name = name
        self.prefix = prefix
        self.logger.start(self.name, prefix=self.prefix, tag="PROGRESS_START")
        super(ProgressBar, self).__init__(*args, **kwargs)

    def close(self):
        if self.disable:
            return
        super().close()
        self.logger.end(self.name, prefix=self.prefix, tag="PROGRESS_END")


class Spinner(Halo):
    """A spinner that logs the start and end of the duration"""

    def __init__(self, logger: Logger, name: str, prefix: bool, *args, **kwargs):
        """
        Args:
            logger (Logger):
                The logger to log the start and end of the duration
            name (str):
                Name of the event to log
            prefix (bool):
                Whether to include the prefix in the log message
            *args, **kwargs:
                Arguments forwarded to Halo
        """
        self.logger = logger
        self.name = name
        self.prefix = prefix
        super(Spinner, self).__init__(*args, **kwargs)

    def start(self, text: Optional[str] = None) -> "Spinner":
        if self._spinner_id is None and self.enabled and self._check_stream():
            self.logger.start(self.name, prefix=self.prefix, tag="SPINNER_START")
            super().start(text)
        return self

    def stop(self) -> "Spinner":
        if self._spinner_id is not None:
            super().stop()
            self.logger.end(self.name, prefix=self.prefix, tag="SPINNER_END")
        return self


def write_list(fd: TextIO, data: Dict[str, Any], level: int = 0, indent_size: int = 4):
    for key, value in data.items():
        # A dictionary as value means that it contains a sublist (one level below the
        # current one)
        if isinstance(value, dict):
            fd.write(
                "{indent}- **{key}**\n".format(
                    indent=" " * level * indent_size, key=key
                )
            )
            write_list(fd, value, level=level + 1, indent_size=indent_size)
        else:
            fd.write(
                "{indent}- **{key}**: {value}\n".format(
                    indent=" " * level * indent_size, key=key, value=value
                )
            )


# NOTE: This relies on so called internals (i.e. attributes that start with an
# underscore, `_actions`  in this case). Argparse considers almost everything as an
# implementation detail except for the usual methods that can be called to add an
# argument and parse them. There is no public way to get the options that have been
# defined with `add_argument()`.
def extract_parser_options(
    parser: argparse.ArgumentParser,
) -> Tuple[Dict[str, Dict], Dict[str, Dict]]:
    positionals = {}
    options = {}
    for action in parser._actions:
        act = {}
        if action.default is not None and action.default != argparse.SUPPRESS:
            act["default"] = action.default
        if action.help and action.help != argparse.SUPPRESS:
            act["description"] = action.help
        if action.nargs is not None:
            act["count"] = action.nargs
        if action.choices is not None:
            act["choices"] = action.choices
        # The type is currently limited to string | int | float | flag
        # Everything else is just considered as string
        if action.type is None:
            if action.nargs == 0:
                # flag is the term used for an option that does not take any argument.
                act["type"] = "flag"
            else:
                default_value = act.get("default")
                if isinstance(default_value, int):
                    act["type"] = "int"
                elif isinstance(default_value, float):
                    act["type"] = "float"
                else:
                    act["type"] = "string"
        elif action.type == int:
            act["type"] = "int"
        elif action.type == float:
            act["type"] = "float"
        elif action.type == bool:
            act["type"] = "flag"
        else:
            act["type"] = "string"

        if len(action.option_strings) == 0:
            act["name"] = action.dest
            positionals[action.dest] = act
        else:
            for opt_name in action.option_strings:
                if opt_name.startswith("--"):
                    act["name"] = opt_name.lstrip("-")
                else:
                    act["short"] = opt_name.lstrip("-")
            if "name" not in act:
                act["name"] = act.get("short") or action.dest
            options[action.dest] = act
    return positionals, options


def assign_args_to_options(
    args: argparse.Namespace,
    positionals: Dict[str, Dict],
    options: Dict[str, Dict],
) -> Dict[str, Union[List, Dict]]:
    pos = []
    opts = {}
    for key, value in vars(args).items():
        # None values are not saved, they just cause trouble because they are null and
        # undefined, and they should rather not be present than being null.
        if value is None:
            continue
        if key in positionals:
            pos.append(value)
        else:
            o = options.get(key)
            if o is not None:
                name = o.get("name") or key
                opts[name] = value
    out: Dict[str, Union[List, Dict]] = {}
    if len(pos) > 0:
        out["positional"] = pos
    if len(opts) > 0:
        out["options"] = opts
    return out


def pad_table_row(row: List[str], widths: List[int], value: str = " ") -> List[str]:
    return [
        "{field:{pad}<{width}}".format(field=field, pad=value, width=width)
        for field, width in zip(row, widths)
    ]
