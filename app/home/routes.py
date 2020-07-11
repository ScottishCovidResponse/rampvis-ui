from app.home import blueprint
from flask import render_template, redirect, url_for
from flask_login import login_required, current_user
from jinja2 import TemplateNotFound

import app.service.ontology as ontology


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


#
# Alfie's
#
@blueprint.route('/overviews/<page>')
def route_template_overviews(page):
    try:
        return render_template('overviews/' + page + '.html')

    except TemplateNotFound:
        return render_template('page-404.html'), 404

    except:
        return render_template('page-500.html'), 500


#
# Ben's
#
@blueprint.route('/ben/<page>')
def route_template_ben(page):
    try:
        return render_template('ben/' + page + '.html')

    except TemplateNotFound:
        return render_template('page-404.html'), 404

    except:
        return render_template('page-500.html'), 500


#
# Saiful's
#
@blueprint.route('/test/<page_name>')
def route_template_test(page_name):
    print('page_name = ', page_name)

    page_data = ontology.get_page_data(page_name)
    page_type = page_data.get('page', {}).get('type')

    print('route_template_test: page_data = ', page_data)
    print('route_template_test: page.type = ', page_data.get('page', {}).get('type'))

    try:
        if page_type == 'overview-a':
            return render_template('test/' + 'template-overview-a.html', option=page_data)
        elif page_type == 'overview-b':
            return render_template('test/' + 'template-overview-b.html', option=page_data)
        elif page_type == 'details':
            return render_template('test/' + 'template-details.html', option=page_data)

        else:
            return render_template('page-404.html'), 404

    except TemplateNotFound:
        return render_template('page-404.html'), 404

    except:
        return render_template('page-500.html'), 500


@blueprint.route('/test/table/<table_name>')
def route_template_test_table(table_name):
    print('route_template_test_table: table_name = ', table_name)

    try:
        # page_data = ontology.get_page_data(table_name)
        # page_type = page_data.get('page', {}).get('type')
        table = ontology.get_pages_table(table_name)
        print('route_template_test: page_data = ', table)
        return render_template('test/' + 'template-table.html', table=table)

    except TemplateNotFound:
        return render_template('page-404.html'), 404

    except:
        return render_template('page-500.html'), 500
