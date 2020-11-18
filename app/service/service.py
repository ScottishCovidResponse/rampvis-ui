import requests
import json
import jwt
from flask import redirect, json, session
import os

import app.service.ontology as ontology
from app import app

# DATA_API = app.config.get('DATA_API')
# STAT_API = app.config.get('STAT_API')
DATA_API = os.environ.get('DATA_API')
STAT_API = os.environ.get('STAT_API')


def github_login():
    return redirect(DATA_API + '/auth/github-login')


def get_user(token):
    if token:
        decoded_token = jwt.decode(token, verify=False)
    else:
        return None

    user_id = decoded_token.get('id')
    headers = {'content-type': 'application/json', 'Authorization': 'Bearer ' + token}
    response = requests.get(DATA_API + '/user/' + user_id, headers=headers)

    user = json.loads(response.content)
    print('service: get_user: user = ', user)
    return user


def search(query):
    response = requests.get(DATA_API + '/scotland/search/?query=' + query)
    result = json.loads(response.content)
    print('service: search: query = ', query, '\nresult = ', result)
    return result


def get_bookmarks():
    token = session['token']
    # print('get_bookmarks: session[token] = ', token)
    if not token:
        return None

    headers = {'content-type': 'application/json', 'Authorization': 'Bearer ' + token}
    response = requests.get(DATA_API + '/bookmark/', headers=headers)
    bookmarks = json.loads(response.content)

    print('get_bookmarks: bookmarks = ', bookmarks)

    result = []
    for d in bookmarks:
        page_id = d.get('pageId')
        thumbnail = d.setdefault('thumbnail', "abc")
        #print('service: get_bookmarks: d =', d, 'page_id = ', page_id)
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
def get_onto_pages(publish_type):
    token = session['token']
    print('get_onto_pages: session[token] = ', token)
    
    response = requests.get(DATA_API + '/template/pages/?publishType=' + publish_type)
    onto_pages = json.loads(response.content)

    print('get_onto_pages: onto_pages = ', onto_pages.get('data', []))
    return onto_pages.get('data', [])

def get_onto_page_by_id(id):
    token = session['token']
    print('get_onto_page_by_id: id = ', id)
    
    response = requests.get(DATA_API + '/template/page/' + id)
    onto_page = json.loads(response.content)

    print('get_onto_page_by_id: onto_page = ', onto_page)
    return onto_page
