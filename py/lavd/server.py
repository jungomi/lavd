import argparse
import asyncio
import os
import sys

import simplejson
import tornado.ioloop
import tornado.web
from halo import Halo
from tornado import locks
from tornado.iostream import StreamClosedError

from .data import Data
from .fs import FileWatcher, gather_data
from .version import __version__

default_port = 4343
package_dir = os.path.dirname(os.path.abspath(__file__))


class Application(tornado.web.Application):
    """
    Main tornado application
    """

    def __init__(self, log_dir: str, debug: bool = False):
        self.log_dir = log_dir
        self.debug = debug
        self.data = self.load_data()
        self.update_lock = locks.Condition()
        handlers: tornado.routing._RuleList = [
            (r"/api/(.*)", ApiHandler, {"app": self}),
            (r"/data/(.*)", tornado.web.StaticFileHandler, {"path": log_dir}),
            # Server Sent Events (SSE) to push new data to the client
            (r"/events", EventHandler, {"app": self}),
            # Those are the static files shipped with the package, i.e. the frontend
            (
                r"/(.*)",
                FrontendFileHandler,
                {
                    "path": os.path.join(
                        package_dir,
                        "static",
                    ),
                    "default_filename": "index.html",
                },
            ),
        ]
        self.file_watcher = FileWatcher(self.log_dir, self.data, self.update_lock)
        super(Application, self).__init__(handlers, debug=debug, compress_response=True)

    def load_data(self) -> Data:
        with Halo("Scanning files"):
            return gather_data(self.log_dir)


class ApiHandler(tornado.web.RequestHandler):
    """
    Handler for the API to request the data
    """

    def initialize(self, app: Application):
        self.app = app

    async def get(self, url: str):
        if url == "all":
            self.set_header("Content-Type", "application/json; charset=UTF-8")
            # The data may contain NaNs, and the regular JSON encoder creates NaN values
            # in the JSON, which are not allowed. With simplejson they can be replaced
            # with null.
            self.write(simplejson.dumps(self.app.data.truncated, ignore_nan=True))
        else:
            parts = url.split("/", 3)
            if len(parts) == 4:
                kind, name, step, category = parts
                if step == "global":
                    data = self.app.data.get(kind, name, step, category)
                elif step.isdigit():
                    data = self.app.data.get(kind, name, int(step), category)

                if data is not None:
                    self.set_header("Content-Type", "application/json; charset=UTF-8")
                    self.write(simplejson.dumps(data, ignore_nan=True))
                    return
            raise tornado.web.HTTPError(404)


class EventHandler(tornado.web.RequestHandler):
    """
    Handler for the Server Sent Events to publish newly discovered data to the client
    """

    def initialize(self, app: Application):
        self.app = app
        self.wait_future = None
        self.set_header("content-type", "text/event-stream")
        self.set_header("cache-control", "no-cache")
        self.set_header("connection", "keep-alive")

    async def publish(self):
        try:
            event_id = 0
            self.wait_future = self.app.update_lock.wait()
            while True:
                # This is extremely silly. What would be done is that the wait() future
                # is awaited and when it's resolved, the data is written and the loop
                # starts over (waits again). But for some unknown reason it just
                # doesn't resolve at all, even though notify_all() is called and all
                # waiters are "finished".
                # To work around that silliness, the loop waits for 1 sec and checks if
                # the future is resolved and if that's the case the data is written
                # (since the file watcher has notified that a change happened) and it
                # begins with a new future.
                # NOTE: That problem did not occur with debug=True, but oh well.
                await tornado.gen.sleep(1)
                if self.wait_future.done():
                    event_id += 1
                    self.wait_future = self.app.update_lock.wait()
                    self.write("event: data\n")
                    self.write("id: {}\n".format(event_id))
                    self.write(
                        "data: {}\n\n".format(
                            simplejson.dumps(self.app.data.truncated, ignore_nan=True)
                        )
                    )
                    await self.flush()
        except (StreamClosedError, asyncio.CancelledError):
            return

    async def get(self):
        await self.publish()

    # Automatically called when the client closes the connection
    def on_connection_close(self):
        if self.wait_future is not None:
            self.wait_future.cancel()


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
    app = Application(log_dir, debug=debug)
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
    # Python 3.8 on Windows switched to a Proactor event loop, but tornado requires the
    # Selector, since the Proactor doesn't support some needed APIs (yet).
    if sys.platform == "win32" and sys.version_info[:2] == (3, 8):
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    main()
