import os
import json

SCOTLAND_COUNCILS = ['aberdeen_city', 'aberdeenshire', 'angus', 'argyll_and_bute', 'city_of_edinburgh', 'clackmannanshire', 'dumfries_and_galloway', 'dundee_city', 'east_ayrshire', 'east_dunbartonshire', 'east_lothian', 'east_renfrewshire', 'falkirk', 'fife', 'glasgow_city', 'highland', 'inverclyde', 'midlothian', 'moray', 'na_h_eileanan_siar', 'north_ayrshire', 'north_lanarkshire', 'orkney_islands', 'perth_and_kinross', 'renfrewshire', 'scottish_borders', 'shetland_islands', 'south_ayrshire', 'south_lanarkshire', 'stirling', 'west_dunbartonshire', 'west_lothian']
ENGLAND_COUNCILS = ['adur', 'allerdale', 'amber_valley', 'arun', 'ashfield', 'ashford', 'babergh', 'barking_and_dagenham', 'barnet', 'barnsley', 'barrow_in_furness', 'basildon', 'basingstoke_and_deane', 'bassetlaw', 'bath_and_north_east_somerset', 'bedford', 'bexley', 'birmingham', 'blaby', 'blackburn_with_darwen', 'blackpool', 'blaenau_gwent', 'bolsover', 'bolton', 'boston', 'bournemouth,_christchurch_and_poole', 'bracknell_forest', 'bradford', 'braintree', 'breckland', 'brent', 'brentwood', 'bridgend', 'brighton_and_hove', 'bristol,_city_of', 'broadland', 'bromley', 'bromsgrove', 'broxbourne', 'broxtowe', 'buckinghamshire', 'burnley', 'bury', 'caerphilly', 'calderdale', 'cambridge', 'camden', 'cannock_chase', 'canterbury', 'cardiff', 'carlisle', 'carmarthenshire', 'castle_point', 'central_bedfordshire', 'ceredigion', 'charnwood', 'chelmsford', 'cheltenham', 'cherwell', 'cheshire_east', 'cheshire_west_and_chester', 'chesterfield', 'chichester', 'chorley', 'city_of_london', 'colchester', 'conwy', 'copeland', 'corby', 'cornwall', 'cotswold', 'county_durham', 'coventry', 'craven', 'crawley', 'croydon', 'dacorum', 'darlington', 'dartford', 'daventry', 'denbighshire', 'derby', 'derbyshire_dales', 'doncaster', 'dorset', 'dover', 'dudley', 'ealing', 'east_cambridgeshire', 'east_devon', 'east_hampshire', 'east_hertfordshire', 'east_lindsey', 'east_northamptonshire', 'east_riding_of_yorkshire', 'east_staffordshire', 'east_suffolk', 'eastbourne', 'eastleigh', 'eden', 'elmbridge', 'enfield', 'epping_forest', 'epsom_and_ewell', 'erewash', 'exeter', 'fareham', 'fenland', 'flintshire', 'folkestone_and_hythe', 'forest_of_dean', 'fylde', 'gateshead', 'gedling', 'gloucester', 'gosport', 'gravesham', 'great_yarmouth', 'greenwich', 'guildford', 'gwynedd', 'hackney', 'halton', 'hambleton', 'hammersmith_and_fulham', 'harborough', 'haringey', 'harlow', 'harrogate', 'harrow', 'hart', 'hartlepool', 'hastings', 'havant', 'havering', 'herefordshire,_county_of', 'hertsmere', 'high_peak', 'hillingdon', 'hinckley_and_bosworth', 'horsham', 'hounslow', 'huntingdonshire', 'hyndburn', 'ipswich', 'isle_of_anglesey', 'isle_of_wight', 'isles_of_scilly', 'islington', 'kensington_and_chelsea', 'kettering', "king's_lynn_and_west_norfolk", 'kingston_upon_hull,_city_of', 'kingston_upon_thames', 'kirklees', 'knowsley', 'lambeth', 'lancaster', 'leeds', 'leicester', 'lewes', 'lewisham', 'lichfield', 'lincoln', 'liverpool', 'luton', 'maidstone', 'maldon', 'malvern_hills', 'manchester', 'mansfield', 'medway', 'melton', 'mendip', 'merthyr_tydfil', 'merton', 'mid_devon', 'mid_suffolk', 'mid_sussex', 'middlesbrough', 'milton_keynes', 'mole_valley', 'monmouthshire', 'neath_port_talbot', 'new_forest', 'newark_and_sherwood', 'newcastle_under_lyme', 'newcastle_upon_tyne', 'newham', 'newport', 'north_devon', 'north_east_derbyshire', 'north_east_lincolnshire', 'north_hertfordshire', 'north_kesteven', 'north_lincolnshire', 'north_norfolk', 'north_somerset', 'north_tyneside', 'north_warwickshire', 'north_west_leicestershire', 'northampton', 'northumberland', 'norwich', 'nottingham', 'nuneaton_and_bedworth', 'oadby_and_wigston', 'oldham', 'oxford', 'pembrokeshire', 'pendle', 'peterborough', 'plymouth', 'portsmouth', 'powys', 'preston', 'reading', 'redbridge', 'redcar_and_cleveland', 'redditch', 'reigate_and_banstead', 'rhondda_cynon_taf', 'ribble_valley', 'richmond_upon_thames', 'richmondshire', 'rochdale', 'rochford', 'rossendale', 'rother', 'rotherham', 'rugby', 'runnymede', 'rushcliffe', 'rushmoor', 'rutland', 'ryedale', 'salford', 'sandwell', 'scarborough', 'sedgemoor', 'sefton', 'selby', 'sevenoaks', 'sheffield', 'shropshire', 'slough', 'solihull', 'somerset_west_and_taunton', 'south_cambridgeshire', 'south_derbyshire', 'south_gloucestershire', 'south_hams', 'south_holland', 'south_kesteven', 'south_lakeland', 'south_norfolk', 'south_northamptonshire', 'south_oxfordshire', 'south_ribble', 'south_somerset', 'south_staffordshire', 'south_tyneside', 'southampton', 'southend_on_sea', 'southwark', 'spelthorne', 'st._helens', 'st_albans', 'stafford', 'staffordshire_moorlands', 'stevenage', 'stockport', 'stockton_on_tees', 'stoke_on_trent', 'stratford_on_avon', 'stroud', 'sunderland', 'surrey_heath', 'sutton', 'swale', 'swansea', 'swindon', 'tameside', 'tamworth', 'tandridge', 'teignbridge', 'telford_and_wrekin', 'tendring', 'test_valley', 'tewkesbury', 'thanet', 'three_rivers', 'thurrock', 'tonbridge_and_malling', 'torbay', 'torfaen', 'torridge', 'tower_hamlets', 'trafford', 'tunbridge_wells', 'uttlesford', 'vale_of_glamorgan', 'vale_of_white_horse', 'wakefield', 'walsall', 'waltham_forest', 'wandsworth', 'warrington', 'warwick', 'watford', 'waverley', 'wealden', 'wellingborough', 'welwyn_hatfield', 'west_berkshire', 'west_devon', 'west_lancashire', 'west_lindsey', 'west_oxfordshire', 'west_suffolk', 'westminster', 'wigan', 'wiltshire', 'winchester', 'windsor_and_maidenhead', 'wirral', 'woking', 'wokingham', 'wolverhampton', 'worcester', 'worthing', 'wrexham', 'wychavon', 'wyre', 'wyre_forest', 'york']
COUNCILS = SCOTLAND_COUNCILS + ENGLAND_COUNCILS
REGIONS = ['ayrshire_and_arran', 'borders', 'dumfries_and_galloway', 'fife', 'forth_valley', 'grampian', 'greater_glasgow_and_clyde', 'highland', 'lanarkshire', 'lothian', 'orkney', 'shetland', 'tayside', 'western_isles']
COUNTRIES = ['england', 'scotland', 'wales']
LOCATIONS = COUNCILS + REGIONS + COUNTRIES
TOPICS = ['vaccination', 'all_deaths', 'covid_deaths', 'tests_carried_out', 'people_tested', 'hospital_confirmed', 'icu_confirmed', 'tests_reported', 'new_cases', 'hospital_admission']
TIMES = ['daily', 'weekly', 'model']
GROUPS = ['place_of_death', 'all_sexes_agegroups', 'all_boards', 'all_local_authorities', 'age_group']
TYPES = ['cumulative']
MODELS = ['eera']

with open(os.path.join(os.path.dirname(__file__), 'name_mapping.json')) as f:
    NAME_MAPPING = json.load(f)

def find_keyword(keywords, check_list):
    "Return the keyword in the check list."
    for c in check_list:
        if c in keywords:
            return c
    return None

def max_loc(locs):
    for loc in locs:
        if loc in COUNTRIES:
            return loc
    for loc in locs:
        if loc in REGIONS:
            return loc
    for loc in locs:
        if loc in COUNCILS:
            return loc
    return None

def same_keyword(keywords):
    if len(set(keywords)) == 1:
        return keywords[0]
    return None

def generate_title(keywords_list):
    locs, times, topics, groups, types, models = [], [], [], [], [], []
    for keywords in keywords_list:
        loc = find_keyword(keywords, LOCATIONS)
        if loc is None:
            raise Exception(keywords, 'location missing')
        locs.append(loc)
            
        time = find_keyword(keywords, TIMES)
        if time is None:
            raise Exception(keywords, 'should have daily, weekly or model')
        times.append(time)
            
        topic = find_keyword(keywords, TOPICS)
        if topic is None:
            raise Exception(keywords, 'topic missing')
        topics.append(topic)
    
        group = find_keyword(keywords, GROUPS)
        groups.append(group)

        type = find_keyword(keywords, TYPES)
        types.append(type)

        model = find_keyword(keywords, MODELS)
        models.append(model)

    # Single stream
    if len(keywords_list) == 1:
        return comnbine_to_title(locs[0], times[0], topics[0], groups[0], types[0], models[0])
    
    # Multiple streams
    return comnbine_to_title(max_loc(locs), same_keyword(times), same_keyword(topics), same_keyword(groups), same_keyword(types), same_keyword(models))
    
def comnbine_to_title(loc, time, topic, group, type, model):
    if topic is None:
        return NAME_MAPPING[loc]
    result = ''
    if model is None:
        if time is None:
            result = f'{NAME_MAPPING[loc]} - {NAME_MAPPING[topic]}'
        if loc and time and topic:
            result = f'{NAME_MAPPING[loc]} - {NAME_MAPPING[time]} {NAME_MAPPING[topic]}'
    else:
        result = f'{NAME_MAPPING[loc]} - {NAME_MAPPING[time]} {NAME_MAPPING[model]} {NAME_MAPPING[topic]}'

    if group is not None:
        result += ' by ' + NAME_MAPPING[group]
    if type is not None:
        result += ' (cumulative)'
    return result