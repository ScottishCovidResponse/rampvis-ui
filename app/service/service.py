import requests
import jwt
from flask import redirect, json, session
import os
import logging

import app.service.ontology as ontology
from app import app


API_JS = os.environ.get('API_JS')
API_PY = os.environ.get('API_PY')


def get_api_url(key):
    """
    Returns API_JS and API_PY from config
    """
    print(key)
    return os.environ.get(key)


def github_login():
    return redirect(API_JS + '/auth/github-login')


def get_user(token):
    if token:
        decoded_token = jwt.decode(token, verify=False)
    else:
        return None

    user_id = decoded_token.get('id')
    headers = {'content-type': 'application/json', 'Authorization': 'Bearer ' + token}
    response = requests.get(API_JS + '/user/' + user_id, headers=headers)

    user = json.loads(response.content)
    print('service: get_user: user = ', user)
    return user


def search(query):
    response = requests.get(API_JS + '/scotland/search/?query=' + query)
    result = json.loads(response.content)
    print('service: search: query = ', query, '\nresult = ', result)
    return result


def get_bookmarks():
    token = session['token']
    # print('get_bookmarks: session[token] = ', token)
    if not token:
        return None

    headers = {'content-type': 'application/json', 'Authorization': 'Bearer ' + token}
    response = requests.get(API_JS + '/bookmark/', headers=headers)
    bookmarks = json.loads(response.content)

    print('get_bookmarks: bookmarks = ', bookmarks)

    result = []
    for d in bookmarks:
        page_id = d.get('pageId')
        thumbnail = d.setdefault('thumbnail', "abc")
        # print('service: get_bookmarks: d =', d, 'page_id = ', page_id)
        page_data_from_ontology = ontology.get_page_by_id(int(page_id))
        page_data_from_ontology.get('page')['thumbnail'] = thumbnail

        result.append(page_data_from_ontology)

    # print('service: get_bookmarks: bookmarks = ', result)
    return result


def is_bookmarked(page_id):
    print('service: is_bookmarked: page_id = ', page_id)
    return True


def update_bookmark(page_id):
    print('service: update_bookmark: page_id = ', page_id)
    return True

#
# call backend ontology
#


def get_onto_pages(binding_type):
    token = session['token']
    print(f'service.py:get_onto_pages: session[token] = {token}')

    response = requests.get(API_JS + '/template/pages/?bindingType=' + binding_type)
    onto_pages = json.loads(response.content)
    data = onto_pages.get('data', [])

    print(f'service.py: get_onto_pages: onto_pages={data}')
    return data


def get_onto_page_by_id(id):
    token = session['token']
    logging.debug(f'service.py:get_onto_page_by_id: id = {id}')

    response = requests.get(API_JS + '/template/page/' + id)
    onto_page = json.loads(response.content)

    bindings = onto_page.get('bindings')
    # print('\n\n..............................................', bindings)
    # print('SK', bindings[0])

    data = bindings[0].get('data')
    vis = bindings[0].get('vis')
    # print('SK', data)

    # [print(get_api_url(d.get('urlCode')), d.get('endpoint')) for d in data]
    data = [{**d, 'endpoint': get_api_url(d.get('urlCode')) + d.get('endpoint')} for d in data]

    onto_page['bindings'] = {'data': data, 'vis': vis}
    logging.debug(f'service.py:get_onto_page_by_id: onto_page = {onto_page}')

    return onto_page
