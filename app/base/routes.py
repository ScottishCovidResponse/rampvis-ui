from flask import jsonify, render_template, redirect, request, url_for

from app.base import blueprint


@blueprint.route('/')
def route_default():
    return redirect(url_for('home_blueprint.index'))


@blueprint.route('/error-<error>')
def route_errors(error):
    return render_template('errors/{}.html'.format(error))


# Errors

@blueprint.errorhandler(403)
def access_forbidden(error):
    return render_template('errors/403.html'), 403

@blueprint.errorhandler(404)
def not_found_error(error):
    return render_template('errors/404.html'), 404

@blueprint.errorhandler(500)
def internal_error(error):
    return render_template('errors/500.html'), 500
