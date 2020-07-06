import requests
import json
import jwt
from flask import redirect, request, json

BASE_URL = 'http://localhost:2000/api/v1'


def github_login():
    return redirect(BASE_URL + '/auth/github-login')

def user_info(token):
    if token:
        decoded_token = jwt.decode(token, verify=False)
    else:
        return None

    user_id = decoded_token.get('id')
    headers = {'content-type': 'application/json', 'Authorization': 'Bearer ' + token}
    response = requests.get(BASE_URL + '/user/' + user_id, headers=headers)

    user = json.loads(response.content)
    print('service: user_info: user = ', user)
    return user





def login_github1(github_id, github_login):
    data = {"githubId": github_id, "githubLogin": github_login}

    response = requests.post(BASE_URL + '/auth/github', data=data)
    token = json.loads(response.content).get('token')

    print('service: login: data = ', data, 'token = ', token)
    return token


def login(username, password):
    data = {"email": username, "password": password}

    response = requests.post(BASE_URL + '/auth/login', data=data)
    token = json.loads(response.content).get('token')

    print('service: login: data = ', data, 'token = ', token)
    return token


