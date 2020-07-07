import requests
import json
import jwt
from flask import redirect, request, json, session

BASE_URL = 'http://localhost:2000/api/v1'


def github_login():
    return redirect(BASE_URL + '/auth/github-login')


def get_user(token):
    if token:
        decoded_token = jwt.decode(token, verify=False)
    else:
        return None

    user_id = decoded_token.get('id')
    headers = {'content-type': 'application/json', 'Authorization': 'Bearer ' + token}
    response = requests.get(BASE_URL + '/user/' + user_id, headers=headers)

    user = json.loads(response.content)
    print('service: get_user: user = ', user)
    return user


def get_bookmarks(token):
    print('get_bookmarks: session[token] = ', token['token'])
    # if token:
    #     decoded_token = jwt.decode(token, verify=False)
    # else:
    #     return None
    #
    # user_id = decoded_token.get('id')
    # headers = {'content-type': 'application/json', 'Authorization': 'Bearer ' + token}
    # response = requests.get(BASE_URL + '/user/' + user_id, headers=headers)
    #
    # user = json.loads(response.content)
    # print('service: get_user: user = ', user)
    # return user
