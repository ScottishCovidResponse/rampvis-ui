import os
from os import environ


class Config(object):
    basedir = os.path.abspath(os.path.dirname(__file__))

    SECRET_KEY = 'key'

    # This will create a file in <app> FOLDER
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'database.db')
    # For 'in memory' database, please use:
    # SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # THEME SUPPORT
    #  if set then url_for('static', filename='', theme='')
    #  will add the theme name to the static URL:
    #    /static/<DEFAULT_THEME>/filename
    # DEFAULT_THEME = "themes/dark"
    DEFAULT_THEME = None

    ONTOLOGY_JSON_DB = os.path.join(basedir, 'TODO/ontology.json')


class ProductionConfig(Config):
    DEBUG = False

    # Security
    SESSION_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_DURATION = 3600

    DATA_API = 'http://vis.scrc.uk/api/v1'
    STAT_API = 'http://vis.scrc.uk/stat/v1'


class DebugConfig(Config):
    DEBUG = True

    DATA_API = 'http://localhost:2000/api/v1'
    STAT_API = 'http://localhost:3000/stat/v1'


config_dict = {
    'Production': ProductionConfig,
    'Debug': DebugConfig
}
