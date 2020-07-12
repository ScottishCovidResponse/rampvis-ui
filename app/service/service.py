import requests
import json
import jwt
from flask import redirect, request, json, session

import app.service.ontology as ontology

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


def search(query):
    response = requests.get(BASE_URL + '/scotland/search/?query=' + query)
    result = json.loads(response.content)
    print('service: search: query = ', query, '\nresult = ', result)
    return result


def get_bookmarks():
    token = session['token']
    # print('get_bookmarks: session[token] = ', token)
    if not token:
        return None

    headers = {'content-type': 'application/json', 'Authorization': 'Bearer ' + token}
    response = requests.get(BASE_URL + '/bookmark/', headers=headers)
    bookmarks = json.loads(response.content)

    result = []
    for d in bookmarks:
        page_id = d.get('pageId')
        thumbnail = d.setdefault('thumbnail', "abc")
        # print('service: get_bookmarks: thumbnail = ', thumbnail)
        page_data_from_ontology = ontology.get_page_by_id(int(page_id))
        page_data_from_ontology.get('page')['thumbnail'] = thumbnail

        result.append(page_data_from_ontology)

    # print('service: get_bookmarks: bookmarks = ', result)
    return result
