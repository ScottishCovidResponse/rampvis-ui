from pprint import pprint
from flask_login import UserMixin
from sqlalchemy import Column, Integer, String


from app import db, login_manager

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    github_access_token = Column(String(255))
    github_id = Column(String(255))
    username = Column(String(255))
    login_count = Column(Integer())

    def __init__(self, github_access_token):
        self.github_access_token = github_access_token

    def __repr__(self):
        return str(self.__dict__)


@login_manager.user_loader
def user_loader(user_id):
    return User.query.filter_by(id=user_id).first()

@login_manager.request_loader
def request_loader(request):
    print('user: request_loader: request = ')
    pprint(vars(request.form))

    username = request.form.get('username')
    user = User.query.filter_by(username=username).first()
    return user if user else None
