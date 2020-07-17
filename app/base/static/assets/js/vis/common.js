class Common {
    static get scotlandBoards() {
        return [
            {"board": "NHS Ayrshire & Arran", "abbr": "A&A", "key": "nhs_ayrshire_arran"},
            {"board": "NHS Borders", "abbr": "Bpr", "key": "nhs_borders"},
            {"board": "NHS Dumfries & Galloway", "abbr": "D&G", "key": "nhs_dumfries_galloway"},
            {"board": "NHS Fife", "abbr": "Fif", "key": "nhs_fife"},
            {"board": "NHS Forth Valley", "abbr": "Fov", "key": "nhs_forth_valley"},
            {"board": "NHS Grampian", "abbr": "Gra", "key": "nhs_grampian"},
            {"board": "NHS Greater Glasgow & Clyde", "abbr": "G&C", "key": "nhs_greater_glasgow_clyde"},
            {"board": "NHS Highland", "abbr": "Hig", "key": "nhs_highland"},
            {"board": "NHS Lanarkshire", "abbr": "Lan", "key": "nhs_lanarkshire"},
            {"board": "NHS Lothian", "abbr": "Lot", "key": "nhs_lothian"},
            {"board": "NHS Orkney", "abbr": "Ork", "key": "nhs_orkney"},
            {"board": "NHS Shetland", "abbr": "She", "key": "nhs_shetland"},
            {"board": "NHS Tayside", "abbr": "Tay", "key": "nhs_tayside"},
            {"board": "NHS Western Isles", "abbr": "WeI", "key": "nhs_western_isles_scotland"},
            {"board": "Scotland", "abbr": "SCO", "key": "scotland"}
        ];
    }

    static Colors = {
        SITUATION_SCALE: d3.scaleOrdinal()
                            .domain(['Care Home', 'Home / Non-institution', 'Hospital', 'Other institution'])
                            .range(d3.schemeSet2),
        AGE_GROUP_SCALE: d3.scaleOrdinal()
                            .domain(['Under 1 year', '01-14', '15-44', '45-64', '65-74', '75-84', '85+'])
                            .range(['gray', 'gray', 'gray'].concat(d3.schemeBlues[5].slice(0, 4))),
        DEATH_CAUSE_SCALE: d3.scaleOrdinal()
                            .domain(['others', 'covid', 'average'])
                            .range(d3.schemeSet2),
        CORRELATION_SCALE: d3.scaleSequential(d3.interpolatePiYG).domain([-1, 1])
    };
}