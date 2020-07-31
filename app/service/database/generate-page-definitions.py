from jinja2 import Template
import os
import json

regions = [
    {'abbreviation': "sco",
     'shortname': "scotland",
     'displayname': "Scotland"
     },
    {'abbreviation': "aa",
     'shortname': "nhs_ayrshire_arran",
     'displayname': "NHS Ayrshire & Arran"
     },
    {'abbreviation': "bpr",
     'shortname': "nhs_borders",
     'displayname': "NHS Borders"
     },
    {'abbreviation': "dg",
     'shortname': "nhs_dumfries_galloway",
     'displayname': "NHS Dumfries & Galloway"
     },
    {'abbreviation': "fif",
     'shortname': "nhs_fife",
     'displayname': "NHS Fife"
     },
    {'abbreviation': "fov",
     'shortname': "nhs_forth_valley",
     'displayname': "NHS Forth Valley"
     },
    {'abbreviation': "gc",
     'shortname': "nhs_greater_glasgow_clyde",
     'displayname': "NHS Greater Glasgow & Clyde"
     },
    {'abbreviation': "golden",
     'shortname': "golden_jubilee_nationalhospital",
     'displayname': "Golden Jubilee National Hospital"
     },
    {'abbreviation': "gra",
     'shortname': "nhs_grampian",
     'displayname': "NHS Grampian"
     },
    {'abbreviation': "hig",
     'shortname': "nhs_highland",
     'displayname': "NHS Highland"
     },
    {'abbreviation': "lan",
     'shortname': "nhs_lanarkshire",
     'displayname': "NHS Lanarkshire"
     },
    {'abbreviation': "lot",
     'shortname': "nhs_lothian",
     'displayname': "NHS Lothian"
     },
    {'abbreviation': "ork",
     'shortname': "nhs_orkney",
     'displayname': "NHS Orkney"
     },
    {'abbreviation': "she",
     'shortname': "nhs_shetland",
     'displayname': "NHS Shetland"
     },
    {'abbreviation': "tay",
     'shortname': "nhs_tayside",
     'displayname': "NHS Tayside"
     },
    {'abbreviation': "wei",
     'shortname': "nhs_western_isles_scotland",
     'displayname': "NHS Western Isles"
     }
]

basedir = os.path.dirname(os.path.abspath(__file__))


with open(os.path.join(basedir, 'pages.template')) as f:
    template_string = f.readlines()
    template = Template("\n".join(template_string))

with open(os.path.join(basedir, 'pages.json'), 'w') as f:
    result_string = template.render(regions=regions)

    # print direct output of template
    # NB. works even if JSON is malformed, so useful for debugging
    # f.write(template.render(regions=regions))

    # Auto-indents JSON
    json.dump(json.loads(result_string), f, indent=2)
