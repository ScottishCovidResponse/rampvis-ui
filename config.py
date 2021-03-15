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

    DATA_API = os.environ.get('DATA_API')
    STAT_API = os.environ.get('STAT_API')
    API_PY = os.environ.get('API_PY')
    API_JS = os.environ.get('API_JS')

    MONGODB_URL = os.environ.get('MONGODB_URL')


class ProductionConfig(Config):
    DEBUG = False

    # Security
    SESSION_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_DURATION = 3600


class DebugConfig(Config):
    DEBUG = True


config_dict = {
    'Production': ProductionConfig,
    'Debug': DebugConfig
}
