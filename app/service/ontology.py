import os
import json
import urllib.parse

#
# Arg: page_name
# Returns:
# {
#   page: { id: , type: , nrows: , title: , description: , }
#   bind: [{ endpoint:  , function:,  description: },
#          { endpoint:  , function:,  description: },
#          ... ]
# }
#
SRC_DIR = os.path.dirname(os.path.abspath(__file__))
PAGES = os.path.join(SRC_DIR, 'database/pages.json')
DATA = os.path.join(SRC_DIR, 'database/data.json')
VIS = os.path.join(SRC_DIR, 'database/vis.json')

with open(PAGES) as json_file:
    pages = json.load(json_file)
with open(DATA) as json_file:
    data = json.load(json_file)
with open(VIS) as json_file:
    vis = json.load(json_file)


def get_page_by_name(page_name):
    # print('get_ontology_data: page_name = ', page_name)
    found_page = [x for x in pages if x.get('name') == page_name]
    if len(found_page) == 0:
        return None
    page_obj = found_page[0]
    return get_page(page_obj)


def get_page_by_id(page_id):
    found_page = [x for x in pages if x.get('id') == page_id]
    if len(found_page) == 0:
        return None
    page_obj = found_page[0]
    return get_page(page_obj)


def get_page(page_obj):
    result = dict({
        'page': {
            'id': page_obj.get('id'),
            'name': page_obj.get('name'),
            'type': page_obj.get('type'),
            'nrows': page_obj.get('nrows', 1),
            'title': page_obj.get('title'),
            'description': page_obj.get('description')
        },
        'bind': []
    })

    for bind_obj in page_obj.get('bind'):
        # print(bind_obj, bind_obj.get('vis_id'), bind_obj.get('data_id'))
        vis_obj = [x for x in vis if x.get('id') == bind_obj.get('vis_id')][0]
        # print(vis_obj.get('function'), vis_obj.get('description'), )
        data_obj = [x for x in data if x.get('id') == bind_obj.get('data_id')][0]

        #
        # create endpoint
        # TODO validation required
        #
        endpoint = data_obj.get('endpoint')
        if data_obj.get('query_string'):
            url = (data_obj.get('endpoint') + data_obj.get('query_string'))
            url_parts = list(urllib.parse.urlparse(url))
            query = dict(urllib.parse.parse_qsl(url_parts[4]))
            query.update(bind_obj.get('query_params'))
            url_parts[4] = urllib.parse.urlencode(query)
            endpoint = urllib.parse.urlunparse(url_parts)

        result.setdefault('bind', []).append({
            'endpoint': endpoint,
            'function': vis_obj.get('function'),
            'title': bind_obj.get('title')
        })

    return result


def get_all_pages():
    res = list()
    for p in pages:
        res.append(dict({
            'id': p.get('id'),
            'name': p.get('name'),
            'type': p.get('type'),
            'title': p.get('title'),
            'description': p.get('description')
        }))
    return res


#
# TODO: use proper database
#

from py2neo import Graph


class Ontology:

    def __init__(self, uri, name, user, password):
        """
        :param uri:  'bolt://0.0.0.0:7687'
        :param name:  database name
        :param user:
        :param password:
        """

        self.graph = Graph(uri, name=name, auth=(user, password))

    def close(self):
        self.graph.close()

    def query(self):
        q = 'MATCH (data:Data)-[r1]->(url:URL)<-[r2]-(vis:Vis) ' \
            'RETURN data, url, vis'

        # q = ' SHOW DATABASES'

        print('query: q: ', q)
        cursor = self.graph.run(q)
        while cursor.forward():
            print(cursor.current)
