import argparse
import os
import pathlib
import subprocess
import sys
import time
from datetime import datetime
from typing import Any, Dict, List, Optional, TextIO, Union

from halo import Halo
from tqdm import tqdm

try:
    import torch
    import torch.nn as nn

    HAS_TORCH = True
except ImportError:
    HAS_TORCH = False


class Logger(object):
    name: str
    delimiter: str
    num_digits: int
    indent_size: int
    created_timestamp: datetime
    log_dir: pathlib.Path
    repo_path: Optional[str]
    git_hash: Optional[str]
    events_file: Optional[TextIO]
    stdout_file: Optional[TextIO]
    stderr_file: Optional[TextIO]
    events_time: Dict[str, float]

    def __init__(
        self,
        name: str,
        log_dir: str = "./log",
        num_digits: int = 4,
        indent_size: int = 4,
        delimiter: str = "\t",
    ):
        """
        Arguments:
            name (str):
                Name of the experiment
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
        """
        super(Logger, self).__init__()
        self.name = name
        self.delimiter = delimiter
        self.num_digits = num_digits
        self.indent_size = indent_size
        self.created_timestamp = datetime.now()
        self.log_dir = pathlib.Path(log_dir, name)
        try:
            self.repo_path = (
                subprocess.check_output(["git", "rev-parse", "--show-toplevel"])
                .strip()
                .decode("utf-8")
            )
            self.git_hash = (
                subprocess.check_output(
                    ["git", "rev-parse", "HEAD"], cwd=self.repo_path,
                )
                .strip()
                .decode("utf-8")
            )
        except subprocess.CalledProcessError:
            self.repo_path = None
            self.git_hash = None
        self.events_file = None
        self.stdout_file = None
        self.stderr_file = None
        self.prefix = ""
        self.events_time = {}
        self.log_dir.mkdir(parents=True, exist_ok=True)

    def __del__(self):
        if self.events_file is not None:
            self.events_file.close()
        if self.stdout_file is not None:
            self.stdout_file.close()
        if self.stderr_file is not None:
            self.stderr_file.close()

    def get_start_time(self) -> str:
        return self.created_timestamp.strftime("%Y-%m-%d %H:%M:%S")

    def get_file_path(
        self, name: str, step: Optional[int] = None, extension: str = ""
    ) -> pathlib.Path:
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

    def progress_bar(self, name: str, *args, prefix: bool = True, **kwargs):
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
            ProgressBar:
                Can be use exactly like a tqdm() progress bar.
        """
        # The prefixed is added to the description if desired. When no description is
        # provided, the name is used as the description.
        description = kwargs.get("desc") or name
        kwargs["desc"] = (
            "{} {}".format(self.prefix, description) if prefix else description
        )
        return ProgressBar(self, name, prefix, *args, **kwargs)

    def spinner(self, name: str, *args, prefix: bool = True, **kwargs):
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
            Spinner:
                Can be use exactly like a Halo() spinner.
        """
        # The prefixed is added to the text if desired. When no text is provided, the
        # name is used as the text.
        text = kwargs.get("text") or name
        kwargs["text"] = "{} {}".format(self.prefix, text) if prefix else text
        return Spinner(self, name, prefix, *args, **kwargs)

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
        """
        try:
            diff = subprocess.check_output(
                ["git", "diff", "HEAD"], cwd=self.repo_path,
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
            fd.write(
                "- **Git Commit**: {}\n".format(
                    "-" if self.git_hash is None else self.git_hash
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
                fd.write("```diff\n")
                fd.write(diff)
                fd.write("```\n")

            if sections is not None:
                for section_title, section_content in sections.items():
                    fd.write("\n")
                    fd.write("## {}\n\n".format(section_title))
                    if isinstance(section_content, list):
                        for line in section_content:
                            fd.write("{}\n".format(line))
                    else:
                        fd.write("{}\n".format(section_content))

    # The type annotation is given as string because torch might not be available, this
    # allows to still make it work while having type checking as well.
    def save_model(
        self,
        model: "Union[nn.Module, nn.DataParallel, nn.parallel.DistributedDataParallel]",
        step: Optional[int] = None,
        name: str = "model",
        extension: str = ".pt",
    ):
        """
        Saves the state/checkpoint of the model, to be compatible with the actual model,
        multi GPU/Node models (nn.DataParallel and nn.parallel.DistributedDataParallel)
        are automatically unwrapped.

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
        path = self.get_file_path(name, step, extension=".pt")
        path.parent.mkdir(parents=True, exist_ok=True)
        torch.save(state_dict, path)


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

    def start(self, text: Optional[str] = None):
        if self._spinner_id is None and self.enabled and self._check_stream():
            self.logger.start(self.name, prefix=self.prefix, tag="SPINNER_START")
            super().start(text)
        return self

    def stop(self):
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
