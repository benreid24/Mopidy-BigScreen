import logging
import pathlib

import pkg_resources
from mopidy import config, ext
import tornado.web

__version__ = pkg_resources.get_distribution("Mopidy-BigScreen").version

logger = logging.getLogger(__name__)


class BigscreenRequestHandler(tornado.web.RequestHandler):
    def initialize(self, config):
        cfg = dict(config["bigscreen"])
        self.result = {"add_url": cfg.get("add_url", "")}

    def get(self):
        self.write(self.result)
        self.set_header("Content-Type", "application/json")


def bigscreen_factory(config, core):
    return [("/config", BigscreenRequestHandler, {"config": config})]


class Extension(ext.Extension):
    dist_name = "Mopidy-BigScreen"
    ext_name = "bigscreen"
    version = __version__

    def get_default_config(self):
        return config.read(pathlib.Path(__file__).parent / "ext.conf")

    def get_config_schema(self):
        schema = super().get_config_schema()
        schema["add_url"] = config.String(optional=True)
        return schema

    def setup(self, registry):
        registry.add(
            "http:static",
            {
                "name": self.ext_name,
                "path": str(pathlib.Path(__file__).parent / "static"),
            },
        )
        registry.add(
            "http:app",
            {
                "name": self.ext_name,
                "factory": bigscreen_factory,
            },
        )
