from flask import Blueprint

blueprint = Blueprint(
    'home_blueprint',
    __name__,
    url_prefix='',
    template_folder='pages',
    static_folder='static'
)
