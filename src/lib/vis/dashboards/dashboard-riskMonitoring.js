/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable prefer-destructuring */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable spaced-comment */
/* eslint-disable one-var */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable prefer-const */
/* eslint-disable func-names */
/* eslint-disable prefer-template */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/lines-between-class-members */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-multi-assign */
/* eslint-disable radix */

import * as d3 from "d3";
import Common from "../common";

export class DashboardRiskMonitoring {
  CHART_WIDTH = document.getElementById("charts").offsetWidth;
  CHART_HEIGHT = window.innerHeight - Common.MAIN_CONTENT_GAP;

  constructor(options) {
    console.log("Data", options.data);

    // const container = d3.select("#" + options.chartElement);
    // container.text("Risk monitoring");
    let container = document.querySelector("#charts");

    let d0 = options.data[0].values;

    let d0_last7day = d0.slice(d0.length - 14 * 7, d0.length);

    let last7day_inf = [];
    let tempTotalInf = 0;

    let last7day_dea = [];
    let tempTotalDea = 0;

    let last7day_hos = [];
    let tempTotalHos = 0;

    let last7day_icu = [];
    let tempTotalIcu = 0;

    let last7day_vac = [];
    let tempTotalVac = 0;

    d0_last7day.forEach(function (item, index) {
      tempTotalInf = tempTotalInf + item["case"];
      tempTotalDea = tempTotalDea + item["death"];
      tempTotalHos = tempTotalHos + item["hospital"];
      tempTotalIcu = tempTotalIcu + item["icu"];

      if (index != 0 && index % 13 == 0) {
        last7day_inf.push({
          year: item["date"],
          value: tempTotalInf,
        });

        last7day_dea.push({
          year: item["date"],
          value: tempTotalDea,
        });

        last7day_hos.push({
          year: item["date"],
          value: tempTotalHos,
        });

        last7day_icu.push({
          year: item["date"],
          value: tempTotalIcu,
        });

        tempTotalInf = 0;
        tempTotalDea = 0;
        tempTotalHos = 0;
        tempTotalIcu = 0;
      }
    });

    let d0_lastday = d0.slice(d0.length - 14, d0.length);

    let totalInf = 0;
    let totalInhos = 0;
    let totalIcu = 0;
    let totalDea = 0;

    let dataInf = [];
    let dataInhos = [];
    let dataIcu = [];
    let dataDea = [];
    let dataVac = [];

    d0_lastday.forEach(function (item, index) {
      totalInf = totalInf + item["case"];
      totalInhos = totalInhos + item["hospital"];
      totalIcu = totalIcu + item["icu"];
      totalDea = totalDea + item["death"];
      if (index < 7) {
        dataInf.push({
          year: item["agegroup"],
          male: 0,
          female: item["case"],
        });

        dataInhos.push({
          year: item["agegroup"],
          male: 0,
          female: item["hospital"],
        });

        dataIcu.push({
          year: item["agegroup"],
          male: 0,
          female: item["icu"],
        });

        dataDea.push({
          year: item["agegroup"],
          male: 0,
          female: item["death"],
        });
      } else {
        dataInf[index - 7].male = item["case"];
        dataInhos[index - 7].male = item["hospital"];
        dataIcu[index - 7].male = item["icu"];
        dataDea[index - 7].male = item["death"];
      }
    });

    let d1 = options.data[1].values;
    let d1_lastday = d1.slice(d1.length - 12, d1.length);

    let totalVac = 0;
    let totalPop = 0;

    d1_lastday.forEach(function (item, index) {
      if (index != 1) {
        totalVac = totalVac + item["CumulativeNumberVaccinated"];
        totalPop = totalPop + item["Population"];
      }
    });

    let d1_lastdayVac = d1.slice(d1.length - 12 - 22, d1.length - 12);
    d1_lastdayVac.splice(1, 1);
    d1_lastdayVac.splice(11, 1);

    d1_lastdayVac.forEach(function (item, index) {
      if (index < 10) {
        dataVac.push({
          year: item["AgeGroup"],
          male: 0,
          female: item["CumulativeNumberVaccinated"],
        });
      } else {
        dataVac[index - 10].male = item["CumulativeNumberVaccinated"];
      }
    });
    dataVac[9].year = "80+";

    dataVac = dataVac.slice(3);

    let d1_last7dayVac = d1.slice(d1.length - 7 * 70, d1.length);
    let last7daysVac = [];
    let tepmSumvac = 0;
    let countFlag = 0;
    d1_last7dayVac.forEach(function (item) {
      countFlag = countFlag + 1;
      let tempyear = item["index"];
      tepmSumvac = tepmSumvac + item["CumulativeNumberVaccinated"];

      if (countFlag % 70 === 0) {
        last7daysVac.push({
          year: tempyear,
          value: tepmSumvac,
        });

        tepmSumvac = 0;
      }
    });

    container.innerHTML = `
        <link rel="stylesheet" type="text/css" media="screen" href="https://cdn.staticfile.org/ionicons/2.0.1/css/ionicons.min.css">      
        <style>                    
            .flex-title {
                display: flex;
                justify-content: center;
                background-color: rgb(235, 235, 235);
                padding: 2px;
            }
            .flex-title > div {
                background-color:  rgb(235, 235, 235);
                width: 100%;
                height: 20px;
                margin: 4px;
                text-align: center;
                line-height: 20px;
                font-size: 24px;
                color: rgb(31, 25, 65);
                font-weight: bold;
            }
            .mainContent{
                background-color: rgb(235, 235, 235);
                width: 100%;
                height: 100%;
                margin-top: 2px;
                padding-bottom: 2px;
                padding-top: 2px;
            }
            .mainContent .neighbour{
                display: flex;
                justify-content:space-evenly;
                flex-wrap: wrap;
                height: 130px;     
                margin-top: 5px;   
            }
            .mainContent .neighbour > div {
                background-color: rgb(247, 247, 247);
                width: 100%;
                height: 90px;
                margin: 5px;
                justify-content: center;
                align-items: center;
                text-align: center; 
                border: rgb(189, 190, 189) 1px solid;
                font-size: 10px;
            }
            .mainContent .neighbour > div > div{
                display: flex;
                justify-content:space-evenly;
            }
            .middleguage{
                height: 490px;
                background-color: rgb(235, 235, 235);
                margin: 5px;
                display: flex;
                justify-content:space-evenly;
                flex-wrap: wrap;
            }
            .item {
                flex-grow: 1;
                height: 100%;
                background-color: rgb(189, 190, 189);
                border: rgb(228, 231, 231) thin solid;
                text-align: center;    
                box-shadow: 1px 1px 3px rgb(197, 197, 197) ;                   
            }
            .item + .item {
                margin-left: 1%;
            }
            .itemDiv{
                background-color: rgb(255, 255, 255);
                width: 96%;
                height: 43%;
                margin-left: 2%;
                margin-right: 2%;
                align-items: center;
                text-align: center;
                border-bottom: rgb(194, 194, 199) thin solid;
                padding-top: 5px;
                padding-bottom: 3px;
            }
            div.a {
                font-size: 18px;
                font-weight: bold;
                padding: 10px;
            }
            .guageDiv{
                padding-top: 4px;
                padding-left: 20px;
                padding-right: 20px;
            }
            .neighbourDivL{
                position: relative;
                width: 50%;
                background-color: rgb(247, 247, 247);
                float: left;  
                text-align: right;
                display: inline-block;
            }
            .neighbourDivR{
                position: relative;
                width: 41%;
                background-color: rgb(247, 247, 247);
                text-align: left;
                float: left;
                display: inline-block;  
            }
        </style>
        <div class="flex-title">
            <div>Ayrshire and Arran </div>
        </div>  
        <div class="mainContent">
            <div class="middleguage">
                <div class="item">
                    <span><div class="a">Infections (7 days)</div></span>
                    <div class="itemDiv">
                        <div class="guageDiv">
                            <div id="fillgauge1"></div>
                        </div>
                    </div>                 
                    <div class="itemDiv">                    
                        <div id="ag_infection"></div>
                    </div>
                </div>
                <div class="item">
                    <span><div class="a">Fatalities (7 days)</div></span>
                    <div class="itemDiv">
                        <div class="guageDiv">
                            <div id="fillgauge2"></div>
                        </div>
                    </div>
                    <div class="itemDiv">                    
                        <div id="ag_deaths"></div>
                    </div>
                </div>
                <div class="item">
                    <span><div class="a">In Hospital (7 days)</div></span>
                    <div class="itemDiv">
                        <div class="guageDiv">
                            <div id="fillgauge3"></div>
                        </div>
                    </div>
                    <div class="itemDiv">                    
                        <div id="ag_hospital"></div>
                    </div>
                </div>
                <div class="item">
                    <span><div class="a">In ICU (7 days)</div></span>
                    <div class="itemDiv">
                        <div class="guageDiv">
                            <div id="fillgauge4"></div>
                        </div>
                    </div>
                    <div class="itemDiv">                    
                        <div id="ag_icu"></div>
                    </div>
                </div>
                <div class="item">
                    <span><div class="a">Dose-2 Vaccinated (7 days)</div></span>
                    <div class="itemDiv">                    
                            <div class="guageDiv">
                                <div id="fillgauge5"></div>
                            </div>                                   
                    </div>
                    <div class="itemDiv">                    
                        <div id="ag_vaccined"></div>
                    </div>
                </div>           
            </div>
          
            <div class="neighbour">
                <div style="height:120px; padding-right:5px;">
                    <table style="width:100%;" cellspacing="0" cellpadding="0" border="0">
                        <tr height="25px">
                            <th style="width:25%; font-size:13px">Neighbour</th>
                            <th style="width:15%; font-size:13px">Infection (7 days)</th>
                            <th style="width:15%; font-size:13px">Fatalities (7 days)</th>
                            <th style="width:15%; font-size:13px">Hospital (7 days)</th>
                            <th style="width:15%; font-size:13px">ICU (7 days)</th>
                            <th style="width:15%; font-size:13px">Vaccinated (7 days)</th>
                        </tr>
                        <tr height="20px" style='text-align:center; font-size:14px'>
                            <td>Borders</td>
                            <td>                      
                                <div style='text-align:center'>22,  20,  35,  24,  63,  44,  56</div>                               
                            </td>
                            <td>                      
                                <div style='text-align:center'>22,  30,  45,  54,  23,  34,  66</div>                               
                            </td>
                            <td>                      
                                <div style='text-align:center'>12,  20,  35,  34,  23,  44,  66</div>                               
                            </td>
                            <td>                      
                                <div style='text-align:center'>12,  30,  35,  24,  12,  44,  66</div>                               
                            </td>
                            <td>                      
                                <div style='text-align:center'>12,  30,  45,  34,  23,  34,  66</div>                               
                            </td>
                            
                        </tr>
                        <tr height="20px" style='text-align:center; font-size:14px'>
                            <td>Greater Glasgow</td>
                            <td>                      
                                <div style='text-align:center'>22,  20,  35,  24,  12,  44,  66</div>                               
                            </td>
                            <td>                      
                                <div style='text-align:center'>12,  20,  45,  24,  23,  34,  56</div>                               
                            </td>
                            <td>                      
                                <div style='text-align:center'>12,  20,  35,  24,  13,  34,  56</div>                               
                            </td>
                            <td>                      
                                <div style='text-align:center'>12,  20,  35,  34,  13,  34,  56</div>                               
                            </td>
                            <td>                      
                                <div style='text-align:center'>12,  20,  45,  34,  13,  34,  56</div>                               
                            </td>                            
                        </tr>
                        <tr height="20px" style='text-align:center; font-size:14px'>
                            <td>Fife</td>
                            <td>                      
                                <div style='text-align:center'>12,  20,  45,  24,  13,  44,  56</div>                               
                            </td>
                            <td>                      
                                <div style='text-align:center'>12,  20,  35,  24,  13,  34,  56</div>                               
                            </td>
                            <td>                      
                                <div style='text-align:center'>12,  20,  45,  24,  13,  34,  56</div>                               
                            </td>
                            <td>                      
                                <div style='text-align:center'>12,  23,  34,  23,  12,  34,  56</div>                               
                            </td>
                            <td>                      
                                <div style='text-align:center'>12,  30,  45,  34,  13,  44,  66</div>                               
                            </td>                            
                        </tr>
                        <tr height="20px" style='text-align:center; font-size:14px'>
                            <td>Tayside</td>
                            <td>                      
                                <div style='text-align:center'>12,  20,  45,  24,  23,  44,  66</div>                               
                            </td>
                            <td>                      
                                <div style='text-align:center'>12,  20,  45,  24,  13,  34,  66</div>                               
                            </td>
                            <td>                      
                                <div style='text-align:center'>22,  30,  45,  24,  13,  44,  66</div>                               
                            </td>
                            <td>                      
                                <div style='text-align:center'>12,  20,  45,  24,  23,  34,  66</div>                               
                            </td>
                            <td>                      
                                <div style='text-align:center'>22,  20,  45,  24,  13,  34,  56</div>                               
                            </td>                        
                        </tr>
                    </table>
                
                </div>
            </div>
        </div>
        `;

    let data3key1 = totalInhos + " in hospital";
    let data3key2 = totalInf - totalInhos + " not in hospital";
    let data3 = {};
    data3[data3key1] = totalInhos;
    data3[data3key2] = totalInf - totalInhos;

    let data4key1 = totalIcu + " in ICU";
    let data4key2 = totalInhos - totalIcu + "in ward";
    let data4 = {};
    data4[data4key1] = totalIcu;
    data4[data4key2] = totalInhos - totalIcu;

    let data5key1 = totalVac + " yes";
    let data5key2 = totalPop - totalVac + " not";
    let data5 = {};
    data5[data5key1] = totalVac;
    data5[data5key2] = totalPop - totalVac;

    // drawpiechart(150,200,['#E17A76','#EBB87C'],"#fillgauge3",data3,"Last day in hospital ",totalInhos,totalInf,3)
    // drawpiechart(150,200,['#D91D82','#E17A76'],"#fillgauge4",data4,"Last day ICU",totalIcu,totalInhos,4)
    //drawpiechart(180,200,['#85A346','#d3e0b8'],"#fillgauge5",data5,"Last day dose-2",totalVac,totalPop,5)

    drawstackbarchart("#ag_infection", "Age & gender subtotals");
    drawstackbarchart("#ag_deaths", "Age & gender subtotals");
    drawstackbarchart("#ag_hospital", "Age & gender subtotals");
    drawstackbarchart("#ag_icu", "Age & gender subtotals");
    drawstackbarchart("#ag_vaccined", "Vaccined by age group");

    createbar("#fillgauge1", 230, 200, 1);
    createbar("#fillgauge2", 230, 200, 2);

    createbar("#fillgauge3", 230, 200, 3);
    createbar("#fillgauge4", 230, 200, 4);
    createbar("#fillgauge5", 230, 200, 5);

    function drawstackbarchart(id, title) {
      const maxHeight = 150;
      const maxWidth = 230;
      const barWidth = 23;
      let data;

      if (id == "#ag_infection") {
        data = dataInf;
      } else if (id == "#ag_deaths") {
        data = dataDea;
      } else if (id == "#ag_hospital") {
        data = dataInhos;
      } else if (id == "#ag_icu") {
        data = dataIcu;
      } else if (id == "#ag_vaccined") {
        data = dataVac;
      }

      const keys = ["male", "female"];

      const getTimePoint = (d) => {
        const _d = d.data ? d.data : d;
        return `${_d.year}`;
      };

      const stack = d3
        .stack()
        .keys(keys)
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);
      const series = stack(data);
      console.log(series);

      const colorArray = ["#4075b0", "#e2aed9"];

      function renderVerticalStack() {
        const svg = d3
          .select(id)
          .append("svg")
          .attr("width", maxWidth)
          .attr("height", maxHeight + 50);

        const xScale = d3
          .scalePoint()
          .domain(data.map(getTimePoint))
          .range([0, maxWidth])
          .padding(1);

        const xScalePoint = d3
          .scalePoint()
          .domain(data.map(getTimePoint))
          .range([0, maxWidth])
          .padding(1);

        const stackMax = (serie) => d3.max(serie, (d) => (d ? d[1] : 0));
        const stackMin = (serie) => d3.min(serie, (d) => (d ? d[0] : 0));

        const y = d3
          .scaleLinear()
          .domain([d3.max(series, stackMax), d3.min(series, stackMin)])
          .range([0, maxHeight]);

        const g = svg
          .selectAll("g")
          .data(series)
          .enter()
          .append("g")
          .attr("fill", (d, i) => colorArray[i % colorArray.length]);

        g.selectAll("rect")
          .data((d) => d)
          .enter()
          .append("rect")
          .attr("x", (d) => {
            const scaledX = xScale(getTimePoint(d));
            return scaledX - barWidth / 2;
          })
          .attr("y", (d) => y(d[1]))
          .attr("width", barWidth)
          .attr("height", (d) => {
            return y(d[0]) - y(d[1]);
          });

        g.selectAll("text")
          .data((d) => d)
          .enter()
          .append("text")
          .attr("class", "text")
          .attr("x", (d) => {
            let x = xScale(getTimePoint(d));
            return x - barWidth / 2;
          })
          .attr("y", (d) => y(d[0]) - 10)
          .text(function (d) {
            if (d[0] == 0) {
              return d.data.male;
            } else {
              return d.data.female;
            }
          })
          .style("font-size", "10px")
          .style("fill", function (d) {
            if (d[0] == 0) {
              return "#fff";
            } else {
              return "#000";
            }
          });

        const axis = d3.axisBottom(xScalePoint);
        svg
          .append("g")
          .attr("transform", `translate(0, ${maxHeight})`)
          .call(axis)
          .style("font-size", "8px");

        svg
          .append("text")
          .attr("x", maxWidth / 2 - 40)
          .attr("y", maxHeight + 40)
          .attr("text-anchor", "middle")
          .style("font-size", "10px")
          .text(title);
        //.style("text-decoration", "underline")

        svg
          .append("circle")
          .attr("cx", 20 + maxWidth / 2)
          .attr("cy", maxHeight + 38)
          .attr("r", 5)
          .style("fill", "#4075b0");
        svg
          .append("circle")
          .attr("cx", 55 + maxWidth / 2)
          .attr("cy", maxHeight + 38)
          .attr("r", 5)
          .style("fill", "#e2aed9");
        svg
          .append("text")
          .attr("x", 15 + 10 + maxWidth / 2)
          .attr("y", maxHeight + 38)
          .text("male")
          .style("font-size", "10px")
          .attr("alignment-baseline", "middle");
        svg
          .append("text")
          .attr("x", 50 + 10 + maxWidth / 2)
          .attr("y", maxHeight + 38)
          .text("female")
          .style("font-size", "10px")
          .attr("alignment-baseline", "middle");
      }

      renderVerticalStack();
    }

    function drawpiechart(w, h, mycolor, id, mydata, title, n, m, p) {
      let width = w;
      let height = h;
      let margin = 0;

      let radius = Math.min(width, height) / 2 - 10;

      let svg = d3
        .select(id)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      let data = mydata;

      let color = d3.scaleOrdinal().domain(data).range(mycolor);

      let pie = d3.pie().value(function (d) {
        return d.value;
      });
      let data_ready = pie(d3.entries(data));

      let arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

      svg
        .selectAll("mySlices")
        .data(data_ready)
        .enter()
        .append("path")
        .attr("d", arcGenerator)
        .attr("fill", function (d) {
          return color(d.data.key);
        })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7);

      let yn = 1;
      svg
        .selectAll("mySlices")
        .data(data_ready)
        .enter()
        .append("text")
        .text(function (d) {
          return d.data.key;
        })
        .attr("transform", function (d) {
          let centroid = arcGenerator.centroid(d);
          if (yn == 1) {
            yn = yn + 1;
            return `translate(${centroid[0] - 5},${centroid[1] - 5})`;
          } else {
            return `translate(${centroid[0] - 5},${centroid[1] + 15})`;
          }

          // return "translate(" + arcGenerator.centroid(d) + ")";
        })
        .style("text-anchor", "middle")
        .style("font-size", 10);

      //centroid(d)

      svg
        .append("text")
        .attr("x", -28)
        .attr("y", height / 2 - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .text(title);
      if (p == 3) {
        svg
          .append("circle")
          .attr("cx", 20 + 5)
          .attr("cy", height / 2 - 13)
          .attr("r", 5)
          .style("fill", "#E17A76");
        svg
          .append("circle")
          .attr("cx", 55 - 5)
          .attr("cy", height / 2 - 13)
          .attr("r", 5)
          .style("fill", "#EBB87C");
        svg
          .append("text")
          .attr("x", 15 + 10 + 5)
          .attr("y", height / 2 - 13)
          .text("In")
          .style("font-size", "10px")
          .attr("alignment-baseline", "middle");
        svg
          .append("text")
          .attr("x", 50 + 10 - 5)
          .attr("y", height / 2 - 13)
          .text("Case")
          .style("font-size", "10px")
          .attr("alignment-baseline", "middle");
      } else if (p == 4) {
        svg
          .append("circle")
          .attr("cx", 20 - 10)
          .attr("cy", height / 2 - 13)
          .attr("r", 5)
          .style("fill", "#D91D82");
        svg
          .append("circle")
          .attr("cx", 55 - 10)
          .attr("cy", height / 2 - 13)
          .attr("r", 5)
          .style("fill", "#E17A76");
        svg
          .append("text")
          .attr("x", 15 + 10 - 10)
          .attr("y", height / 2 - 13)
          .text("ICU")
          .style("font-size", "10px")
          .attr("alignment-baseline", "middle");
        svg
          .append("text")
          .attr("x", 50 + 10 - 10)
          .attr("y", height / 2 - 13)
          .text("Ward")
          .style("font-size", "10px")
          .attr("alignment-baseline", "middle");
      } else if (p == 5) {
        svg
          .append("circle")
          .attr("cx", 20 - 8)
          .attr("cy", height / 2 - 13)
          .attr("r", 5)
          .style("fill", "#85A346");
        svg
          .append("circle")
          .attr("cx", 55 - 1)
          .attr("cy", height / 2 - 13)
          .attr("r", 5)
          .style("fill", "#d3e0b8");
        svg
          .append("text")
          .attr("x", 15 + 10 - 8)
          .attr("y", height / 2 - 13)
          .text("Dose-2")
          .style("font-size", "10px")
          .attr("alignment-baseline", "middle");
        svg
          .append("text")
          .attr("x", 50 + 10 - 1)
          .attr("y", height / 2 - 13)
          .text("Not")
          .style("font-size", "10px")
          .attr("alignment-baseline", "middle");
      }
    }

    function createbar(id, w, h, r) {
      let margin = { top: 20, right: 2, bottom: 60, left: 28 },
        width = w - margin.left - margin.right,
        height = h - margin.top - margin.bottom;

      let svg = d3
        .select(id)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      let mr = 5000;
      let data;
      let mycolor;

      if (r == 1) {
        data = last7day_inf;
        mycolor = "#EBB87C";
        mr = 5000;
      } else if (r == 2) {
        data = last7day_dea;
        mycolor = "#AAA";
        mr = 40;
      } else if (r == 3) {
        data = last7day_hos;
        mycolor = "#E17A76";
        mr = 800;
      } else if (r == 4) {
        data = last7day_icu;
        mycolor = "#D91D82";
        mr = 150;
      } else if (r == 5) {
        data = last7daysVac;
        mycolor = "#85A346";
        mr = 2351000;
      }

      let x = d3
        .scaleBand()
        .range([0, width])
        .domain(
          data.map(function (d) {
            return d.year;
          }),
        )
        .padding(0.2);

      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end")
        .style("font-size", "8px");

      let y = d3.scaleLinear().domain([0, mr]).range([height, 0]);

      svg.append("g").call(d3.axisLeft(y)).style("font-size", "8px");

      svg
        .selectAll(id)
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return x(d.year);
        })
        .attr("y", function (d) {
          return y(d.value);
        })
        .attr("width", x.bandwidth())
        .attr("height", function (d) {
          return height - y(d.value);
        })
        .attr("fill", mycolor);

      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", h - margin.top - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .text("Case numbers per day");
    }
  }
}
