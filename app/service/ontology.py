import os
import json
import urllib.parse

# from app import app

SRC_DIR = os.path.dirname(os.path.abspath(__file__))
PAGES = os.path.join(SRC_DIR, 'database/pages.json')
DATA = os.path.join(SRC_DIR, 'database/data.json')
VIS = os.path.join(SRC_DIR, 'database/vis.json')

with open(PAGES) as json_file:
    pages_onto = json.load(json_file)
with open(DATA) as json_file:
    data_onto = json.load(json_file)
with open(VIS) as json_file:
    vis_onto = json.load(json_file)


def get_api_url(key):
    """
    Returns DATA_API and STAT_API from config
    """
    # return app.config.get(key)
    return os.environ.get(key)


def get_all_pages():
    return [dict({
        'id': x.get('id'),
        'name': x.get('name'),
        'type': x.get('type'),
        'title': x.get('title'),
        'description': x.get('description')
    })
        for x in pages_onto]


def get_pages_by_type(page_type):
    return [dict({
        'id': x.get('id'),
        'name': x.get('name'),
        'type': x.get('type'),
        'title': x.get('title'),
        'description': x.get('description')
    })
        for x in pages_onto if x.get('type') == page_type]


def get_page_by_name(page_name):
    """
    Returns:
    {
        page: { id: int, type: string, nrows: int, title: string, description: string, }
        bind: [{ function: string, endpoint: string | string[],  description: string },
                 ... ],
        links: { 'key': [ list of page ids], .. }
    }
    """
    # print('get_ontology_data: page_name = ', page_name)
    found_page = [x for x in pages_onto if x.get('name') == page_name]
    if len(found_page) == 0:
        return None
    page_obj = found_page[0]
    return get_page(page_obj)


def get_page_by_id(page_id):
    """
    Returns:
    {
        page: { id: int, type: string, nrows: int, title: string, description: string, }
        bind: [{ function: string, endpoint: string | string[],  description: string },
                 ... ],
        links: { 'key': [ list of page ids], .. }
    }
    """
    found_page = [x for x in pages_onto if x.get('id') == page_id]
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
            'description': page_obj.get('description'),
        },
        'bind': [],
        'links': resolve_links(page_obj.get('links'))
    })

    for bind_obj in page_obj.get('bind'):
        # print(bind_obj, bind_obj.get('vis_id'), bind_obj.get('data_id'))
        vis_obj = [x for x in vis_onto if x.get('id') == bind_obj.get('vis_id')][0]
        # print(vis_obj.get('function'), vis_obj.get('description'), )

        #
        # one vis function mapped to one dataId
        #
        if bind_obj.get('data_id'):
            print('data_id = ', bind_obj.get('data_id'))
            endpoint = resolve_endpoint(bind_obj.get('data_id'), bind_obj.get('query_params'))

        #
        # one vis function mapped to multiple dataIds
        #
        elif bind_obj.get('data'):
            print('data = ', bind_obj.get('data'))
            endpoint = []
            for d in bind_obj.get('data'):
                endpoint_tmp = resolve_endpoint(d.get('data_id'), d.get('query_params'))
                endpoint.append(endpoint_tmp)

        result.setdefault('bind', []).append({
            'endpoint': endpoint,
            'function': vis_obj.get('function'),
            'title': bind_obj.get('title')
        })

    print('result = ', result)
    return result


def resolve_endpoint(data_id, query_params):
    data_obj = [x for x in data_onto if x.get('id') == data_id][0]

    endpoint = data_obj.get('endpoint')

    # create endpoint
    # TODO validation required
    #
    if data_obj.get('query_string'):
        url = get_api_url(data_obj.get('url')) + data_obj.get('endpoint') + data_obj.get('query_string')
        url_parts = list(urllib.parse.urlparse(url))
        query = dict(urllib.parse.parse_qsl(url_parts[4]))
        query.update(query_params)
        url_parts[4] = urllib.parse.urlencode(query)
        endpoint = urllib.parse.urlunparse(url_parts)

    return endpoint


def resolve_links(links):
    new_links = dict()
    for key, value in links.items():
        new_links[key] = [page_id_to_name(x) for x in value]
    return new_links


def page_id_to_name(page_id):
    found_page = [x for x in pages_onto if x.get('id') == page_id]

    if len(found_page) > 0:
        name = found_page[0].get('name')
        # print('ontology: page_id_to_name: page_id = ', page_id, ', name = ', name)
        return name



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
