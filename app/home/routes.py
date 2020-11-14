from flask import render_template, redirect, url_for, request, session
from flask_login import login_required, current_user
from jinja2 import TemplateNotFound

from app.home import blueprint
import app.service.service as service
import app.service.ontology as ontology


@blueprint.route('/')
def route_default():
    return redirect(url_for('home_blueprint.route_scotland'))


@blueprint.route('/scotland')
def route_scotland():
    print('route_scotland:')

    page_data = ontology.get_page_by_name('scotland')

    print('route_template_vis: page_data = ', page_data)

    try:
        return render_template('scotland.html', option=page_data)

    except TemplateNotFound:
        return render_template('page-404.html'), 404

    except:
        return render_template('page-500.html'), 500


@blueprint.route('/<page_name>')
def route_vis(page_name):
    print('route_template_vis: page_name = ', page_name)

    if page_name == 'page-blank':
        return render_template('page-blank.html')

    page_data = ontology.get_page_by_name(page_name)
    print('route_template_vis: page_data = ', page_data)

    try:
        return render_template('template-vis.html', option=page_data)

    except TemplateNotFound:
        return render_template('page-404.html'), 404

    except:
        return render_template('page-500.html'), 500


@blueprint.route('/portal')
def route_portal():
    if not current_user.is_authenticated:
        return redirect(url_for('base_blueprint.route_login'))

    result = service.get_bookmarks()
    return render_template('portal.html', option=result)


@blueprint.route('/dashboards')
def route_dashboards():
    print('dashboards:')
    try:
        table = ontology.get_pages_by_type('dashboard')
        print('dashboards: data = ', table)
        return render_template('dashboards.html', table=table)

    except TemplateNotFound:
        return render_template('page-404.html'), 404

    except:
        return render_template('page-500.html'), 500


@blueprint.route('/plots')
def route_plots():
    print('plots:')

    try:
        table = ontology.get_pages_by_type('plot')
        print('plots: data = ', table)
        return render_template('plots.html', table=table)

    except TemplateNotFound:
        return render_template('page-404.html'), 404

    except:
        return render_template('page-500.html'), 500


@blueprint.route('/analytics')
def route_analytics():
    print('analytics:')

    try:
        table = ontology.get_pages_by_type('analytics')
        print('plots: data = ', table)
        return render_template('analytics.html', table=table)

    except TemplateNotFound:
        return render_template('page-404.html'), 404

    except:
        return render_template('page-500.html'), 500


@blueprint.route('/dynamic')
def route_dynamic():
    print('dynamic:')

    try:
        table = ontology.get_pages_by_type('dynamic')
        print('plots: data = ', table)
        return render_template('dynamic.html', table=table)

    except TemplateNotFound:
        return render_template('page-404.html'), 404

    except:
        return render_template('page-500.html'), 500


@blueprint.route('/search', methods=['GET'])
def route_search():
    query = request.args.get('query')
    print('route_search: search: query = ', query)

    if query:
        result = service.search(query)
        return render_template('search.html', data={'query': query, 'result': result})

    return render_template('search.html', data={})


@blueprint.route('/settings', methods=['GET'])
@login_required
def route_settings():
    print('route_settings:')
    print('route_settings: token = ', session.get('token '))

    try:
        return render_template('settings.html')

    except TemplateNotFound:
        return render_template('page-404.html'), 404

    except:
        return render_template('page-500.html'), 500


@blueprint.route('/all-pages')
def route_all_pages():
    print('route_all_pages:')

    try:
        table = ontology.get_all_pages()
        print('route_all_pages: page_data = ', table)
        return render_template('all-pages.html', table=table)

    except TemplateNotFound:
        return render_template('page-404.html'), 404

    except:
        return render_template('page-500.html'), 500


@blueprint.route('/onto-pages')
def route_onto_pages():
    print('route_onto_pages:')
    try:
        onto_pages = service.get_onto_pages()
        print('route_onto_pages: onto_pages = ', onto_pages)
        return render_template('onto-pages.html', table=onto_pages)
    except TemplateNotFound:
        return render_template('page-404.html'), 404
    except:
        return render_template('page-500.html'), 500


@blueprint.route('/onto-page/<id>')
def route_onto_page(id):
    print('route_onto_page: id = ', id)

    page_data = service.get_onto_page_by_id(id)
    print('route_onto_page: page_data = ', page_data)

    try:
        return render_template('template-vis.html', option=page_data)
    except TemplateNotFound:
        return render_template('page-404.html'), 404
    except:
        return render_template('page-500.html'), 500


@blueprint.route('/profile')
@login_required
def profile():
    if not current_user.is_authenticated:
        return redirect(url_for('base_blueprint.route_login'))

    return render_template('profile.html')
