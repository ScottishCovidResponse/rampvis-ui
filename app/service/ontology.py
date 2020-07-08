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
        # q = 'MATCH (actor:Person)-[rel:ACTED_IN]->(movie:Movie) ' \
        #     'RETURN actor, rel, movie ' \
        #     'LIMIT 10'

        q = 'MATCH (data:Data)-[r1]->(url:URL)<-[r2]-(vis:Vis) ' \
            'RETURN data, url, vis'

        # q = ' SHOW DATABASES'

        print('query: q: ', q)
        cursor = self.graph.run(q)
        while cursor.forward():
            # print(type(cursor.current))
            print(cursor.current)
