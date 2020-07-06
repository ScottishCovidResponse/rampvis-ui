from flask_login import UserMixin
from sqlalchemy import Column, Integer, String

from app import db, login_manager


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    user_id = Column(String, unique=True)
    github_id = Column(String, unique=True)
    username = Column(String, unique=True)

    def __init__(self, user_id, github_id, github_username):
        self.user_id = user_id
        self.github_id = github_id
        self.username = github_username

    def __repr__(self):
        return str(self.__dict__)


@login_manager.user_loader
def user_loader(id):
    return User.query.filter_by(id=id).first()


@login_manager.request_loader
def request_loader(request):
    username = request.form.get('username')

    print('user: request_loader: request.username = ', username)

    user = User.query.filter_by(username=username).first()
    return user if user else None
