from app.home import blueprint
from flask import render_template, redirect, url_for
from jinja2 import TemplateNotFound

@blueprint.route('/dashboard')
def index():
    return render_template('dashboard.html')

@blueprint.route('/<page>')
def route_template(page):
    try:
        return render_template(page + '.html')

    except TemplateNotFound:
        return render_template('page-404.html'), 404
    
    except:
        return render_template('page-500.html'), 500
