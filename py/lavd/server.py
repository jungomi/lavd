import argparse
import os

import tornado.ioloop
import tornado.web

from .version import __version__

default_port = 4343
package_dir = os.path.dirname(os.path.abspath(__file__))


class FrontendFileHandler(tornado.web.StaticFileHandler):
    """
    Handler to serve the frontend

    It's like a static file handler, except that when the file doesn't exist, index.html
    is served, regardless of the nesting of the path.
    """

    @classmethod
    def get_absolute_path(cls, root: str, path: str) -> str:
        abspath = super().get_absolute_path(root, path)
        if not os.path.exists(abspath):
            abspath = os.path.join(root, "index.html")
        return abspath


def run(log_dir: str, port: int = default_port, debug: bool = False):
    app = tornado.web.Application(
        [
            (r"/data/(.*)", tornado.web.StaticFileHandler, {"path": log_dir},),
            # Those are the static files shipped with the package, i.e. the frontend
            (
                r"/(.*)",
                FrontendFileHandler,
                {
                    "path": os.path.join(package_dir, "static",),
                    "default_filename": "index.html",
                },
            ),
        ],
        debug=debug,
    )
    app.listen(port)
    print("Running on http://localhost:{}".format(port))
    tornado.ioloop.IOLoop.current().start()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "log_dir", metavar="LOG_DIR", nargs=1, help="Directory containing the logs"
    )
    parser.add_argument("-v", "--version", action="version", version=__version__)
    parser.add_argument(
        "-p",
        "--port",
        dest="port",
        type=int,
        default=default_port,
        help="Port to run the server on [Default: {}]".format(default_port),
    )
    parser.add_argument(
        "--debug", dest="debug", action="store_true", help="Run server in debug mode"
    )
    return parser.parse_args()


def main():
    options = parse_args()
    run(options.log_dir[0], port=options.port, debug=options.debug)


if __name__ == "__main__":
    main()
