import requests
import json
import jwt
from flask import redirect, request, json, session
import os

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


def get_ontology_data(page_id):
    print('page_id = ', page_id)

    SRCDIR = os.path.dirname(os.path.abspath(__file__))
    ONTOLOGY_JSON_DB = os.path.join(SRCDIR, 'database/ontology.json')
    print('ONTOLOGY_JSON_DB = ', ONTOLOGY_JSON_DB)
    with open(ONTOLOGY_JSON_DB) as json_file:
        d = json.load(json_file)

    pages = d.get('pages')
    page_obj = [x for x in pages if x.get('id') == page_id][0]
    print('page_obj = ', page_obj)

    data = d.get('data')
    data_obj = [x for x in data if x.get('id') == page_obj.get('data_id')][0]
    print('data_obj = ', data_obj)

    vis = d.get('vis')
    vis_obj = [x for x in vis if x.get('id') == page_obj.get('vis_id')][0]
    print('vis_obj = ', vis_obj)

    return {'page': page_obj, 'data': data_obj, 'vis': vis_obj}