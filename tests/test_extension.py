from mopidy_bigscreen import Extension
from mopidy_bigscreen import frontend as frontend_lib


def test_get_default_config():
    ext = Extension()

    config = ext.get_default_config()

    assert "[bigscreen]" in config
    assert "enabled = true" in config


def test_get_config_schema():
    ext = Extension()

    schema = ext.get_config_schema()

    assert "add_url" in schema


# TODO Write more tests
