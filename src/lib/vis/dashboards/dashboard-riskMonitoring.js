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
    let container=document.querySelector("#charts")

    //add
    // fetchInject([
    //   'https://cdn.plot.ly/plotly-2.6.3.min.js'
    // ]).then(() => {
    //   console.log(`Finish in less than ${moment().endOf('year').fromNow(true)}`)
    // })
    var script = document.createElement("script");  // create a script DOM node
    script.src = 'https://cdn.plot.ly/plotly-2.6.3.min.js';  // set its src to the provided URL
    document.head.appendChild(script);

    container.innerHTML=`
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
                  <span><div class="a">Infections</div></span>
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
                  <span><div class="a">Deaths</div></span>
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
                  <span><div class="a">In Hospital</div></span>
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
                  <span><div class="a">In ICU</div></span>
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
                  <span><div class="a">Vaccined</div></span>
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
                          <th style="width:15%; font-size:13px">Infection</th>
                          <th style="width:15%; font-size:13px">Death</th>
                          <th style="width:15%; font-size:13px">Hospital</th>
                          <th style="width:15%; font-size:13px">ICU</th>
                          <th style="width:15%; font-size:13px">Vaccined</th>
                      </tr>
                      <tr height="20px">
                          <td>Borders</td>
                          <td>
                              <div class="neighbourDivL">
                                  <div style="background-color:green; width:25%; height:20px; position: relative; display: inline-block; text-align: center; color:white"><span style="font-size: 9px; line-height: 20px;">25%</span></div>
                              </div>
                              <div class="neighbourDivR">&nbsp</div>
                              <i class='icon ion-arrow-down-c' style='font-size:20px; line-height: 20px;color:green;'></i>
                          </td>
                          <td>
                              <div class="neighbourDivL">
                                  <div style="background-color:green; width:15%; height:20px; position: relative; display: inline-block; text-align: center; color:white"><span style="font-size: 9px; line-height: 20px;">15%</span></div>
                              </div>
                              <div class="neighbourDivR">&nbsp</div>
                              <i class='icon ion-arrow-down-c' style='font-size:20px; line-height: 20px;color:green'></i>
                          </td>
                          <td>
                              <div class="neighbourDivL">
                                  <div style="background-color:green; width:45%; height:20px; position: relative; display: inline-block; text-align: center; color:white"><span style="font-size: 9px; line-height: 20px;">45%</span></div>
                              </div>
                              <div class="neighbourDivR">&nbsp</div>
                              <i class='icon ion-arrow-down-c' style='font-size:20px; line-height: 20px;color:green'></i>
                          </td>
                          <td>
                              <div class="neighbourDivL">
                                  <div style="background-color:green; width:15%; height:20px; position: relative; display: inline-block; text-align: center; color:white"><span style="font-size: 9px; line-height: 20px;">15%</span></div>
                              </div>
                              <div class="neighbourDivR">&nbsp</div>
                              <i class='icon ion-arrow-down-c' style='font-size:20px; line-height: 20px;color:green'></i>
                          </td>
                          <td>
                              <div class="neighbourDivL">
                                  <div style="background-color:green; width:35%; height:20px; position: relative; display: inline-block; text-align: center; color:white"><span style="font-size: 9px; line-height: 20px;">35%</span></div>
                              </div>
                              <div class="neighbourDivR">&nbsp</div>
                              <i class='icon ion-arrow-down-c' style='font-size:20px; line-height: 20px;color:green'></i>
                          </td>
                      </tr>
                      <tr height="20px">
                          <td>Greater Glasgow</td>
                          <td>
                              <div class="neighbourDivL">&nbsp</div>
                              <div class="neighbourDivR">
                                  <div style="background-color:red; width:30%; height:20px; position: relative; display: inline-block; text-align: center; color:white"><span style="font-size: 9px; line-height: 20px;">30%</span></div>
                              </div>
                              <i class='icon ion-arrow-up-c' style='font-size:20px; line-height: 20px;color:red'></i>                                
                          </td>
                          <td>
                              <div class="neighbourDivL">&nbsp</div>
                              <div class="neighbourDivR">
                                  <div style="background-color:red; width:20%; height:20px; position: relative; display: inline-block; text-align: center; color:white"><span style="font-size: 9px; line-height: 20px;">20%</span></div>
                              </div>
                              <i class='icon ion-arrow-up-c' style='font-size:20px; line-height: 20px;color:red'></i>                                
                          </td>
                          <td>
                              <div class="neighbourDivL">&nbsp</div>
                              <div class="neighbourDivR">
                                  <div style="background-color:red; width:90%; height:20px; position: relative; display: inline-block; text-align: center; color:white"><span style="font-size: 9px; line-height: 20px;">90%</span></div>
                              </div>
                              <i class='icon ion-arrow-up-c' style='font-size:20px; line-height: 20px;color:red'></i>                                
                          </td>
                          <td>
                              <div class="neighbourDivL">&nbsp</div>
                              <div class="neighbourDivR">
                                  <div style="background-color:red; width:50%; height:20px; position: relative; display: inline-block; text-align: center; color:white"><span style="font-size: 9px; line-height: 20px;">50%</span></div>
                              </div>
                              <i class='icon ion-arrow-up-c' style='font-size:20px; line-height: 20px;color:red'></i>                                
                          </td>
                          <td>
                              <div class="neighbourDivL">
                                  <div style="background-color:green; width:15%; height:20px; position: relative; display: inline-block; text-align: center; color:white"><span style="font-size: 9px; line-height: 20px;">15%</span></div>
                              </div>
                              <div class="neighbourDivR">&nbsp</div>
                              <i class='icon ion-arrow-down-c' style='font-size:20px; line-height: 20px;color:green'></i>
                          </td>
                      </tr>
                      <tr height="20px">
                          <td>Fife</td>
                          <td>
                              <div class="neighbourDivL">&nbsp</div>
                              <div class="neighbourDivR">
                                  <div style="background-color:red; width:60%; height:20px; position: relative; display: inline-block; text-align: center; color:white"><span style="font-size: 9px; line-height: 20px;">60%</span></div>
                              </div>
                              <i class='icon ion-arrow-up-c' style='font-size:20px; line-height: 20px;color:red'></i>                                    
                          </td>
                          <td>
                              <div class="neighbourDivL">
                                  <div style="background-color:green; width:35%; height:20px; position: relative; display: inline-block; text-align: center; color:white"><span style="font-size: 9px; line-height: 20px;">35%</span></div>
                              </div>
                              <div class="neighbourDivR">&nbsp</div>
                              <i class='icon ion-arrow-down-c' style='font-size:20px; line-height: 20px;color:green'></i>
                          </td>
                          <td>
                              <div class="neighbourDivL">
                                  <div style="background-color:green; width:45%; height:20px; position: relative; display: inline-block; text-align: center; color:white"><span style="font-size: 9px; line-height: 20px;">45%</span></div>
                              </div>
                              <div class="neighbourDivR">&nbsp</div>
                              <i class='icon ion-arrow-down-c' style='font-size:20px; line-height: 20px;color:green'></i>
                          </td>
                          <td>
                              <div class="neighbourDivL">&nbsp</div>
                              <div class="neighbourDivR">
                                  <div style="background-color:red; width:20%; height:20px; position: relative; display: inline-block; text-align: center; color:white"><span style="font-size: 9px; line-height: 20px;">20%</span></div>
                              </div>
                              <i class='icon ion-arrow-up-c' style='font-size:20px; line-height: 20px;color:red'></i>                                    
                          </td>
                          <td>
                              <div class="neighbourDivL">&nbsp</div>
                              <div class="neighbourDivR">
                                  <div style="background-color:red; width:40%; height:20px; position: relative; display: inline-block; text-align: center; color:white"><span style="font-size: 9px; line-height: 20px;">40%</span></div>
                              </div>
                              <i class='icon ion-arrow-up-c' style='font-size:20px; line-height: 20px;color:red'></i>                                    
                          </td>
                      </tr>
                      <tr height="20px">
                          <td>Tayside</td>
                          <td>
                              <div class="neighbourDivL">
                                  <div style="background-color:green; width:80%; height:20px; position: relative; display: inline-block; text-align: center; color:white"><span style="font-size: 9px; line-height: 20px;">80%</span></div>
                              </div>
                              <div class="neighbourDivR">&nbsp</div>
                              <i class='icon ion-arrow-down-c' style='font-size:20px; line-height: 20px;color:green'></i>
                          </td>                           
                          <td>
                              <div class="neighbourDivL">
                                  <div style="background-color:green; width:55%; height:20px; position: relative; display: inline-block; text-align: center; color:white"><span style="font-size: 9px; line-height: 20px;">55%</span></div>
                              </div>
                              <div class="neighbourDivR">&nbsp</div>
                              <i class='icon ion-arrow-down-c' style='font-size:20px; line-height: 20px;color:green'></i>
                          </td>
                          <td>
                              <div class="neighbourDivL">&nbsp</div>
                              <div class="neighbourDivR">
                                  <div style="background-color:red; width:66%; height:20px; position: relative; display: inline-block; text-align: center; color:white"><span style="font-size: 9px; line-height: 20px;">66%</span></div>
                              </div>
                              <i class='icon ion-arrow-up-c' style='font-size:20px; line-height: 20px;color:red'></i>                                    
                          </td>
                          <td>
                              <div class="neighbourDivL">&nbsp</div>
                              <div class="neighbourDivR">
                                  <div style="background-color:red; width:55%; height:20px; position: relative; display: inline-block; text-align: center; color:white"><span style="font-size: 9px; line-height: 20px;">55%</span></div>
                              </div>
                              <i class='icon ion-arrow-up-c' style='font-size:20px; line-height: 20px;color:red'></i>                                    
                          </td>
                          <td>
                              <div class="neighbourDivL">
                                  <div style="background-color:green; width:75%; height:20px; position: relative; display: inline-block; text-align: center; color:white"><span style="font-size: 9px; line-height: 20px;">75%</span></div>
                              </div>
                              <div class="neighbourDivR">&nbsp</div>
                              <i class='icon ion-arrow-down-c' style='font-size:20px; line-height: 20px;color:green'></i>
                          </td>
                      </tr>
                  </table>
              
              </div>
          </div>

      </div>
    `;

    // var trace1 = {
    //   type: 'bar',
    //   x: [1, 2, 3, 4],
    //   y: [5, 10, 2, 8],
    //   marker: {
    //       color: '#C8A2C8',
    //       line: {
    //           width: 2.5
    //       }
    //   }
    // };
    
    // var data = [ trace1 ];
    
    // var layout = { 
    //   title: 'Responsive to window\'s size!',
    //   font: {size: 18}
    // };
    
    // var config = {responsive: true}
    
    // Plotly.newPlot('fillgauge1', data, layout, config );




    let data1=[{"label":"Intection", "value":30},{"label":"Normal", "value":70}];
    let data2=[{"label":"Death", "value":20},{"label":"Live", "value":80}];
    let data3=[{"label":"40% In", "value":40},{"label":"", "value":60}];
    let data4=[{"label":"20% ICU", "value":20},{"label":"", "value":80}];
    let data5=[{"label":"60% vaccied", "value":60},{"label":"", "value":40}];

    drawpiechart(150,200,['rgb(101, 80, 187)','rgb(146,122,242)'],"#fillgauge3",data3,"In-patient percentage of last day ",805,4041)
    drawpiechart(150,200,['rgb(146, 59, 111)','rgb(205,97,162)'],"#fillgauge4",data4,"ICU patient percentage of last day",146,805)
    drawpiechart(150,200,['rgb(99, 136, 20)','rgb(177,212,103)'],"#fillgauge5",data5,"Vaccined percentage of last day",146,300)

    drawstackbarchart3("#ag_infection","Infection by age group")
    drawstackbarchart3("#ag_deaths","Deaths by age group")
    drawstackbarchart3("#ag_hospital","In hospital by age group")
    drawstackbarchart3("#ag_icu","ICU by age group")
    drawstackbarchart3("#ag_vaccined","Vaccined by age group")

    createbar2("#fillgauge1",150,200,1)
    createbar2("#fillgauge2",150,200,2)

    
  function drawstackbarchart3(id,title){
    const maxHeight = 150;
    const maxWidth = 200;
    const barWidth = 15;
    let data;

      const dataInf = [{year:"0",male:284,female:286},{year:"1-14",male:239,female:412},{year:"15-44",male:380,female:142},{year:"45-64",male:86,female:265},{year:"65-74",male:400,female:374},{year:"75-84",male:277,female:349},{year:"85+",male:171,female:376}]
      const dataDea = [{year:"0",male:1,female:2},{year:"1-14",male:2,female:3},{year:"15-44",male:2,female:3},{year:"45-64",male:3,female:3},{year:"65-74",female:3,male:1},{year:"75-84",male:2,female:1},{year:"85+",male:2,female:2}]
      const dataHos = [{year:"0",male:39,female:49},{year:"1-14",male:59,female:60},{year:"15-44",male:48,female:27},{year:"45-64",male:49,female:114},{year:"65-74",male:61,female:61},{year:"75-84",male:68,female:44},{year:"85+",male:84,female:42}]
      const dataIcu = [{year:"0",male:10,female:3},{year:"1-14",male:6,female:16},{year:"15-44",male:14,female:14},{year:"45-64",male:11,female:16},{year:"65-74",female:8,male:9},{year:"75-84",male:10,female:9},{year:"85+",male:6,female:14}]
      const dataVac = [{year:"0",male:10,female:3},{year:"1-14",male:6,female:16},{year:"15-44",male:14,female:14},{year:"45-64",male:11,female:16},{year:"65-74",female:8,male:9},{year:"75-84",male:10,female:9},{year:"85+",male:6,female:14}]
    
  // const dataInf = [
  //   {"0yrs":286,"1-14yrs":412,"15-54yrs":142,"45-64yrs":265,"65-74yrs":374, "75-84yrs":349,"85+yrs":376},
  //   {"0yrs":284,"1-14yrs":239,"15-54yrs":380,"45-64yrs":86,"65-74yrs":400, "75-84yrs":277,"85+yrs":171}
  // ]

  // const dataDea = [
  //     {"0yrs":2,"1-14yrs":3,"15-54yrs":3,"45-64yrs":3,"65-74yrs":3, "75-84yrs":1,"85+yrs":2},
  //     {"0yrs":1,"1-14yrs":2,"15-54yrs":2,"45-64yrs":3,"65-74yrs":1, "75-84yrs":2,"85+yrs":2}
  // ]

  // const dataHos = [
  //     {"0yrs":49,"1-14yrs":60,"15-54yrs":27,"45-64yrs":114,"65-74yrs":61, "75-84yrs":44,"85+yrs":42},
  //     {"0yrs":39,"1-14yrs":59,"15-54yrs":48,"45-64yrs":49,"65-74yrs":61, "75-84yrs":68,"85+yrs":84}
  // ]

  // const dataIcu = [
  //     {"0yrs":3,"1-14yrs":16,"15-54yrs":14,"45-64yrs":16,"65-74yrs":8, "75-84yrs":9,"85+yrs":14},
  //     {"0yrs":10,"1-14yrs":6,"15-54yrs":14,"45-64yrs":11,"65-74yrs":9, "75-84yrs":10,"85+yrs":6}
  // ]

  // const dataVac = [
  //     {"0yrs":3,"1-14yrs":16,"15-54yrs":14,"45-64yrs":16,"65-74yrs":8, "75-84yrs":9,"85+yrs":14},
  //     {"0yrs":10,"1-14yrs":6,"15-54yrs":14,"45-64yrs":11,"65-74yrs":9, "75-84yrs":10,"85+yrs":6}
  // ]
   
  if(id=="#ag_infection"){
      data=dataInf
  }else if(id=="#ag_deaths"){
      data=dataDea
  }else if(id=="#ag_hospital"){
      data=dataHos
  }else if(id=="#ag_icu"){
      data=dataIcu
  }else if(id=="#ag_vaccined"){
      data=dataVac
  }

  //const keys = ['apple', 'samsung', 'huawei', 'oppo', 'xiaomi', 'others'];
  const keys = ['male','female']
   
  // const getTimePoint = (d) => {
  //   const _d = d.data ? d.data : d;
  //   return `${_d.year}-${_d.quarter}`;
  // }
  const getTimePoint = (d) => {
      const _d = d.data ? d.data : d;
      return `${_d.year}`;
  }

  const stack = d3.stack().keys(keys).order(d3.stackOrderNone).offset(d3.stackOffsetNone);
  const series = stack(data);
  console.log(series)
  //const colorArray = ['#38CCCB', '#0074D9', '#2FCC40', '#FEDC00', '#FF4036', 'lightgrey'];
  const colorArray =['#03a1fc', '#e980f2']

  function renderVerticalStack() {
    const svg = d3.select(id)
      .append('svg')
      .attr('width', maxWidth)
      .attr('height', maxHeight + 50);

    const xScale = d3.scalePoint()
      .domain(data.map(getTimePoint))
      .range([0, maxWidth])
      .padding(1);

    const xScalePoint = d3.scalePoint()
      .domain(data.map(getTimePoint))
      .range([0, maxWidth])
      .padding(1)

    const stackMax = (serie) => d3.max(serie, (d) => d ? d[1] : 0)
    const stackMin = (serie) => d3.min(serie, (d) => d? d[0]: 0)

    const y = d3.scaleLinear()
      .domain([d3.max(series, stackMax), d3.min(series, stackMin)])
      .range([0, maxHeight])

    const g = svg.selectAll('g')
      .data(series)
      .enter()
      .append('g')
      .attr('fill', (d, i) => colorArray[i % colorArray.length]);

      g.selectAll('rect')
      .data((d) => d)
      .enter()
      .append('rect')
      .attr('x', (d) => {
        const scaledX = xScale(getTimePoint(d));
        return scaledX - barWidth / 2;
      })
      .attr('y', (d) => y(d[1]))
      .attr('width', barWidth)
      .attr('height', (d) => {
        return y(d[0]) - y(d[1]) 
      });


      g.selectAll("text")
      .data((d) => d)
      .enter()
      .append("text")
      .attr("class","text")
      .attr('x', (d) => {
          let x = xScale(getTimePoint(d));
          return x - barWidth / 2;
        })
      .attr("y", (d) => y(d[0])-10)
      .text(function (d) { 
          if(d[0]==0){
            return d.data.male;
          }else{
            return d.data.female;
          }
      })
      .style("font-size", "10px") 
      .style("fill", function(d){
          if(d[0]==0){
            return "black";
          }else{
            return "yellow";
          }    
      });

      // g.selectAll("text")
      // .data((d) => d)
      // .enter()
      // .append("text")
      // .attr("class","text")
      // .attr('x', (d) => {
      //     let x = xScale(getTimePoint(d));
      //     return x - barWidth / 2;
      //   })
      // .attr("y", (d) => y(d[1])-10)
      // .text(function (d) {  
      //         return d.data.male;
      // })
      // .style("font-size", "10px") 
      // .style("fill", "yellow")

  //   svg.selectAll("text")
  //     .data(series)
  //     .enter()
  //     .data((d) => d)
  //     .enter()
  //     .append("text")
  //     .attr("class","text")
  //     .attr('x', (d) => {
  //         let x = xScale(getTimePoint(d));
  //         return x - barWidth / 2;
  //       })
  //     .attr("y", (d) => y(d[0]))
  //     .text(function (d) { 
  //             return d.data.female;}
  //         )
  //     .style("font-size", "10px") 


      const axis = d3.axisBottom(xScalePoint);
      svg.append('g')
      .attr('transform', `translate(0, ${maxHeight})`)
      .call(axis)
      .style("font-size", "8px")  

      svg.append("text")
      .attr("x", (maxWidth/2-40))             
      .attr("y", (maxHeight+40))
      .attr("text-anchor", "middle")  
      .style("font-size", "10px")          
      .text(title);
      //.style("text-decoration", "underline") 

      svg.append("circle").attr("cx",20+maxWidth/2).attr("cy",maxHeight+38).attr("r", 5).style("fill", "#03a1fc")
      svg.append("circle").attr("cx",55+maxWidth/2).attr("cy",maxHeight+38).attr("r", 5).style("fill", "#e980f2")
      svg.append("text").attr("x", 15+10+maxWidth/2).attr("y", maxHeight+38).text("male").style("font-size", "10px").attr("alignment-baseline","middle")
      svg.append("text").attr("x", 50+10+maxWidth/2).attr("y", maxHeight+38).text("female").style("font-size", "10px").attr("alignment-baseline","middle")
  }

  renderVerticalStack()

  // d3.select(id)
  //   .append('div')
  //   .style('width', maxWidth + 'px')
  //   .style('display', 'flex')
  //   .style('justify-content', 'space-around')
  //   .selectAll('.legend')
  //   .data(keys)
  //   .enter()
  //   .append('div')
  //   .attr('class', 'legend')
  //   .text((d) => d)
  //   .style('color', (d, i) => colorArray[i % colorArray.length])
}


function drawpiechart(w,h,mycolor,id,mydata,title,n,m) {
  // set the dimensions and margins of the graph
  var width = w
  var height = h
  var margin = 0

  // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
  var radius = Math.min(width, height) / 2 - 5

  // append the svg object to the div called 'my_dataviz'
  var svg = d3.select(id)
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // Create dummy data
  // var data = {a: 9, b: 20, c:30, d:8, e:12}
  // tt=4041
  // ht=805
  // ut=146
  var data;
  if(id=="#fillgauge3"){
      data={"805 in":n,"3285":(m-n)}
  }else if(id=="#fillgauge4"){
      data={"146 icu":n,"649":(m-n)}
  }else if(id=="#fillgauge5"){
      data={"Vacc?":n,"?":(m-n)}
  }
  
  //var data={"in":n,"not":(m-n)}
  // set the color scale
  var color = d3.scaleOrdinal()
  .domain(data)
  .range(mycolor);
  //.range(d3.schemeSet2);

  // Compute the position of each group on the pie:
  var pie = d3.pie()
  .value(function(d) {return d.value; })
  var data_ready = pie(d3.entries(data))
  // Now I know that group A goes from 0 degrees to x degrees and so on.

  // shape helper to build arcs:
  var arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(radius)

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  svg
  .selectAll('mySlices')
  .data(data_ready)
  .enter()
  .append('path')
  .attr('d', arcGenerator)
  .attr('fill', function(d){ return(color(d.data.key)) })
  .attr("stroke", "black")
  .style("stroke-width", "2px")
  .style("opacity", 0.7)

  // Now add the annotation. Use the centroid method to get the best coordinates
  svg
  .selectAll('mySlices')
  .data(data_ready)
  .enter()
  .append('text')
  .text(function(d){ return d.data.key})
  .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
  .style("text-anchor", "middle")
  .style("font-size", 10)

  svg.append("text")
  .attr("x", 0)             
  .attr("y", (height/2-10))
  .attr("text-anchor", "middle")  
  .style("font-size", "10px") 
  .text(title);

}


function createbar2(id,w,h,r){
  // 4231 30
  // 4484 28
  // 2783 30
  // 3905 28
  // 4630 35
  // 3919 32
  // 4237 29
  var data1 = [
    {"year":"21/10/21","value": 4231},
    {"year":"22/10/21","value": 4484},
    {"year":"23/10/21","value": 2783},
    {"year":"24/10/21","value": 3905},
    {"year":"25/10/21","value": 4630},
    {"year":"26/10/21","value": 3919},
    {"year":"27/10/21","value": 4273}
];

var data2 = [
  {"year":"21/10/21","value": 30},
  {"year":"22/10/21","value": 28},
  {"year":"23/10/21","value": 30},
  {"year":"24/10/21","value": 28},
  {"year":"25/10/21","value": 35},
  {"year":"26/10/21","value": 32},
  {"year":"27/10/21","value": 28}
];

  var data2 = [
      {"year":"21/10","tickets": 30},
      {"year":"22/10","tickets": 28},
      {"year":"23/10","tickets": 30},
      {"year":"24/10","tickets": 28},
      {"year":"25/10","tickets": 35},
      {"year":"26/10","tickets": 32},
      {"year":"27/10","tickets": 28}
  ];
   
  var mr=5000;
  var data;
  var mycolor;
      
  if(r==1){
      data=data1;
      mycolor='rgb(111,180,208)';
      mr=5000;
  }else if(r==2){
      data=data2;
      mycolor='rgb(126,126,126)';
      mr=40;
  }
      
  var margin = { top: 20, right: 1, bottom: 20, left: 1 },
      width = w - margin.left - margin.right,
      height = h - margin.top - margin.bottom;

  // let xScale=d3.scaleLinear()
  //     .domain(data.map(function (d) {
  //       return d.year;
  //     }))
  //     .range([0, width])
  //     .padding(0.3);
  //     var x_axis = d3.axisBottom()
  //     .scale(xScale);
  let xScale = d3.scaleBand()
      .range([0, width])
      .padding(0.3)
      .domain(data.map(function (d) {
        return d.year;
      }));
      
      var xAxis = d3.axisBottom(xScale);

      //
      // .tickFormat(function(d){
      //   return d.year
      // });

          //let y = d3.scaleLinear().rangeRound([height, 0]).domain([0, 10]);

          //let yAxisEL = g.append("g").call(yAxis);

          //let yScale = d3.axisLeft().scale(y);
      // var xScale = d3.scaleOrdinal()
      //     .domain(data.map(function (d) {
      //         return [d.year];
      //     }))
      //     .rangeRoundBands([0, width], 0.3);
  var yScale = d3.scaleLinear()
      .domain([0, d3.max(data, function (d) {
          return Math.max([d.tickets])+50;
      })])
      .range([height, 0]);
  //creates svg     .style('background', '#E7E0CB')
  var chart = d3.select(id).append('svg')            
      .attr('width', width + margin.left + margin.right)
      .attr('height',height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate('+ margin.left +','+ margin.right +')')
      .style('background','#eee');
      
      //chart.call(d3.axisBottom(xScale));    
  
  // chart.call(yScale)

  chart.selectAll('rect')
      .data(data)//read bar data
      .enter()
      .append('rect')//data makes a rectangle
      .style('fill',mycolor)
      .attr('width', xScale.bandwidth())
      .attr('height', function(d){
          return height - yScale(d.tickets);
      })
      .attr('x', function(d, i) {return xScale(d.year);})
      .attr('y', function (d) {return 10+yScale(d.tickets);}) //sets bars at the bottom

  var text = chart.selectAll(".text")
      .data(data)
      .enter()
      .append("text")
      .attr("class","text");

  var labels = text.attr("x", function (d) {
          return xScale(d.year) + xScale.bandwidth()/2-10;
      })
      .attr("y", function (d) {return 10+yScale(d.tickets);})
      .text(function (d) { return d.tickets;})
      .style("font-size", "10px")    

  chart.append("text")
      .attr("x", (width/2))             
      .attr("y", (190))
      .attr("text-anchor", "middle")  
      .style("font-size", "10px")          
      .text("Value of last 7 days");
      //.style("text-decoration", "underline") 


      // chart.attr("transform", "translate(0,50)")
      //      .call(d3.axisBottom(xScale));
      //chart.call(xAxis)

}


// function createbar3(id,width,height,r){
//   var data1 = [
//     {"year":"21/10/21","value": 4231},
//     {"year":"22/10/21","value": 4484},
//     {"year":"23/10/21","value": 2783},
//     {"year":"24/10/21","value": 3905},
//     {"year":"25/10/21","value": 4630},
//     {"year":"26/10/21","value": 3919},
//     {"year":"27/10/21","value": 4273}
// ];

// var data2 = [
//   {"year":"21/10/21","value": 30},
//   {"year":"22/10/21","value": 28},
//   {"year":"23/10/21","value": 30},
//   {"year":"24/10/21","value": 28},
//   {"year":"25/10/21","value": 35},
//   {"year":"26/10/21","value": 32},
//   {"year":"27/10/21","value": 28}
// ];

//   var data2 = [
//       {"year":"21/10","tickets": 30},
//       {"year":"22/10","tickets": 28},
//       {"year":"23/10","tickets": 30},
//       {"year":"24/10","tickets": 28},
//       {"year":"25/10","tickets": 35},
//       {"year":"26/10","tickets": 32},
//       {"year":"27/10","tickets": 28}
//   ];
   
//   var mr=5000;
//   var data;
//   var mycolor;
      
//   if(r==1){
//       data=data1;
//       mycolor='rgb(111,180,208)';
//       mr=5000;
//   }else if(r==2){
//       data=data2;
//       mycolor='rgb(126,126,126)';
//       mr=40;
//   }

//   //
//     // X axis
//     var x = d3.scaleBand()
//     .range([ 0, width ])
//     .domain(data.map(function(d) { return d.year; }))
//     .padding(0.2);
//   svg.append("g")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(x))
//     .selectAll("text")
//       .attr("transform", "translate(-10,0)rotate(-45)")
//       .style("text-anchor", "end");

//   // Add Y axis
//   var y = d3.scaleLinear()
//     .domain([0, mr])
//     .range([ height, 0]);
//   svg.append("g")
//     .call(d3.axisLeft(y));

//   // Bars
//   svg.selectAll(id)
//     .data(data)
//     .enter()
//     .append("rect")
//       .attr("x", function(d) { return x(d.year); })
//       .attr("y", function(d) { return y(d.value); })
//       .attr("width", x.bandwidth())
//       .attr("height", function(d) { return height - y(d.value); })
//       .attr("fill", mycolor)


// }


  }
}
