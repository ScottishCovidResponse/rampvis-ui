from flask import jsonify, render_template, redirect, request, url_for, g, flash, session
from flask_login import (current_user, login_required, login_user, logout_user)

from app.base.forms import LoginForm, CreateAccountForm
from app.base import blueprint

from app.service.github import github
from app.base.user import User
from app import db, login_manager
import app.service.service  as service

@blueprint.route('/')
def route_default():
    return redirect(url_for('base_blueprint.login'))


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
# Login with email password
# TODO refactor
#
@blueprint.route('/login', methods=['GET', 'POST'])
def login():
    login_form = LoginForm(request.form)
    return render_template('login/login.html', form=login_form)

    if 'login' in request.form:

        # read form data
        username = request.form['username']
        password = request.form['password']

        login_form = LoginForm(request.form)

        if 'login' in request.form:
            pass
            # read form data
            username = request.form['username']
            password = request.form['password']

            #     token = service.login(username, password)
            #     user = service.user_info(token)
            #     if user:
            #         login_user(User(**user))
            #         return redirect(url_for('base_blueprint.route_default'))
            #
            #     # Something (user or pass) is not ok
            # return render_template('login/login.html', msg='Wrong user or password', form=login_form)

        # # Locate user
        # user = User.query.filter_by(username=username).first()
        #
        # # Check the password
        # if user and verify_pass(password, user.password):
        #     print('base/routes.py: login:', user, verify_pass(password, user.password))
        #     # admin, True
        #
        #     login_user(user)
        #     return redirect(url_for('base_blueprint.route_default'))
        #
        # # Something (user or pass) is not ok
        # return render_template('login/login.html', msg='Wrong user or password', form=login_form)

        if not current_user.is_authenticated:
            return render_template('login/login.html', form=login_form)

        #    return redirect(url_for('home_blueprint.index'))


#
# GitHub login
#

@blueprint.route('/login-github', methods=['GET', 'POST'])
def login_github():
    return github.authorize()


@blueprint.route('/callback-github', methods=['GET', 'POST'])
@github.authorized_handler
def authorized(access_token):
    print('callback: authorized: access_token = ', access_token)
    # print('callback: authorized: profile = ', github.get_profile(oauth_token))

    if access_token is None:
        login_form = LoginForm(request.form)
        return render_template('login/login.html', msg='Wrong user or password', form=login_form)

    user = User.query.filter_by(github_access_token=access_token).first()
    if user is None:
        user = User(access_token)

    user.github_access_token = access_token
    g.user = user
    info = github.get('/user')
    github_id = info['id']
    username = info['login']

    existing_user = User.query.filter_by(username=username).first()
    print('authorized: existing_user = ', existing_user)
    if existing_user is None:
        db.session.add(user)
        user.github_id = github_id
        user.username = username
        user.login_count = 0
        login_user(user)

    else:
        existing_user.github_id = github_id
        existing_user.username = username
        existing_user.login_count += 1
        login_user(existing_user)

    db.session.commit()

    token = service.login_github(github_id, username)
    session['token'] = token
    print('authorized: user = ', user, 'token = ', token)
    return redirect(url_for('home_blueprint.portal'))


@github.access_token_getter
def token_getter():
    user = g.user
    if user is not None:
        return user.github_access_token


@blueprint.route('/logout')
def logout():
    session.pop('token', None)
    logout_user()
    return redirect(url_for('base_blueprint.login'))


#
# Register user with user and password
# TODO
#
@blueprint.route('/register', methods=['GET', 'POST'])
def create_user():
    create_account_form = CreateAccountForm(request.form)
    if 'register' in request.form:
        username = request.form['username']
        email = request.form['email']

    #     user = User.query.filter_by(username=username).first()
    #     if user:
    #         return render_template('login/register.html', msg='Username already registered', form=create_account_form)
    #
    #     user = User.query.filter_by(email=email).first()
    #     if user:
    #         return render_template('login/register.html', msg='Email already registered', form=create_account_form)
    #
    #     # else we can create the user
    #     user = User(**request.form)
    #     db.session.add(user)
    #     db.session.commit()
    #
    #     return render_template('login/register.html', msg='User created please <a href="/login">login</a>',
    #                            form=create_account_form)
    #
    # else:
    #     return render_template('login/register.html', form=create_account_form)


@blueprint.route('/shutdown')
def shutdown():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()
    return 'Server shutting down...'
