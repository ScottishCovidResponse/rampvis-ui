from flask import render_template, redirect, url_for, request, session
from flask_login import login_required, current_user
from jinja2 import TemplateNotFound

from app.home import blueprint
import app.service.service as service
import app.service.ontology as ontology


@blueprint.route('/')
@login_required
def route_default():
    return redirect(url_for('home_blueprint.portal'))


@blueprint.route('/portal')
@login_required
def portal():
    if not current_user.is_authenticated:
        return redirect(url_for('base_blueprint.login'))

    result = service.get_bookmarks()

    return render_template('portal.html', option=result)


@blueprint.route('/<page_name>')
def route_template_vis(page_name):
    print('route_template_vis: page_name = ', page_name)

    page_data = ontology.get_page_by_name(page_name)

    print('route_template_vis: page_data = ', page_data)
    print('route_template_vis: page.type = ', page_data.get('page', {}).get('type'))

    try:
        return render_template('template-vis.html', option=page_data)

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


@blueprint.route('/search', methods=['GET'])
def route_search():
    query = request.args.get('query')
    print('route_search: search: query = ', query)

    # TODO use search form?
    # form = SearchForm(request.form)
    # if form.validate_on_submit():
    #     query = form.search.data
    #     # search

    if query:
        result = service.search(query)
        return render_template('search.html', data={'query': query, 'result': result})

    return render_template('search.html', data={})


@blueprint.route('/profile')
@login_required
def profile():
    if not current_user.is_authenticated:
        return redirect(url_for('base_blueprint.login'))

    return render_template('profile.html')


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
