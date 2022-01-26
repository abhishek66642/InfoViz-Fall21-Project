import define1 from "./fundamentalgraphs.js";
import define2 from "./colorlegend.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["NYC_Restaurant_Inspection_filtered.csv",new URL("./files/RestaurantInspectionData",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Analysis of Health Code Violations in Restaurants across NYC`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Author: Abhishek Nandan Mishra`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Introduction`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`New York City is one of the most diverse and multi-cultural places in the world. It is home to approximately 8.34 million people. It is well known that NYC is the fashion and finance capital of the world. However, one essential component of the cultural fabric of NYC is the wide variety of delicious food made every day. It is one of the biggest perks of being a New Yorker as you get to try out amazing dishes while also learning about the culture and history behind the food. Preparing food is the best way to tell a story so we wanted to discover interesting insights or stories about the city through its food.

Being new to NYC, students like us love to explore the city and try out different cuisines. There are so many cuisines to choose from, it can be sometimes daunting to have such a wide variety of choices. An aspect that can't be ignored while trying out different cuisines is the quality and hygiene of food.

Through this article, we wish to answer which restaurants, spots, and cuisines in New York are safe and hygienic, which are the restaurants and areas to avoid, by analyzing the trends we observed in the different boroughs, zip codes of New York. The data and findings are obtained from various restaurant inspections initiatives that are carried out regularly in NYC by the Department of Health and Mental Hygiene (DOHMH).

We will attempt to understand the ratings of restaurants in NYC and the violations that lead to good/poor ratings. The findings are presented in the form of data visualizations in D3.js. We are going to investigate how the food violations are distributed across NYC, how violations contribute towards restaurant scores etc. Furthermore, we want to find out which cuisines are poorly rated or unhealthy and the reasons behind these ratings. This analysis ultimately aims to provide the reader insights and statistics on safer dining choices in NYC.
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### About Open NYC Restaurant Data`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`The dataset contains violation citations from special program inspections conducted for restaurants and college cafeterias in an active status. When a restaurant inspection results in more than one violation, values for associated fields are repeated for each additional violation record. We will be using recent inspection records from Jan-2019 till the present (a subset of the data).

The data is readily available on the Open NYC Data website.

The Dataset we have collected has the following attributes:

1) CAMIS - Each inspection is identified by a CAMIS (record ID) number

2) DBA(Doing Business As) - Name of the establishment where the inspection was conducted

3) BORO - Name of the Borough

4) STREET - Name of the Street

5) ZIPCODE - Signifies the zip code of DBA

6) CUISINE DESCRIPTION - Type of cuisine

7) INSPECTION DATE - Date when the inspection occurred

8) VIOLATION CODE - Type of violation occurred at DBA

9) VIOLATION DESCRIPTION - Description of violation

10) CRITICAL FLAG - Indicator of critical violation

11) SCORE - Overall score for particular inspection

12) GRADE - Grade associated with inspection

The dataset has many missing values in the grade column and we have performed filtering/data manipulation so that we have data where we do not encounter any missing values in the important columns such as GRADE, SCORE. 

The information on the various restaurant grades is also available on the Health Department’s Restaurant Grading website
`
)});
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], async function(d3,FileAttachment){return(
d3.csvParse(await FileAttachment("NYC_Restaurant_Inspection_filtered.csv").text(),d3.autoType)
)});
  main.variable(observer()).define(["Inputs","data"], function(Inputs,data){return(
Inputs.table(data, {columns: ["CAMIS","DBA","BORO","STREET","ZIPCODE","CUISINE DESCRIPTION","INSPECTION DATE","VIOLATION CODE","VIOLATION DESCRIPTION", "CRITICAL FLAG","SCORE","GRADE"], layout: "auto"})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Restaurant Distribution across zipcodes:`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`To get an idea about the number of restaurants we are dealing with and how they are distributed across NYC, we take a look at the symbol map(circles) of the number of restaurants across the various zip-codes of NYC.`
)});
  main.variable(observer("dotMap")).define("dotMap", ["d3","nycGeo","restaurantsZip","lightgray","getZip"], function(d3,nycGeo,restaurantsZip,lightgray,getZip)
{
  // Setting viz parameters
  const margin = ({top: 40, right: 0, bottom: 0, left: 20});
  const visWidth = 640 - margin.left - margin.right;
  const visHeight = 640 - margin.top - margin.bottom;

  const projection =  d3.geoAlbers()
      .fitSize([visWidth, visHeight], nycGeo);
  const nycPath = d3.geoPath().projection(projection);
  
  const svg = d3.create('svg')
      .attr('width', visWidth + margin.left + margin.right)
      .attr('height', visHeight + margin.top + margin.bottom);

  const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  // add legend
  const legendGroup = g.append("g")
      .attr('font-family', 'sans-serif')
      .attr('font-size', 12);
  
  //Setting Radius of Circles
  const maxRadius = 13 
  const maxRestaurantsForZip = d3.max(Object.values(restaurantsZip))
  const radiusRestaurant = d3.scaleSqrt()
  .domain([0, maxRestaurantsForZip])
  .range([0, maxRadius])
  
  legendGroup.append('text')
      .text('Number of restaurants')
  
  const legendRows = legendGroup.selectAll("g")
    .data([100, 200, 400])
    .join("g")
      .attr("transform", (d, i) => `translate(5, ${15 + i * 2.5 * maxRadius})`);
  
  legendRows.append("circle")
    .attr("r", d => radiusRestaurant(d))
    .attr("fill", "steelblue");

  legendRows.append("text")
    .attr("dominant-baseline", "middle")
    .attr("x", maxRadius + 5)
    .text(d => d);
  
  // draw map

  g.selectAll("path")
    .data(nycGeo.features)
    .join("path")
      .attr("d", nycPath)
      .attr("fill", lightgray)
      .attr("stroke", "white")

  // draw circles

  g.append("g")
    .selectAll("circle")
    .data(nycGeo.features)
    .join("circle")
      .attr("fill", "steelblue")
      // set the position and size of the circles
      .attr("transform", d => `translate(${nycPath.centroid(d)})`)
      .attr("r", d => radiusRestaurant(restaurantsZip[getZip(d)]))
      .attr("fill-opacity",0.6)
      .attr("stroke", "steelblue");

   g.append('text')
      .attr('x', 800 / 2 -50)
      .attr('y', -15)
      .attr('font-size', 16)
      .attr('text-anchor', 'middle')
      .attr("font-weight", "bold")
      .text('Distribution of Number of Restaurants across Zipcodes')

  return svg.node();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`As we can see from the above distribution the number of restaurants(represented by blue circles) are focused mostly around the zipcodes of the Manhattan, Brooklyn, and Queens. While working with this data and visualizing results we need to be careful to normalize the data according to the number of unique restaurants and utilize various measures such as the average number of inspections per restaurant rather than the number of inspections or restaurants in each borough to make a comparison between different boroughs, cuisines, etc. If we make a comparison with the number of restaurants then the visualization will skew towards Manhattan and Brooklyn and have a lesser contribution from Staten Island which is an uninteresting and biased insight and not very useful.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Average Inspections per restaurant in a borough`
)});
  main.variable(observer("barChart")).define("barChart", ["width","d3","ans1"], function(width,d3,ans1)
{
  // Setting viz parameters
  const margin = ({top: 30, bottom: 20, left: 75, right: 10});
  const visWidth = (width - margin.left - margin.right)/2;
  const visHeight = 250 - margin.top - margin.bottom;

  //Setting axes
  const y = d3.scaleBand()
    .domain(ans1.map(d=>d["Boro"]))
    .range([0, visHeight])
    .padding(0.2);
  const x = d3.scaleLinear()
    .domain([0, 2])
    .range([0, visWidth]);
  const yAxis = d3.axisLeft(y);
  const xAxis = d3.axisBottom(x);
  
  const svg = d3.create('svg')
      .attr('width', width)
      .attr('height',300);
  const g = svg.append("g")
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
  g.selectAll('rect')
    .data(ans1)
    .join('rect')
    .attr('x', 0)
    .attr('y', d => y(d.Boro))
    .attr('width', d => x(d.Avg_Inspections_Per_Restaurant)) 
    .attr('height', y.bandwidth()) 
    .attr('fill', 'teal');
  
  g.append('g')
      .call(yAxis)
      .call(g => g.select('.domain').remove());
  
  g.append('g')
    .attr('transform', `translate(0, ${visHeight})`)
    .call(xAxis)
    .call(g => g.select('.domain').remove())  
    .append('text')
    .attr('fill', 'black')
    .attr('font-family', 'sans-serif')
    .attr('x', visWidth / 2)
    .attr('y', 40)
    .text("Average Inspections");
  
  return svg.node();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`According to the above bar graph, we can conclude that on average there are more inspections per restaurant in Queens, Brooklyn, and Bronx than in the other boroughs. `
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Another interesting insight we can notice from the symbol map and the bar chart is that even though Manhattan has more number of restaurants it has lesser number of average inspections per restaurant as compared to other boroughs.Staten Island is expected to have a lesser number as it has lesser number of restaurants overall and is far away from the city.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Grade Distribution across Boroughs:`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Now let's take a look at the distribution of the inspection grades across all of New York City.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`There is a letter grade assigned for each inspection and the points distribution is given as follows-

A = 0–13 points

B = 14–27 points

C = 28+ points

N = Not yet graded

P = Grade pending issued on re-opening

Z = Grade pending

Grades are based upon how many violations (or points) a restaurant has, with some violations being worth more points than others if they are deemed more serious by the Department of Health. Here Grade A restaurants have least amount of violations and are safer than Grade C restaurants which has higher violation score of 28+ points.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Let's see the proportion of grades in each borough using a grouped bar chart.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Note that in the below visualization the "Others" signifies all the inspection grades N,P and Z which denote Not Yet Graded,Grade pending issued on re-opening, and Grade Pending respectively. `
)});
  main.variable(observer()).define(["html","swatches","groupedchartcolor"], function(html,swatches,groupedchartcolor){return(
html`<div style='font-family: sans-serif; font-size: 10px; font-weight: bold;'>Restaurant Grades</div>
${swatches({color:groupedchartcolor})}`
)});
  main.variable(observer("groupedbarchart")).define("groupedbarchart", ["d3","groupedchartboroughs","visualization2groupedchartdata","groupedchartcolor"], function(d3,groupedchartboroughs,visualization2groupedchartdata,groupedchartcolor)
{
  // Setting viz parameters
  const margin = ({top: 20, bottom: 50, left: 50, right: 10})
  const groupedwidth = 800 - margin.left - margin.right
  const groupedheight = 500 - margin.top - margin.bottom

  // Setting Axes
  const groupX = d3.scaleBand()
  .domain(groupedchartboroughs)
  .range([0, groupedwidth])
  .padding(0.1)
  const barX = d3.scaleBand()
  .domain(["A","B","C","Others"])
  .range([0, groupX.bandwidth()])
  .padding(0.1)
  const maxCount = d3.max(
  visualization2groupedchartdata,
  ([borough, gradeToCount]) => d3.max(gradeToCount, ([grade, count]) => count))
  const y = d3.scaleLinear()
  .domain([0, maxCount]).nice()
  .range([groupedheight, 0])
  const gradeXAxis = d3.axisBottom(groupX)
  const gradeYAxis = d3.axisLeft(y)
  
  const svg = d3.create('svg')
      .attr('width', groupedwidth + margin.left + margin.right)
      .attr('height', groupedheight + margin.top + margin.bottom);
  
  const main = svg.append("g")
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
  const groups = main.selectAll('g')
    .data(visualization2groupedchartdata)
    .join('g')
      .attr('transform', ([borough, gradeToCount]) => `translate(${groupX(borough)})`);
  
  groups.selectAll('rect')
    .data(([borough, gradeToCount]) => gradeToCount)
    .join('rect')
      .attr('x', ([grade, count]) => barX(grade))
      .attr('width', ([grade, count]) => barX.bandwidth())
      .attr('y', ([grade, count]) => y(count))
      .attr('height', ([grade, count]) => groupedheight - y(count))
      .attr('fill', ([grade, count]) => groupedchartcolor(grade));
  
  // add axes
  main.append('g')
    .attr('transform', `translate(0,${groupedheight})`)
    .call(gradeXAxis)
    .call(g => g.select('.domain').remove())
   .append('text')
      .attr('x', groupedwidth / 2)
      .attr('y', 30)
      .attr('dominant-baseline', 'hanging')
      .attr('text-align', 'middle')
      .attr('fill', 'black')
      .text('Boroughs');
  
 main.append('g')
    .call(gradeYAxis)
    .call(g => g.select('.domain').remove())
  .append('text')
    .attr('x', -50)
    .attr('y', groupedheight / 2)
    .attr('dominant-baseline', 'middle')
    .attr('text-align', 'end')
    .attr('fill', 'black')
    .attr("transform", `translate(${-250}, ${100}) rotate(-90)`)
    .text('Inspection Percentage')

  main.append('text')
      .attr('x', 800 / 2 -100)
      .attr('y', -5)
      .attr('font-size', 16)
      .attr('text-anchor', 'middle')
      .attr("font-weight", "bold")
      .text('Distribution of Inspection Grades by Borough')

  
  return svg.node();

}
);
  main.variable(observer()).define(["md"], function(md){return(
md`An interesting insight we can observe from the above graphic is that in each borough of New York there are a significant number of inspections of grade A as compared to other grades and it almost dominates the grouped bar chart entirely.
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Analyzing cuisines and some unsafe areas to eat at in NYC:`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Now we come to the big question that is which areas in NYC are unsafe and unhealthy to eat at?

For answering this we need to first define what is unhealthy and unsafe. The definition of unhealthy according to our data is any restaurant that has a critical flag set to true and grade C since grade C has maximum violation points. `
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Critical violations are more likely to contribute to food-borne illnesses because they may be of substantial risk to Public health.

Non Critical Violations are violations that do not immediately endanger human life and do not directly relate to foodborne illness risk.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`We are finding the proportion of critical Grade C inspection with respect to critical inspections with Grade A, B, and C for each zip code and we want to show which zip codes have more concentration of Grade C using a choropleth map.`
)});
  main.variable(observer()).define(["legend","nycColor"], function(legend,nycColor){return(
legend({
  color: nycColor,
  title: 'Percentage of Critical Inspections with grade C'
})
)});
  main.variable(observer("choropethMap")).define("choropethMap", ["d3","nycGeo","nycColor","qthreemap","getZip","width"], function(d3,nycGeo,nycColor,qthreemap,getZip,width)
{
  // Setting viz parameters
  const margin = ({top: 50, right: 125, bottom: 0, left: 0})
  const visWidth = 725 - margin.top - margin.bottom;
  const visHeight = 500 - margin.top - margin.bottom;
  
  const svg = d3.create('svg')
      .attr('width', visWidth + margin.left + margin.right)
      .attr('height', visHeight + margin.top + margin.bottom);

  const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const projection =  d3.geoAlbers()
      .fitSize([visWidth, visHeight], nycGeo);
  const path = d3.geoPath().projection(projection);

  g.selectAll('path')
    .data(nycGeo.features)
    .join('path')
      .attr('d', path)
      .attr('fill', zipcode => nycColor(qthreemap[getZip(zipcode)]))
      .attr('stroke', 'white');

    g.append('text')
      .attr('x', width / 2 -250)
      .attr('y', -20)
      .attr('font-size', 16)
      .attr('text-anchor', 'middle')
      .attr("font-weight", "bold")
      .text('Unhealthy regions to eat at by zipcode')

  return svg.node();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`From the above map we notice that more regions and zipcodes in the Bronx area have a higher percentage of critical C grade inspections. While this certainly does not mean that all Bronx restaurants are unhealthy to eat at, most of the zipcodes in Bronx have higher grade-C critical inspections.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`After gaining some insight on which locations in NYC tend to have unsafe food practices we wish to dive into more granularity by exploring the common cuisines in NYC which are typically safer to eat and have lesser health violations.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Grade A is the best grade an inspection of the restaurant can receive. Also according to the definition of the critical flag, we can consider a restaurant as safe if it has received an inspection grade A and has no foodborne related violation (critical flag set to False)

We see below, the stacked bar chart categorized by cuisines which shows the total number of inspections for each cuisine, and the percentage of grade A with non-critical inspections(typically considered "safe"). The two categories we have used in the stacked bar chart are NonCriticalA and Rest. NonCriticalA category represents inspections that received Grade A and non-critical flag and rest category represents all grades with critical flag true plus the remaining grades (B,C,P,Z etc) with non-critical flag. `
)});
  main.variable(observer()).define(["swatches","colorStacked"], function(swatches,colorStacked){return(
swatches({color: colorStacked})
)});
  main.variable(observer()).define(["htl"], function(htl){return(
htl.html`<pre><b>                                                           Safe Cuisines based on Inspections</b></pre>`
)});
  main.variable(observer()).define(["stackedBarChart","stacked","d3","cuisineFinalBeforeStacked"], function(stackedBarChart,stacked,d3,cuisineFinalBeforeStacked){return(
stackedBarChart({
  data: stacked,
  yMax: d3.max(cuisineFinalBeforeStacked, d => d.total),
  yFormat: '',
  yLabel: 'Grade A non critical Inspection count vs the rest'
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`We notice that Donuts, Sandwiches, and Hamburgers have a higher percentage of non-critical grade A inspections. On the contrary Spanish, Caribbean and Latin American cuisines have a lower percentage of non-critical grade A. This might be because there is a wide variety of dishes that can be cooked in these cuisines and there is a higher chance of a potential health hazardC.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### What are the reasons for violations in the restaurants?`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`From the dataset, we know that there are multiple violations possible in the same inspection. Until now we saw how the inspections grades are distributed across boroughs and how inspection varies by cuisine. An even more interesting insight would be to see the violations across the boroughs and find the most common violations that occur in each borough.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Keeping this thought in mind we examine the violation codes and their descriptions. The Department of Health gives a generic description about the violation and maps it to violation codes so that it's easy to keep track of the huge number of violations across restaurants in NYC. There are approximately 64 violation codes.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`We analyze the percentage contribution of each violation code overall and take a look at the top 11 violation codes as they contribute to roughly 75% of the total number of violations.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`A heatmap is an appropriate visualization to see the distribution of violation codes across boroughs. The range varies a lot for each borough. Hence before constructing the heatmap we are normalizing the values to the range [0,1] for all the boroughs.`
)});
  main.variable(observer()).define(["legend","colorHeat"], function(legend,colorHeat){return(
legend({ color:colorHeat, title: "Borough wise normalised violation count", ticks: 5})
)});
  main.variable(observer("matrix")).define("matrix", ["d3","violation_codes_array","heatmapBoroughs","q5Data","colorHeat"], function(d3,violation_codes_array,heatmapBoroughs,q5Data,colorHeat)
{
  // Setting viz parameters
  const margin = {top: 90, right: 10, bottom: 20, left: 80};
  const visWidth = 750 - margin.left - margin.right;
  const visHeight = 500 - margin.top - margin.bottom;
  
  const svg = d3.create('svg')
      .attr('width', visWidth + margin.left + margin.right)
      .attr('height', visHeight + margin.top + margin.bottom);
  
  const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);  

  //Setting axes
  const y = d3.scaleBand()
      .domain(violation_codes_array)
      .range([0, visHeight])
      .paddingInner(0.15);
  const x = d3.scaleBand()
      .domain(heatmapBoroughs)
      .range([0, visWidth])
      .paddingInner(0.04);  
  const xAxis = d3.axisTop(x).tickSize(0);
  
  g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0,-5)")
      .call(xAxis)
      .call(g => g.selectAll(".domain").remove())
      .selectAll("text")
        .style("text-anchor", "middle") 
        .attr("transform", "rotate(0)")
  
  g.append("text")
      .attr("x", visWidth / 2 -10)
      .attr("y", -margin.top -20)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "hanging")
      .style('font-size', 15)
      .text("Boroughs");
  
  const yAxis = d3.axisLeft(y).tickSize(0);
  
  g.append("g")
      .call(yAxis)
      .call(g => g.selectAll(".domain").remove())
    .append("text")
      .attr("fill", "black")
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${-0.7*margin.left}, ${visHeight / 2 -5}) rotate(-90)`)
      .style('font-size', 12)
      .text("Violation Codes");  

  g.append('text')
      .attr('font-size', '16px')
      .attr('dominant-baseline', 'hanging')
      .attr('x', (visWidth/2) - 150)
      .attr('y', -margin.top -50)
      .attr("font-weight", "bold")
      .text('Violation code distribution by borough');
  
  const background = g.append('g');
  
  background.append('rect')
      .attr('width', visWidth)
      .attr('height', visHeight)
      .attr('fill', '#eeeeee');
  
  const xPaddingSize = x.step() * x.paddingInner();
  const yPaddingSize = y.step() * y.paddingInner();  
  
  background.append('g')
    .selectAll('line')
    .data(heatmapBoroughs.slice(1))
    .join('line')
      .attr('x1', d => x(d) - xPaddingSize / 2)
      .attr('x2', d => x(d) - xPaddingSize / 2)
      .attr('y1', 0)
      .attr('y2', visHeight)
      .attr('stroke-width', xPaddingSize)
      .attr('stroke', 'white');  
  
  background.append('g')
    .selectAll('line')
    .data(violation_codes_array.slice(1))
    .join('line')
      .attr('y1', d => y(d) - yPaddingSize / 2)
      .attr('y2', d => y(d) - yPaddingSize / 2)
      .attr('x1', 0)
      .attr('x2', visWidth)
      .attr('stroke-width', yPaddingSize)
      .attr('stroke', 'white');  
  
  g.append('g')
    .selectAll('g')
    .data(q5Data)
    .join('rect')
      .attr('x', d => x(d.boro))
      .attr('y', d => y(d.code))
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .attr('fill', d => colorHeat(d.normalized_count))  
  
  return svg.node();
}
);
  main.variable(observer()).define(["Inputs","violationCodeMappingSorted"], function(Inputs,violationCodeMappingSorted){return(
Inputs.table(violationCodeMappingSorted)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`A takeaway from the above visualization we can notice is that Staten Island generally has lesser number of violations for most of the violation codes shown. Intuitively this might make sense as Staten Island is a bit isolated from the actual city and there is lesser evidence of violations. Some violation codes such as 04L(Evidence of mice or live mice) and 08A(Facility not vermin proof) are much lesser than the boroughs of Manhattan,Bronx and Queens. One reason for this could be that there is a higher population in these boroughs and in general more people leads to more trash being thrown out which in turn attract mice and vermin.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### How has the situation changed over time?`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Let's consider a temporal component of our data which is the inspection date and score each restaurant receives during each inspection. We will try to observe a trend on how the average score of inspections changes across the boroughs over the months of 2019. We have taken only data only for 2019 since for the other years in our dataset all the months are not present. Because of the COVID-19 pandemic situation, the restaurant inspections didn't occur much and therefore we only have data for three-four months for the years 2020 and 2021.`
)});
  main.variable(observer()).define(["swatches","linechartcolor"], function(swatches,linechartcolor){return(
swatches({color:linechartcolor})
)});
  main.variable(observer("multilineChart")).define("multilineChart", ["queens","d3","maxViolations","dataByBorough","linechartcolor"], function(queens,d3,maxViolations,dataByBorough,linechartcolor)
{
  // Setting viz parameters
  const margin = ({top: 30, right: 30, bottom: 40, left: 40});
  const visWidth = 950 - margin.left - margin.right;
  const visHeight = 500 - margin.top - margin.bottom;

  // Setting axes
  const monthExtent = [queens[0].date, queens[queens.length- 1].date];
  const x = d3.scaleTime()
    .domain(monthExtent)
    .range([0, visWidth]);
  const y = d3.scaleLinear()
    .domain([8, maxViolations]).nice()
    .range([visHeight, 0]);
  const line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.avg_violations));
  const xAxis = d3.axisBottom(x)
    // show the full month name in the tick marks
    .tickFormat(d3.timeFormat('%B'));
  const yAxis = d3.axisLeft(y);
  
  const svg = d3.create('svg')
      .attr('width', visWidth + margin.left + margin.right)
      .attr('height', visHeight + margin.top + margin.bottom);
  
  const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
  g.append('g')
      .attr('transform', `translate(0,${visHeight})`)
      .call(xAxis)
    .append('text')
      .attr('fill', 'black')
      .attr('font-family', 'sans-serif')
      .attr('font-weight', 'bold')
      .attr('x', visWidth / 2) 
      .attr('y', 40) 
      .text('Months');
  
  g.append('g')
      .call(yAxis)
      .call(g => g.select('.domain').remove())

    .append('text')
      .attr('fill', 'black')
      .attr("transform", "rotate(-90)")
      .attr('text-anchor', 'start')
      .attr('dominant-baseline', 'hanging')
      .attr('font-weight', 'bold')
      .attr('y', visHeight/2 -255)
      .attr('x', -margin.left -200)
      .text('Average score');
  
  const linesGroup = g.append('g');

  linesGroup
    .selectAll('path')
    .data(dataByBorough)
    .join('path')
      .attr('stroke', d => linechartcolor(d.borough))
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('d', d => line(d.counts));

   g.append('text')
      .attr('font-size', '16px')
      .attr('dominant-baseline', 'hanging')
      .attr('x', visWidth /2-200)
      .attr('y', -margin.top+10)
      .attr("font-weight", "bold")
      .text('Change in Average Score across Boroughs, 2019');
  
  return svg.node();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`The line chart above shows us that there is an increasing upward trend from the months of April to July. In April all the 5 boroughs have a low average score value but it steadily increases from then onwards till there is a peak in between the months of July and August. One reason for this could be that April typically marks the end of winter in NYC and the summer season officially kicks in, which leads to more gatherings and social events at restaurants and hence results in a greater number of hygiene-related health hazards. `
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Conclusion:`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Overall we can conclude that there are quite a few zip codes and cuisines where we see evidence of hazardous violations(ones that can cause food illnesses) and poor inspection ratings but in general, most restaurants maintain healthy safety standards. For a person who is new to NYC, it is  the perfect place to try out a variety of cuisines and dishes without having to worry much about the cleanliness of the establishments as most restaurants maintain good food and safety standards.

On a borough level, we can observe that Staten Island has a higher cleanliness and hygiene standard. On the contrary, Bronx restaurants tend to have fewer restaurant inspections but of those, the distribution of inspections with food-borne health hazards (critical grade-C inspections) is more.
We also dive deeper into the reasons for some of these violations. Overall, we noticed that many violations are generic and almost all restaurants have these kinds of violations such as "food contact surface is unclean". It is well known that NYC has a lot of rats and so it comes as no surprise when we see some violations which are related to rodent infestations. As Staten Island is further away from the city, the number of mice and vermin there might be less. This conjecture is also observed in the heatmap visualization which shows that the number of inspections due to mice and vermin are less for Staten Island as compared to the other boroughs.

But NYC has a wide variety of cuisines and restaurants to try from so one can never get tired of trying out all the different types of food that is available here! One should just be aware of the restaurant ratings and area-wise food safety and choose the place to dine after researching on it. This can be done with ease nowadays as there is a large number of food review applications like Yelp, Grubhub, Foursquare, etc. which provides reviews on almost all restaurants and all the essential information that a person needs before visiting an establishment.
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### References`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Open NYC Data Website Source - https://data.cityofnewyork.us/Health/DOHMH-New-York-City-Restaurant-Inspection-Results/43nn-pn8j/data`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Department of Health Grading Website - http://www1.nyc.gov/site/doh/services/restaurant-grades.page `
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Restaurant Grading Website book - https://www1.nyc.gov/assets/doh/downloads/pdf/rii/blue-book.pdf`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Appendix`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Data Questions`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`1) What is the average number of restaurant inspections across each borough?`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`2) What is the distribution of the restaurant grades across each borough in NYC?`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`3) Which are the zipcodes with both critical flag(food borne illness) and grade C  rated restaurants?`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`4) What are top cuisines with highest safety standards (non-critical percentage) ?`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`5) What is the distribution of violation codes across each borough of NYC?`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`6) How does the average score of restaurants distribute across the boroughs in 2019?`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Common Code`
)});
  main.variable(observer("getZip")).define("getZip", function(){return(
feature => feature.properties.zcta
)});
  const child1 = runtime.module(define1);
  main.import("nycGeo", child1);
  main.import("lightgray", child1);
  main.variable(observer("violationCodes")).define("violationCodes", ["data"], function(data){return(
data.map(d=>({'ViolationCode':d['VIOLATION CODE'],'ViolationDescription':d['VIOLATION DESCRIPTION']}))
)});
  main.variable(observer("violationCodemapping")).define("violationCodemapping", ["violationCodes","violation_codes_set"], function(violationCodes,violation_codes_set){return(
Array.from(new Map(violationCodes.map(key => [key.ViolationCode, key.ViolationDescription]))).filter(d=>violation_codes_set.has(d[0])).map(currentElement=>({"Violation Code":currentElement[0],"Violation Description":currentElement[1]}))
)});
  main.variable(observer("violationMapping")).define("violationMapping", ["d3","violationCodemapping"], function(d3,violationCodemapping){return(
d3.rollup(violationCodemapping, g => g, d => d['Violation Code'])
)});
  main.variable(observer("violationCodeMappingSorted")).define("violationCodeMappingSorted", ["violation_codes_array","violationMapping"], function(violation_codes_array,violationMapping){return(
violation_codes_array.map(d => ({ViolationCode: d, ViolationDescription: violationMapping.get(d)[0]['Violation Description']}))
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Question 1 Code`
)});
  main.variable(observer("restaurantsZip")).define("restaurantsZip", ["d3","data"], function(d3,data){return(
Object.fromEntries(d3.rollups(data, g=>g.length, d=>d.ZIPCODE, d=>d.DBA).map(d=> [d[0], d[1].length]))
)});
  main.variable(observer("restaurantByBoroughData")).define("restaurantByBoroughData", ["d3","data"], function(d3,data){return(
d3.rollups(d3.flatRollup(data, g=>1,d=>d.BORO, d=>d['ZIPCODE'], d=>d['STREET'], d => d.DBA, d => d['INSPECTION DATE']),
                                    g=>g.length,
                                    d=>d[0])
)});
  main.variable(observer("restaurantByBoroughMap")).define("restaurantByBoroughMap", ["restaurantByBoroughData"], function(restaurantByBoroughData){return(
new Map(restaurantByBoroughData)
)});
  main.variable(observer("q1Data")).define("q1Data", ["d3","data"], function(d3,data){return(
d3.rollup(d3.flatRollup(data, g=>1, d=>d.BORO, d=>d.ZIPCODE, d=>d.STREET, d=>d.DBA).map(d=>({BORO: d[0]})),
                   g=>g.length,
                   d=>d.BORO)
)});
  main.variable(observer("ans1")).define("ans1", ["restaurantByBoroughData","q1Data","d3"], function(restaurantByBoroughData,q1Data,d3){return(
restaurantByBoroughData.map(currentElement=>({"Boro":currentElement[0],"Avg_Inspections_Per_Restaurant":currentElement[1]/q1Data.get(currentElement[0])})).sort((a,b)=>d3.descending(a["Avg_Inspections_Per_Restaurant"],b["Avg_Inspections_Per_Restaurant"]))
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Question 2 Code`
)});
  main.variable(observer("visualization2groupedchartdata")).define("visualization2groupedchartdata", ["d3","data","restaurantByBoroughMap"], function(d3,data,restaurantByBoroughMap){return(
new Map(Object.entries(d3.rollups(d3.flatRollup(data, g=>1,d=>d.BORO, d=>d['ZIPCODE'], d=>d['STREET'], d => d.DBA,d=>d["GRADE"], d => d['INSPECTION DATE']),g=>g.length,d=>d[0],d=>d[4]).map((arr) => ([arr[0], arr[1].sort()])).map(ce=>({"Borough":ce[0],"A":(ce[1][0][1]/restaurantByBoroughMap.get(ce[0]))*100,"B":(ce[1][1][1]/restaurantByBoroughMap.get(ce[0]))*100,"C":(ce[1][2][1]/restaurantByBoroughMap.get(ce[0]))*100,"Others":((ce[1][3][1]+ce[1][4][1]+ce[1][5][1])/restaurantByBoroughMap.get(ce[0]))*100})).reduce(((prev, cur) => ({ ...prev, [cur.Borough]: new Map(Object.entries(cur).slice(1)) })), {})))
)});
  main.variable(observer("groupedchartboroughs")).define("groupedchartboroughs", ["restaurantByBoroughData","d3"], function(restaurantByBoroughData,d3){return(
restaurantByBoroughData.sort((a,b)=> d3.descending(a[1], b[1])).map(d=>d[0])
)});
  main.variable(observer("groupedchartcolor")).define("groupedchartcolor", ["d3"], function(d3){return(
d3.scaleOrdinal()
  .domain(["A","B","C","Others"])
  .range(d3.schemeCategory10)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Question 3 Code`
)});
  main.variable(observer("criticalData")).define("criticalData", ["d3","data"], function(d3,data){return(
d3.filter(data, d=> d['CRITICAL FLAG']=='Critical')
)});
  main.variable(observer("restaurantsbyZipcode")).define("restaurantsbyZipcode", ["d3","criticalData"], function(d3,criticalData){return(
d3.rollups(criticalData, g=>g.length,d=> d.ZIPCODE, d=>d.DBA)
)});
  main.variable(observer("gradedData")).define("gradedData", ["d3","criticalData"], function(d3,criticalData){return(
d3.rollup(criticalData, g=>g.length,d=> d.ZIPCODE, d=>d.GRADE)
)});
  main.variable(observer("qThreeData")).define("qThreeData", ["restaurantsbyZipcode","gradedData"], function(restaurantsbyZipcode,gradedData){return(
restaurantsbyZipcode.map(currentElement=>({'Zipcode':currentElement[0],'C_Grade_Violations':gradedData.get(currentElement[0]).get('C')/(gradedData.get(currentElement[0]).get('A')+gradedData.get(currentElement[0]).get('B')+gradedData.get(currentElement[0]).get('C'))})).filter(d=>!Number.isNaN(d['C_Grade_Violations']))
)});
  main.variable(observer("qthreemap")).define("qthreemap", ["qThreeData"], function(qThreeData){return(
Object.fromEntries(new Map(qThreeData.map(key => [key.Zipcode, key.C_Grade_Violations])))
)});
  main.variable(observer("maxCgradeviolations")).define("maxCgradeviolations", ["d3","qThreeData"], function(d3,qThreeData){return(
d3.max(qThreeData,d=>d['C_Grade_Violations'])
)});
  main.variable(observer("nycColor")).define("nycColor", ["d3","maxCgradeviolations"], function(d3,maxCgradeviolations){return(
d3.scaleSequentialSqrt()
  .domain([0, maxCgradeviolations])
  .interpolator(d3.interpolateYlOrRd).unknown('lightgray')
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Question 4 Code`
)});
  main.variable(observer("cuisineInspCount")).define("cuisineInspCount", ["d3","data"], function(d3,data){return(
d3.rollup(d3.flatRollup(data, g => 1, d => d.ZIPCODE, d=>d.DBA, d => d['INSPECTION DATE'], d => d['CUISINE DESCRIPTION'], d=>d['CRITICAL FLAG'], d=>d.GRADE).map(d=>({CUISINE: d[3]})), g=>g.length, d=>d.CUISINE)
)});
  main.variable(observer("cuisineData")).define("cuisineData", ["d3","data","cuisineInspCount"], function(d3,data,cuisineInspCount){return(
d3.flatRollup(d3.flatRollup(data, g => 1, d => d.ZIPCODE, d=>d.DBA, d => d['INSPECTION DATE'], d => d['CUISINE DESCRIPTION'], d=>d['CRITICAL FLAG'], d=>d.GRADE).
  map(d => ({CUISINE:d[3], FLAG: d[4], GRADE: d[5]})), g=>g.length, d=>d.CUISINE, d=>d.FLAG, d=>d.GRADE).map(d=>({CUISINE: d[0], FLAG: d[1], grade: d[2], gradeCount: d[3], total:cuisineInspCount.get(d[0])}))
)});
  main.variable(observer("cuisineDataBeforeStacked")).define("cuisineDataBeforeStacked", ["d3","cuisineData"], function(d3,cuisineData){return(
d3.filter(cuisineData, d=> d.FLAG == 'Not Critical' && d.grade=='A').map(d=>({CUISINE: d.CUISINE, NonCriticalA: (d.gradeCount/d.total)*100, total: d.total, rest: ((d.total - d.gradeCount)/d.total)*100})).filter(d=>d['total']>=1000)
)});
  main.variable(observer("cuisine")).define("cuisine", ["d3","cuisineDataBeforeStacked"], function(d3,cuisineDataBeforeStacked){return(
d3.sort(cuisineDataBeforeStacked, (a,b) => d3.descending(a.NonCriticalA, b.NonCriticalA)).map(d=>d.CUISINE)
)});
  main.variable(observer("cuisineSet")).define("cuisineSet", ["cuisine"], function(cuisine){return(
new Set(cuisine)
)});
  main.variable(observer("cuisineFinalBeforeStacked")).define("cuisineFinalBeforeStacked", ["d3","cuisineDataBeforeStacked","cuisineSet"], function(d3,cuisineDataBeforeStacked,cuisineSet){return(
d3.filter(cuisineDataBeforeStacked, d=>cuisineSet.has(d.CUISINE))
)});
  main.variable(observer("cuisineInspectionBar")).define("cuisineInspectionBar", ["cuisineFinalBeforeStacked"], function(cuisineFinalBeforeStacked){return(
cuisineFinalBeforeStacked.map(d => ({CUISINE: d.CUISINE, total: d.total}))
)});
  main.variable(observer("crit_noncrit")).define("crit_noncrit", function(){return(
["NonCriticalA", "rest"]
)});
  main.variable(observer("colorStacked")).define("colorStacked", ["d3","crit_noncrit"], function(d3,crit_noncrit){return(
d3.scaleOrdinal()
    .domain(crit_noncrit)
    .range(d3.schemeSet1)
)});
  main.variable(observer("stacked")).define("stacked", ["d3","crit_noncrit","cuisineFinalBeforeStacked"], function(d3,crit_noncrit,cuisineFinalBeforeStacked){return(
d3.stack()
    .keys(crit_noncrit)(cuisineFinalBeforeStacked)
)});
  main.variable(observer("stackedBarChart")).define("stackedBarChart", ["d3","cuisine","colorStacked","cuisineInspectionBar"], function(d3,cuisine,colorStacked,cuisineInspectionBar){return(
function stackedBarChart({data, yMax, yFormat, yLabel}) {
  const margin = {top: 30, right: 20, bottom: 70, left: 6};
  const visWidth = 1000 - margin.left - margin.right;
  const visHeight = 500- margin.top - margin.bottom;
  
  const svg = d3.create('svg')
      .attr('width', visWidth + margin.left + margin.right)
      .attr('height', visHeight + margin.top + margin.bottom);
  
  const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
  const x = d3.scaleLinear()
      .domain([0, 100]).nice()
      .range([550, 0]);
  
  const y =  d3.scaleBand()
      .domain(cuisine)
      .range([0, visHeight])
      .padding(0.1);
  
  const xAxis = d3.axisBottom(x);
  
  const yAxis = d3.axisRight(y);
  
  // add a group for the y-axis
  g.append('g')
      .call(yAxis)
      // remove the baseline
      .call(g => g.select('.domain').remove())
      .attr('transform', `translate(570,0)`);
  
  // add a group for the x-axis
  g.append('g')
      // we have to move this group down to the bottom of the vis
      .attr('transform', `translate(0, ${visHeight})`)
      .call(xAxis)
      .call(g => g.select('.domain').remove())
    // add a label for the x-axis
    .append('text')
      .attr('fill', 'black')
      .attr('font-family', 'sans-serif')
      .attr('x', 200)
      .attr('y', 40)
      .text("Percentage of Total Inspections");
  
  const series = g.append('g')
    .selectAll('g')
    .data(data)
    .join('g')
      .attr('fill', d => colorStacked(d.key));
  
  series.selectAll('rect')
    .data(d => d)
    .join('rect')
      .attr('y', d => y(d.data.CUISINE))
      .attr('height', d => y.bandwidth())
      .attr('x', d => x(d[1]))
      .attr('width', d=> x(d[0]) - x(d[1]));

  /////////////////////////////////////////////////////////////
  //here is the code for side bar chart:
  /////////////////////////////////////////////////////////////
 const cuisineInspectionExtent = d3.extent(cuisineInspectionBar, d=>d.total)
 const yB = d3.scaleBand()
    .domain(cuisine)
    .range([0, visHeight])
    .padding(0.1)
  
  const xB = d3.scaleLinear()
    .domain([0, cuisineInspectionExtent[1]])
    .range([0, 300])
  
  const yAxisB = d3.axisLeft(yB);
  const xAxisB = d3.axisBottom(xB).tickFormat(d3.format("~s"));

  const g2 = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
      
  
  g2.append('g')
      .call(yAxisB)
      .call(g2 => g2.select('.domain').remove());
  
  g2.append('g')
    .attr('transform', `translate(${700}, ${visHeight})`)
      .call(xAxisB)
      .call(g2 => g2.select('.domain').remove())
        .append('text')
          .attr('fill', 'black')
          .attr('font-family', 'sans-serif')
          .attr('x', 175)
          .attr('y', 40)
          .text("Total Number of Inspections");
      
  g2.selectAll('rect')
    .data(cuisineInspectionBar)
    .join('rect')
      .attr('x', 700)
      .attr('y', d => yB(d.CUISINE))
      .attr('width', d => xB(d.total)) 
      .attr('height', yB.bandwidth()) 
      .attr('fill', 'orange');

  return svg.node();
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Question 5 Code`
)});
  main.variable(observer("violation_data")).define("violation_data", ["d3","data"], function(d3,data){return(
d3.rollups(data,group=>(group.length/91521)*100, d=>d['VIOLATION CODE']).sort((a,b) => d3.descending(a[1],b[1])).filter(d=>d[1]>1.9)
)});
  main.variable(observer("violation_codes_set")).define("violation_codes_set", ["violation_data"], function(violation_data){return(
new Set(violation_data.map(d=>d[0]))
)});
  main.variable(observer("violation_codes_array")).define("violation_codes_array", ["violation_codes_set"], function(violation_codes_set){return(
Array.from(violation_codes_set)
)});
  main.variable(observer("q5data")).define("q5data", ["d3","data","violation_codes_set"], function(d3,data,violation_codes_set){return(
d3.rollup(d3.filter(data, d => violation_codes_set.has(d['VIOLATION CODE'])),group=>group.length,d=>d.BORO,d => d['VIOLATION CODE'])
)});
  main.variable(observer("queen_extent")).define("queen_extent", ["d3","q5data"], function(d3,q5data){return(
d3.extent(q5data.get('Queens').values())
)});
  main.variable(observer("brooklyn_extent")).define("brooklyn_extent", ["d3","q5data"], function(d3,q5data){return(
d3.extent(q5data.get('Brooklyn').values())
)});
  main.variable(observer("manhattan_extent")).define("manhattan_extent", ["d3","q5data"], function(d3,q5data){return(
d3.extent(q5data.get('Manhattan').values())
)});
  main.variable(observer("Bronx_extent")).define("Bronx_extent", ["d3","q5data"], function(d3,q5data){return(
d3.extent(q5data.get('Bronx').values())
)});
  main.variable(observer("staten_extent")).define("staten_extent", ["d3","q5data"], function(d3,q5data){return(
d3.extent(q5data.get('Staten Island').values())
)});
  main.variable(observer("extent_total")).define("extent_total", function(){return(
[21, 7400]
)});
  main.variable(observer("q5DataViz")).define("q5DataViz", ["d3","data","violation_codes_set"], function(d3,data,violation_codes_set){return(
d3.rollups(d3.filter(data, d => violation_codes_set.has(d['VIOLATION CODE'])),group=>group.length,d=>d.BORO,d => d['VIOLATION CODE'])
)});
  main.variable(observer("queens_data")).define("queens_data", ["d3","q5DataViz","queen_extent"], function(d3,q5DataViz,queen_extent){return(
d3.map(q5DataViz[0][1], d=>({boro: "Queen", code:d[0], normalized_count: (d[1] - queen_extent[0])/(queen_extent[1] - queen_extent[0])}))
)});
  main.variable(observer("brooklyn_data")).define("brooklyn_data", ["d3","q5DataViz","brooklyn_extent"], function(d3,q5DataViz,brooklyn_extent){return(
d3.map(q5DataViz[1][1], d=>({boro: "Brooklyn", code:d[0], normalized_count: (d[1] - brooklyn_extent[0])/(brooklyn_extent[1] - brooklyn_extent[0])}))
)});
  main.variable(observer("manhattan_data")).define("manhattan_data", ["d3","q5DataViz","manhattan_extent"], function(d3,q5DataViz,manhattan_extent){return(
d3.map(q5DataViz[2][1], d=>({boro: "Manhattan", code:d[0], normalized_count: (d[1] - manhattan_extent[0])/(manhattan_extent[1] - manhattan_extent[0])}))
)});
  main.variable(observer("bronx_data")).define("bronx_data", ["d3","q5DataViz","Bronx_extent"], function(d3,q5DataViz,Bronx_extent){return(
d3.map(q5DataViz[3][1], d=>({boro: "Bronx", code:d[0], normalized_count: (d[1] - Bronx_extent[0])/(Bronx_extent[1] - Bronx_extent[0])}))
)});
  main.variable(observer("staten_data")).define("staten_data", ["d3","q5DataViz","staten_extent"], function(d3,q5DataViz,staten_extent){return(
d3.map(q5DataViz[4][1], d=>({boro: "Staten Island", code:d[0], normalized_count: (d[1] - staten_extent[0])/(staten_extent[1] - staten_extent[0])}))
)});
  main.variable(observer("q5Data")).define("q5Data", ["queens_data","brooklyn_data","manhattan_data","bronx_data","staten_data"], function(queens_data,brooklyn_data,manhattan_data,bronx_data,staten_data){return(
queens_data.concat(brooklyn_data.concat(manhattan_data.concat(bronx_data.concat(staten_data))))
)});
  main.variable(observer("heatmapBoroughs")).define("heatmapBoroughs", function(){return(
["Queens", "Brooklyn", "Staten Island", "Bronx", "Manhattan"]
)});
  main.variable(observer("colorHeat")).define("colorHeat", ["d3"], function(d3){return(
d3.scaleQuantize([0,1], d3.schemePurples[5]).unknown("#eeeeee")
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Question 6 Code`
)});
  main.variable(observer("datetimeParser")).define("datetimeParser", ["d3"], function(d3){return(
d3.timeParse("%m/%d/%Y")
)});
  main.variable(observer("inspectionDataByBoro")).define("inspectionDataByBoro", ["d3","data","datetimeParser"], function(d3,data,datetimeParser){return(
d3.flatRollup(data.filter(d=>d3.timeYear(datetimeParser(d['INSPECTION DATE'])).getFullYear()=="2019"),
          g => 1, 
          d => d.BORO,
          d => d.DBA, d=>d['INSPECTION DATE'], d=>d.SCORE).
          map(d=>({boro: d[0], camis: d[1], inspectionDate: d[2], score: d[3]}))
)});
  main.variable(observer("dataByBorough")).define("dataByBorough", ["d3","inspectionDataByBoro","datetimeParser"], function(d3,inspectionDataByBoro,datetimeParser){return(
d3.rollups(inspectionDataByBoro, g => d3.sum(g, r=>r.score)/g.length, d => d.boro, d => d3.timeMonth(datetimeParser(d.inspectionDate))).map(([borough, months]) => ({
    borough: borough,
    counts: months
      .map(([date, avg_violations]) => ({date, avg_violations}))
      .sort((a, b) => d3.ascending(a.date, b.date))
  }))
)});
  main.variable(observer("maxViolations")).define("maxViolations", ["d3","dataByBorough"], function(d3,dataByBorough){return(
d3.max(
  dataByBorough,
  boroughCounts => d3.max(boroughCounts.counts, month => month.avg_violations)
)
)});
  main.variable(observer("queens")).define("queens", ["dataByBorough"], function(dataByBorough){return(
dataByBorough[0].counts
)});
  main.variable(observer("linechartBoroughs")).define("linechartBoroughs", ["dataByBorough"], function(dataByBorough){return(
dataByBorough.map(d => d.borough)
)});
  main.variable(observer("linechartcolor")).define("linechartcolor", ["d3","linechartBoroughs"], function(d3,linechartBoroughs){return(
d3.scaleOrdinal()
  .domain(linechartBoroughs)
  .range(d3.schemeTableau10)
)});
  main.variable(observer("monthsToNotice")).define("monthsToNotice", function(){return(
new Set([4,5,6,7,8,9])
)});
  const child2 = runtime.module(define2);
  main.import("legend", child2);
  main.import("swatches", child2);
  return main;
}
