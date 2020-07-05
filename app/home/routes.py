from app.home import blueprint
from flask import render_template, redirect, url_for
from flask_login import login_required, current_user
from jinja2 import TemplateNotFound


# @blueprint.route('/')
# @login_required
# def route_default():
#     return redirect(url_for('home_blueprint.portal'))

@blueprint.route('/portal')
@login_required
def portal():
    # if not current_user.is_authenticated:
    #     return redirect(url_for('base_blueprint.login'))
    return render_template('portal.html')


@blueprint.route('/<page>')
def route_template(page):
    try:
        return render_template(page + '.html')

    except TemplateNotFound:
        return render_template('page-404.html'), 404
    
    except:
        return render_template('page-500.html'), 500

@blueprint.route('/overviews/<page>')
def route_template_overview(page):
    try:
        return render_template('overviews/' + page + '.html')

    except TemplateNotFound:
        return render_template('page-404.html'), 404

    except:
        return render_template('page-500.html'), 500
