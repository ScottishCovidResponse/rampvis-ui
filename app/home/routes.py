from app.home import blueprint
from flask import render_template, redirect, url_for
from flask_login import login_required, current_user
from jinja2 import TemplateNotFound


@blueprint.route('/')
@login_required
def route_default():
    return redirect(url_for('home_blueprint.portal'))


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
def route_template_overviews(page):
    onto_data = {
        "data": {
            'url': 'http://vis.scrc.uk/api/v1/scotland/cumulative',
            'title': 'Cumulative Number of Cases Tested Positive for COVID-19',
            'description': 'Cumulative Number of Cases Tested Positive for COVID-19 in all 14 Scotland regions',
        },
        "vis": {
            'description': '(Click on location label to go to regional overview and on the chart to a detailed view)',
        },
        "page": {
            'name': 'overview-top-level-screen-a.html',
            'type': 'overview',
            'links': ''
        }
    }

    try:
        return render_template('overviews/' + page + '.html', option=onto_data)

    except TemplateNotFound:
        return render_template('page-404.html'), 404

    except:
        return render_template('page-500.html'), 500


@blueprint.route('/test/<page>')
def route_template_overview(page):
    onto_data = {
        "data": {
            'url': 'http://vis.scrc.uk/api/v1/scotland/cumulative',
            'title': 'Cumulative Number of Cases Tested Positive for COVID-19',
            'description': 'Cumulative Number of Cases Tested Positive for COVID-19 in all 14 Scotland regions',
        },
        "vis": {
            'description': '(Click on location label to go to regional overview and on the chart to a detailed view)',
        },
        "page": {
            'name': 'overview-top-level-screen-a.html',
            'type': 'test',
            'links': ''
        }
    }

    try:
        return render_template('test/' + page + '.html', option=onto_data)

    except TemplateNotFound:
        return render_template('page-404.html'), 404

    except:
        return render_template('page-500.html'), 500
