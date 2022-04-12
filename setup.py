import json
import os
import subprocess
from pathlib import Path
from typing import Union

from setuptools import setup


def read_file(path: Union[str, os.PathLike]) -> str:
    with open(path, "r", encoding="utf-8") as fd:
        return fd.read()


def read_version(path: Union[str, os.PathLike]) -> str:
    with open(path, "r", encoding="utf-8") as fd:
        return json.load(fd)["version"]


root_dir = Path(__file__).absolute().parent

version = read_version("package.json")
readme = read_file("README.md")

requirements = ["halo", "Pillow", "simplejson", "tornado", "tqdm", "watchdog"]


try:
    git_hash = (
        subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=root_dir)
        .strip()
        .decode("utf-8")
    )
except subprocess.CalledProcessError:
    git_hash = "Unknown"


def generate_version():
    with open(
        root_dir / "py" / "lavd" / "version.py", "w", encoding="utf-8"
    ) as version_fd:
        version_fd.write('__version__ = "{}"\n'.format(version))
        version_fd.write('git_commit = "{}"\n'.format(git_hash))


if __name__ == "__main__":
    generate_version()

    setup(
        name="lavd",
        description="Log and Visualise Data",
        long_description=readme,
        long_description_content_type="text/markdown",
        license="MIT",
        author="Michael Jungo",
        author_email="michaeljungo92@gmail.com",
        url="https://github.com/jungomi/lavd",
        packages=["lavd"],
        package_dir={"": "py"},
        package_data={"lavd": ["static/*", "static/*/*"]},
        include_package_data=True,
        python_requires=">=3.7",
        install_requires=requirements,
        version=version,
        zip_safe=False,
        keywords=["log", "visualise", "visualize", "data"],
        classifiers=[
            "Development Status :: 4 - Beta",
            "License :: OSI Approved :: MIT License",
            "Programming Language :: Python :: 3.7",
            "Programming Language :: Python :: 3.8",
            "Programming Language :: Python :: 3.9",
            "Programming Language :: Python :: 3.10",
            "Operating System :: OS Independent",
            "Topic :: System :: Logging",
            "Topic :: Scientific/Engineering :: Visualization",
            "Typing :: Typed",
        ],
        entry_points={"console_scripts": ["lavd=lavd.server:main"]},
    )
