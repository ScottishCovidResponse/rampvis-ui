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

    GITHUB_CLIENT_ID = environ.get('GITHUB_CLIENT_ID', 'cbca0ff10ae66019dab4')
    GITHUB_CLIENT_SECRET = environ.get('GITHUB_CLIENT_SECRET', 'f08df3d31535c903d38f57dba0e790a346418496')
    GITHUB_BASE_URL = environ.get('GITHUB_BASE_URL', 'https://api.github.com/')
    GITHUB_AUTH_URL = environ.get('GITHUB_AUTH_URL', 'https://github.com/login/oauth/')

    MONGO_URI = environ.get('MONGO_URI', 'mongodb+srv://dbuser:dbuserpass@cluster0.hil75.mongodb.net/development?retryWrites=true&w=majority')


class ProductionConfig(Config):
    DEBUG = False

    # Security
    SESSION_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_DURATION = 3600

    # PostgreSQL database
    SQLALCHEMY_DATABASE_URI = 'postgresql://{}:{}@{}:{}/{}'.format(
        environ.get('APPSEED_DATABASE_USER', 'appseed'),
        environ.get('APPSEED_DATABASE_PASSWORD', 'appseed'),
        environ.get('APPSEED_DATABASE_HOST', 'db'),
        environ.get('APPSEED_DATABASE_PORT', 5432),
        environ.get('APPSEED_DATABASE_NAME', 'appseed')
    )


class DebugConfig(Config):
    DEBUG = True


config_dict = {
    'Production': ProductionConfig,
    'Debug': DebugConfig
}
