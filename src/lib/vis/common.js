/* eslint-disable @typescript-eslint/no-unused-vars */

import * as d3 from "d3";

export default class Common {
  static get scotlandBoards() {
    return [
      { board: "Scotland", abbr: "SCO", key: "scotland" },
      { board: "NHS Ayrshire & Arran", abbr: "A&A", key: "nhs_ayrshire_arran" },
      { board: "NHS Borders", abbr: "Bpr", key: "nhs_borders" },
      {
        board: "NHS Dumfries & Galloway",
        abbr: "D&G",
        key: "nhs_dumfries_galloway",
      },
      { board: "NHS Fife", abbr: "Fif", key: "nhs_fife" },
      { board: "NHS Forth Valley", abbr: "Fov", key: "nhs_forth_valley" },
      { board: "NHS Grampian", abbr: "Gra", key: "nhs_grampian" },
      {
        board: "NHS Greater Glasgow & Clyde",
        abbr: "G&C",
        key: "nhs_greater_glasgow_clyde",
      },
      { board: "NHS Highland", abbr: "Hig", key: "nhs_highland" },
      { board: "NHS Lanarkshire", abbr: "Lan", key: "nhs_lanarkshire" },
      { board: "NHS Lothian", abbr: "Lot", key: "nhs_lothian" },
      { board: "NHS Orkney", abbr: "Ork", key: "nhs_orkney" },
      { board: "NHS Shetland", abbr: "She", key: "nhs_shetland" },
      { board: "NHS Tayside", abbr: "Tay", key: "nhs_tayside" },
      {
        board: "NHS Western Isles",
        abbr: "WeI",
        key: "nhs_western_isles_scotland",
      },
    ];
  }

  static Colors = {
    SITUATION_SCALE: d3
      .scaleOrdinal()
      .domain([
        "Care home",
        "Elsewhere",
        "Home",
        "Hospice",
        "Hospital",
        "Other communal establishment",
      ])
      .range([
        "#66c2a5",
        "#ffce52",
        "#8da0cb",
        "#e78ac3",
        "#a6d854",
        "#888888",
        "#ffd92f",
        "#e5c494",
      ]),
    AGE_GROUP_SCALE: d3
      .scaleOrdinal()
      .domain([
        "Under 1 year",
        "01-14",
        "15-44",
        "45-64",
        "65-74",
        "75-84",
        "85+",
      ])
      .range(["gray", "gray", "gray"].concat(d3.schemeBlues[5].slice(0, 4))),
    DEATH_CAUSE_SCALE: d3
      .scaleOrdinal()
      .domain(["others", "covid", "average"])
      .range(d3.schemeSet2),
    CORRELATION_SCALE: d3.scaleSequential(d3.interpolatePiYG).domain([-1, 1]),
  };

  static getValueField(d) {
    const fields = Object.keys(d);
    fields.splice(fields.indexOf("index"), 1);
    return fields[0];
  }

  /*
    ContentMarginTop = 10px
    ContentPaddingTop = 30px
    ContentPadingBottom = 30px
    CardMarginTop = 30px     
    CardMarginBottom = 30px
    CardHeadPaddingTop = 15px
    CardHeadPaddingBottom = 15px
    IcondHeight = 53px
    total = 213px
    */
  static MAIN_CONTENT_GAP = 220;

  static splitSides(data) {
    const topData = [];
    const bottomData = [];
    const groups = [];
    let firstValue = null;
    data.forEach((d) => {
      const tokens = Common.getValueField(d.values[0]).split("___");
      d.splitAttribute = tokens[0];
      d.group = tokens[1];

      if (!firstValue || d.splitAttribute === firstValue) {
        topData.push(d);
        firstValue = d.splitAttribute;
      } else {
        bottomData.push(d);
      }

      if (!groups.includes(d.group)) {
        groups.push(d.group);
      }
    });

    return [topData, bottomData, groups];
  }

  static formatSide(data) {
    // input has N streams, each stream has M dates,
    // each date item has the following format {index: "2020-03-23", female___0 years: 0}
    // Merge N streams together, each having index and N columns, i.e., convert to wide format
    // Create an empty place holder before merging
    let records = data[0].values.map((d) => ({
      index: d.index,
    }));

    data.forEach(({ splitAttribute, values }) => {
      values.forEach((v, i) => {
        const field = Common.getValueField(v);
        records[i][field.split("___")[1]] = v[field];
        records[i].splitAttribute = splitAttribute;
      });
    });

    // Date may have aggreate values like '2021'
    records = records.filter((d) => d.index.length !== 4);

    // Parse time
    records.forEach((d) => {
      d.label = d.index;
      d.time = new Date(d.index);
    });

    return records;
  }

  static processDataMirroredChart(input) {
    if (!input) {
      return null;
    }

    const [topData, bottomData, groups] = this.splitSides(input);
    const data = {
      top: this.formatSide(topData),
      bottom: this.formatSide(bottomData),
      columns: groups,
    };

    console.log(data);

    return data;
  }
}
