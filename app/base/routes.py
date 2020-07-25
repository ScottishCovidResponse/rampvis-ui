from flask import jsonify, render_template, redirect, request, url_for, g, flash, session
from flask_login import (current_user, login_required, login_user, logout_user)

from app.base.forms import LoginForm, CreateAccountForm
from app.base import blueprint

from app.base.user import User
from app import db, login_manager
import app.service.service as service


# @blueprint.route('/')
# def route_default():
#     return redirect(url_for('base_blueprint.login'))
#

@blueprint.route('/error-<error>')
def route_errors(error):
    return render_template('errors/{}.html'.format(error))


#
# Errors
#

@login_manager.unauthorized_handler
def unauthorized_handler():
    return render_template('errors/403.html'), 403


@blueprint.errorhandler(403)
def access_forbidden(error):
    return render_template('errors/403.html'), 403


@blueprint.errorhandler(404)
def not_found_error(error):
    return render_template('errors/404.html'), 404


@blueprint.errorhandler(500)
def internal_error(error):
    return render_template('errors/500.html'), 500


#
# GitHub login
#

@blueprint.route('/github-login', methods=['GET', 'POST'])
def github_login():
    return service.github_login()


@blueprint.route('/github-callback/', methods=['GET', 'POST'])
def github_callback():
    token = request.args.get('token')
    print('github_callback: token = ', token)

    user = service.get_user(token)
    print('github_callback: user = ', user)

    if token is None or user is None:
        login_form = LoginForm(request.form)
        return render_template('login/login.html', msg='Wrong user or password', form=login_form)

    _user = User.query.filter_by(user_id=user['id']).first()
    if _user is None:
        _user = User(user['id'], user['githubId'], user['githubUsername'])
        db.session.add(_user)
        db.session.commit()

    print('github_callback: _user = ', _user)
    session['token'] = token
    session['user'] = user['githubUsername']

    login_user(_user)

    return redirect(url_for('home_blueprint.portal'))


@blueprint.route('/logout')
def logout():
    session.pop('token', None)
    logout_user()
    return redirect(url_for('base_blueprint.login'))


@blueprint.route('/login', methods=['GET', 'POST'])
def login():
    login_form = LoginForm(request.form)
    return render_template('login/login.html', form=login_form)


@blueprint.route('/shutdown')
def shutdown():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()
    return 'Server shutting down...'
