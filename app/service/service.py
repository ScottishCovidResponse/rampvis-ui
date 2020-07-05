import requests
import json
import jwt

BASE_URL = 'http://localhost:2000/api/v1/internal'


def login_github(github_id, github_login):
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


def user_info(token):
    if token:
        decoded_token = jwt.decode(token, verify=False)
    else:
        return None

    user_id = decoded_token.get('id')
    headers = {'content-type': 'application/json', 'Authorization': 'Bearer ' + token}
    response = requests.get(BASE_URL + '/users/' + user_id, headers=headers)

    user = json.loads(response.content)
    print('service: user_info: user = ', user)
    return user
