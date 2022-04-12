import os
from typing import Optional, Union

EXTENSIONS = dict(
    json=[".json"],
    log=[".log"],
    text=[".txt", ".text"],
    markdown=[".markdown", ".mdown", ".mkdn", ".mkd", ".md"],
    image=[
        ".jpg",
        ".jpeg",
        ".jpe",
        ".jif",
        ".jfif",
        ".jfi",
        ".png",
        ".gif",
        ".tiff",
        ".tif",
        ".bmp",
        ".dib",
        ".heif",
        ".heic",
        ".jp2",
        ".j2k",
        ".jpf",
        ".jpx",
        ".jpm",
        ".mj2",
    ],
)

SAVE_ALL_EXTENSIONS = [".gif", ".tiff", ".tif"]


def categorise_file(path: Union[str, os.PathLike]) -> Optional[str]:
    lower_case = os.fspath(path).lower()
    for category, extensions in EXTENSIONS.items():
        for ext in extensions:
            if lower_case.endswith(ext):
                return category
    return None
