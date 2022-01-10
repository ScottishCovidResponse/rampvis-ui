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

        let d0=options.data[0].values;

        let d0_last7day=d0.slice(d0.length-14*7,d0.length)

        let last7day_inf=[]
        let tempTotalInf=0
        let last7day_dea=[]
        let tempTotalDea=0

        d0_last7day.forEach(function(item, index){
            tempTotalInf=tempTotalInf+item["case"]
            tempTotalDea=tempTotalDea+item["death"]

            if(index !=0 && index%13==0){
                last7day_inf.push(
                    {
                        "year":item["date"],
                        "value":tempTotalInf
                    }
                )

                last7day_dea.push(
                    {
                        "year":item["date"],
                        "value":tempTotalDea
                    }
                )

                tempTotalInf=0
                tempTotalDea=0
            }
        })

        let d0_lastday=d0.slice(d0.length-14,d0.length)

        let totalInf=0;
        let totalInhos=0;
        let totalIcu=0;
        let totalDea=0;

        let dataInf=[];
        let dataInhos=[];
        let dataIcu=[];
        let dataDea=[];
        let dataVac=[];

        d0_lastday.forEach(function(item, index){
            totalInf=totalInf+item["case"]
            totalInhos=totalInhos+item["hospital"]
            totalIcu=totalIcu+item["icu"]
            totalDea=totalDea+item["death"]
            if(index<7){
                dataInf.push({
                    year:item["agegroup"],
                    male:0,
                    female:item["case"]
                });

                dataInhos.push({
                    year:item["agegroup"],
                    male:0,
                    female:item["hospital"]
                });

                dataIcu.push({
                    year:item["agegroup"],
                    male:0,
                    female:item["icu"]
                });

                dataDea.push({
                    year:item["agegroup"],
                    male:0,
                    female:item["death"]
                });

            }else{
                dataInf[index-7].male=item["case"]
                dataInhos[index-7].male=item["hospital"]
                dataIcu[index-7].male=item["icu"]
                dataDea[index-7].male=item["death"]
            }
        })


        let d1=options.data[1].values;
        let d1_lastday=d1.slice(d1.length-12,d1.length)	

        let totalVac=0;
        let totalPop=0;
                        
        d1_lastday.forEach(function(item, index){
            if(index !=1){
                totalVac=totalVac+item["CumulativeNumberVaccinated"]
                totalPop=totalPop+item["Population"]
            }
        })

        let d1_lastdayVac=d1.slice(d1.length-12-22,d1.length-12)
        d1_lastdayVac.splice(1,1)
        d1_lastdayVac.splice(11,1)

        d1_lastdayVac.forEach(function(item, index){
            if(index<10){
                dataVac.push({
                    year:item["AgeGroup"],
                    male:0,
                    female:item["CumulativeNumberVaccinated"]
                });
            }else{
                dataVac[index-10].male=item["CumulativeNumberVaccinated"]              
            }
        })
        dataVac[9].year='80+'

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
                    <span><div class="a">Vaccinated</div></span>
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
                            <th style="width:15%; font-size:13px">Vaccinated</th>
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

        let data3key1=totalInhos+" in"
        let data3key2=totalInf-totalInhos
        let data3={}
        data3[data3key1]=totalInhos
        data3[data3key2]=totalInf-totalInhos

        let data4key1=totalIcu+" icu"
        let data4key2=totalInhos-totalIcu
        let data4={}
        data4[data4key1]=totalIcu
        data4[data4key2]=totalInhos-totalIcu
        
        let data5key1=totalVac+" vac"
        let data5key2=totalPop-totalVac
        let data5={}
        data5[data5key1]=totalVac
        data5[data5key2]=totalPop-totalVac


        drawpiechart(150,200,['rgb(101, 80, 187)','rgb(146,122,242)'],"#fillgauge3",data3,"In-patient percentage of last day ",totalInhos,totalInf)
        drawpiechart(150,200,['rgb(146, 59, 111)','rgb(205,97,162)'],"#fillgauge4",data4,"ICU patient percentage of last day",totalIcu,totalInhos)
        drawpiechart(150,200,['rgb(99, 136, 20)','rgb(177,212,103)'],"#fillgauge5",data5,"Dose-2 percentage of last day",totalVac,totalPop)

        drawstackbarchart("#ag_infection","Infection by age group")
        drawstackbarchart("#ag_deaths","Deaths by age group")
        drawstackbarchart("#ag_hospital","In hospital by age group")
        drawstackbarchart("#ag_icu","ICU by age group")
        drawstackbarchart("#ag_vaccined","Vaccined by age group")

        createbar("#fillgauge1",150,200,1)
        createbar("#fillgauge2",150,200,2)

    
        function drawstackbarchart(id,title){

            const maxHeight = 150;
            const maxWidth = 200;
            const barWidth = 15;
            let data;

            if(id=="#ag_infection"){
                data=dataInf
            }else if(id=="#ag_deaths"){
                data=dataDea
            }else if(id=="#ag_hospital"){
                data=dataInhos
            }else if(id=="#ag_icu"){
                data=dataIcu
            }else if(id=="#ag_vaccined"){
                data=dataVac
            }

            const keys = ['male','female']   

            const getTimePoint = (d) => {
                const _d = d.data ? d.data : d;
                return `${_d.year}`;
            }

            const stack = d3.stack().keys(keys).order(d3.stackOrderNone).offset(d3.stackOffsetNone);
            const series = stack(data);
            console.log(series)

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

        }


        function drawpiechart(w,h,mycolor,id,mydata,title,n,m) {
            let width = w
            let height = h
            let margin = 0
            
            let radius = Math.min(width, height) / 2 - 5

            let svg = d3.select(id)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            let data = mydata;

            let color = d3.scaleOrdinal()
            .domain(data)
            .range(mycolor);

            let pie = d3.pie()
            .value(function(d) {return d.value; })
            let data_ready = pie(d3.entries(data))
 
            let arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(radius)

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


        function createbar(id,w,h,r){

            let margin = {top: 20, right: 2, bottom: 60, left: 28},
                width = w - margin.left - margin.right,
                height = h - margin.top - margin.bottom;

            let svg = d3.select(id)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")");

            let mr=5000;
            let data;
            let mycolor;
                
            if(r==1){
                data= last7day_inf;
                mycolor='rgb(111,180,208)';
                mr=5000;
            }else if(r==2){
                data= last7day_dea;
                mycolor='rgb(126,126,126)';
                mr=40;
            }

            let x = d3.scaleBand()
            .range([ 0, width ])
            .domain(data.map(function(d) { return d.year; }))
            .padding(0.2);

            svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .style("font-size", "8px") 

            let y = d3.scaleLinear()
            .domain([0, mr])
            .range([ height, 0]);

            svg.append("g")
            .call(d3.axisLeft(y))
            .style("font-size", "8px")

            svg.selectAll(id)
            .data(data)
            .enter()
            .append("rect")
            .attr("x", function(d) { return x(d.year); })
            .attr("y", function(d) { return y(d.value); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height - y(d.value); })
            .attr("fill", mycolor)

            svg.append("text")
            .attr("x", (width/2))             
            .attr("y", (h - margin.top -10))
            .attr("text-anchor", "middle")  
            .style("font-size", "10px")          
            .text("Value of last 7 days");

        }

    }
}
