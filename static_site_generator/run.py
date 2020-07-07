from bs4 import BeautifulSoup, Tag
from shutil import copyfile
import os


class Generator:
    def __init__(self):
        pass

    @staticmethod
    def copy(src, dst):
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        copyfile(src, dst)

    # @staticmethod
    # def copy_template(src, dst):
    #     Generator.copy(src, dst)
    # with open(dst) as file:
    #     soup = BeautifulSoup(file, 'html.parser')
    #     return soup

    @staticmethod
    def update_css(dst, css_file):
        with open(dst, 'r+') as file:
            soup = BeautifulSoup(file, 'html.parser')
            r = soup.select('link[id="REPLACE"]')[0]
            # print(r['href'], r['id'])
            r['href'] = css_file
            r['id'] = ''  # TODO remove

        file.close()

        with open(dst, 'w', encoding='utf-8') as fileW:
            fileW.write(soup.prettify(formatter="html"))

    @staticmethod
    def update_js(dst, js_file):
        with open(dst, 'r+') as file:
            soup = BeautifulSoup(file, 'html.parser')
            r = soup.select('script[id="REPLACE"]')[0]
            # print(r['href'], r['id'])
            r['href'] = js_file
            r['id'] = ''  # TODO remove

        file.close()

        with open(dst, 'w', encoding='utf-8') as fileW:
            fileW.write(soup.prettify(formatter="html"))
        print(r)

    @staticmethod
    def update_js_script(dst, js_file):
        with open(dst, 'r+') as file:
            soup = BeautifulSoup(file, 'html.parser')
            r = soup.select('script[id="REPLACE"]')[0]
            # print(r['href'], r['id'])
            r['href'] = js_file
            r['id'] = ''  # TODO remove

        file.close()

        with open(dst, 'w', encoding='utf-8') as fileW:
            fileW.write(soup.prettify(formatter="html"))
        print(r)


od = {
    "data": {
        'url': 'http://vis.scrc.uk/api/v1/scotland/cumulative',
        'title': 'Cumulative Number of Cases Tested Positive for COVID-19',
        'description': 'Cumulative Number of Cases Tested Positive for COVID-19 in all 14 Scotland regions',
    },
    "vis": {
        'description': '(Click on location label to go to regional overview and on the chart to a detailed view)',
    },
    "page": {
        'name': 'overview-top-level-screen-a.html',
        'type': 'overview',
        'links': ''
    }
}

SRC_HTML_PATH = 'template/template.html'
DST_HTML_PATH = '../app/home/pages/' + od['page']['type']

Generator.copy(SRC_HTML_PATH, DST_HTML_PATH)
