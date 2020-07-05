from flask_migrate import Migrate
from os import environ
from sys import exit
from pprint import pprint

from config import config_dict
from app import create_app, db

get_config_mode = environ.get('APPSEED_CONFIG_MODE', 'Debug')

try:
    config = config_dict[get_config_mode.capitalize()]
    print('run.py: config: ')
    pprint(vars(config))

except KeyError:
    exit('Error: Invalid APPSEED_CONFIG_MODE environment variable entry.')


app = create_app(config)
Migrate(app, db)

if __name__ == "__main__":
    app.run()
