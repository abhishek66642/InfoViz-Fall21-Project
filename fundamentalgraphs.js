// https://observablehq.com/@nyuvis/fundamental-graphs@1087
import define1 from "./colorlegend.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["iris@1.csv",new URL("./files/IrisData",import.meta.url)],["nyu-2451-34509-geojson.json",new URL("./files/IrisURL",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Fundamental Graphs with D3

This notebook contains examples on how to make some fundamental graphs using D3. I also link to examples made by Mike Bostock, who is the creator of D3 and Observerable. Mike's examples are more idiomatic for Observable, whereas the examples I give are mostly contained to one cell, which will make it easier to adapt them for use off of Observable.

If you're looking for an example with more explanations, check out the [Bar Chart Walk-through](/@nyuvis/bar-chart-walk-through).

These charts use the margin convention described [here](https://bl.ocks.org/mbostock/3019563). Also, instead of doing data joins using \`enter\` and \`append\` like in the videos, I do them using the newer \`join\` method, which makes things simpler. I recommend reading the [\`selection.join\`](/@d3/selection-join) notebook.

As a reminder, click to the left of a cell to see and edit the code for it. For the cells that return data, you can click on the black triangle to the right of the equal sign to expand.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## D3

As you learn D3, you'll find the [API reference](https://github.com/d3/d3/blob/master/API.md) to be usefeul.

Here are some modules that you may find handy as you get started:

* [d3-selection](https://github.com/d3/d3-selection/tree/v1.4.1)
  * This module is foundational to D3. It allows you to select and modify elements and bind data to them.
* [d3-scale](https://github.com/d3/d3-scale/tree/v2.2.2)
  * Specify how to map from your data to visual properties, such as position, size, and color.
* [d3-array](https://github.com/d3/d3-array/tree/master)
  * You've already seen this module in the [Data Transformation](/@nyuvis/data-transformation?collection=@nyuvis/info-vis-course) notebook. It's useful when you need to group arrays or get summary statistics of an array.
* [d3-axis](https://github.com/d3/d3-axis/tree/v1.0.12)
  * Specify axes and tick marks.
* [d3-scale-chromatic](https://github.com/d3/d3-scale-chromatic/tree/v1.5.0)
  * Color schemes.
* [d3-format](https://github.com/d3/d3-format/tree/v1.4.3)
  * Formatting numbers.
* [d3-time-format](https://github.com/d3/d3-time-format/tree/v2.2.3)
  * Formatting and parsing dates.
* [d3-shape](https://github.com/d3/d3-shape/tree/v1.3.7)
  * [Line generator](https://github.com/d3/d3-shape/tree/v1.3.7#lines) for line charts, [area generator](https://github.com/d3/d3-shape/tree/v1.3.7#areas) for area charts, [\`d3.stack\`](https://github.com/d3/d3-shape/tree/v1.3.7#stacks) for stacked bar charts and stacked area charts, [pie generator](https://github.com/d3/d3-shape/tree/v1.3.7#pies) for pie charts, and more.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## How to approach writing your code

Let's say you have a sketch of a visualization that you want to make. How can you approach implementing it with D3? Here's a general approach that you can take.

* Think carefully about your graphical encoding.
 * What are your marks?
 * What data objects do those marks represent?
 * What are your channels?
 * How are you mapping from your data to your channels?
* Do your data transformation
 * Take a look at the dataset that you have. Figure out how you need to transform your data in order to get it into a format that your visualization needs.
* For the visualization, start with the basics:
 * Create your SVG element.
 * Set up your margins.
* Next, figure out your scales.
 * Your mapping from data attributes to channels will tell you what scales you need.
* Your scales will inform what axes and legends you need.
* Determine if you need additional data transformation to draw more "complex" marks.
 * For lines, areas, stacked areas/bars, pie charts, etc. consult the [d3-shape](https://github.com/d3/d3-shape#areas) API documentation and examples.
* Now you're ready to draw the marks.
 * If you have groups of marks, first create and position your groups, then add marks to the groups.
 * Use joins to create one mark (or group) for each object in your data.
 * Use your scales to set the visual attributes of the marks or groups.
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Data

Datsets for these charts include [NYC 311 Service requests](https://data.cityofnewyork.us/Social-Services/311-Service-Requests-from-2010-to-Present/erm2-nwe9) and [Iris flower measurements](https://archive.ics.uci.edu/ml/datasets/Iris).

First, let's load the Iris dataset from the attached file and use \`d3.autoType\` to automatically convert the appropriate fields to numbers:`
)});
  main.variable(observer("iris")).define("iris", ["d3","FileAttachment"], async function(d3,FileAttachment){return(
d3.csvParse(await FileAttachment("iris@1.csv").text(), d3.autoType)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Next, we'll load the 311 service request data from the Gist URL below. We'll rename the fields and turn the date string into a JavaScript Date object: `
)});
  main.variable(observer("url")).define("url", function(){return(
"https://gist.githubusercontent.com/DanielKerrigan/3c14969a2386ed074f9b17ddc2759b6a/raw/bdf612245d0cbe8940788c9db98f1ad9b4ed44ae/nyc-311-feb-04-2019-reduced.csv"
)});
  main.variable(observer("serviceRequests")).define("serviceRequests", ["d3","url"], function(d3,url){return(
d3.csv(url, request => ({
    date: d3.timeParse('%m/%d/%Y %H:%M:%S %p')(request['Created Date']),
    agency: request['Agency'],
    type: request['Complaint Type'],
    zip: request['Incident Zip'],
    borough: request['Borough'],
}))
)});
  main.variable(observer("scatterplot")).define("scatterplot", ["md"], function(md){return(
md`## Scatterplot

Additional examples: [1](/@d3/scatterplot), [2](/@d3/brushable-scatterplot), [3](/@d3/scatterplot-with-shapes)

See the [SVG and D3 Basics Practice Exercise](/@nyuvis/svg-and-d3-basics-practice-solutions) for more explanation.`
)});
  main.variable(observer("classes")).define("classes", ["iris"], function(iris){return(
Array.from(new Set(iris.map(d => d.class)))
)});
  main.variable(observer("irisColor")).define("irisColor", ["d3","classes"], function(d3,classes){return(
d3.scaleOrdinal()
  .domain(classes)
  .range(d3.schemeCategory10)
)});
  main.variable(observer()).define(["swatches","irisColor"], function(swatches,irisColor){return(
swatches({ color: irisColor })
)});
  main.variable(observer()).define(["d3","iris","irisColor"], function(d3,iris,irisColor)
{
  // set up
  const margin = {top: 50, right: 120, bottom: 50, left: 120};
  const visWidth = 400;
  const visHeight = 400;

  const svg = d3.create('svg')
      .attr('width', visWidth + margin.left + margin.right)
      .attr('height', visHeight + margin.top + margin.bottom);

  const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // add title  
  g.append("text")
    .attr("x", visWidth / 2)
    .attr("y", -margin.top + 5)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .attr("font-family", "sans-serif")
    .attr("font-size", "16px")
    .text("sepal length vs. sepal width");

  // create scales

  const x = d3.scaleLinear()
      .domain(d3.extent(iris, d => d["sepal-length"])).nice()
      .range([0, visWidth]);

  const y = d3.scaleLinear()
      .domain(d3.extent(iris, d => d["sepal-width"])).nice()
      .range([visHeight, 0]);

  // create and add axes

  const xAxis = d3.axisBottom(x);

  g.append("g")
      // move to bottom of chart
      .attr("transform", `translate(0, ${visHeight})`)
      // add axis
      .call(xAxis)
      // remove baseline from axis
      .call(g => g.select(".domain").remove())
      // add grid lines
      // refernces https://observablehq.com/@d3/connected-scatterplot
      .call(g => g.selectAll('.tick line')
        .clone()
          .attr('stroke', '#d3d3d3')
          .attr('y1', -visHeight)
          .attr('y2', 0))
    // add title
    .append("text")
      .attr("x", visWidth / 2)
      .attr("y", 40)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .text("sepal length (cm)");

  const yAxis = d3.axisLeft(y);

  g.append("g")
      // add axis
      .call(yAxis)
      // remove baseline from axis
      .call(g => g.select(".domain").remove())
      // add grid lines
      // refernces https://observablehq.com/@d3/connected-scatterplot
      .call(g => g.selectAll('.tick line')
        .clone()
          .attr('stroke', '#d3d3d3')
          .attr('x1', 0)
          .attr('x2', visWidth))
    // add title
    .append("text")
      .attr("x", -40)
      .attr("y", visHeight / 2)
      .attr("fill", "black")
      .attr("dominant-baseline", "middle")
      .text("sepal width (cm)");

  // draw points

  g.append("g")
    .selectAll("circle")
    .data(iris)
    .join("circle")
      .attr("cx", d => x(d["sepal-length"]))
      .attr("cy", d => y(d["sepal-width"]))
      .attr("fill", d => irisColor(d.class))
      .attr("r", 3);

  return svg.node();
}
);
  main.variable(observer("bar_chart")).define("bar_chart", ["md"], function(md){return(
md`## Bar chart

Additional examples: [1](/@d3/bar-chart), [2](/@d3/horizontal-bar-chart), [3](/@d3/sortable-bar-chart)

See the [Bar Chart Walk-through](/@nyuvis/bar-chart-walk-through) for more details about how to make a bar chart.

For data transformation, we'll get the top 20 request types and their counts:`
)});
  main.variable(observer("topRequestTypes")).define("topRequestTypes", ["d3","serviceRequests"], function(d3,serviceRequests){return(
d3.rollups(
  serviceRequests,
  // get the number of requests in the group
  requestsForType => requestsForType.length,
  // group by request type
  d => d.type
)
  // turn the key-value pairs into objects
  .map(([type, count]) => ({type, count}))
  // sort by count
  .sort((a, b) => d3.descending(a.count, b.count))
  // take the first 20
  .slice(0, 20)
)});
  main.variable(observer()).define(["width","d3","topRequestTypes"], function(width,d3,topRequestTypes)
{
  const margin = {top: 30, right: 20, bottom: 40, left: 180};
  
  /* width is a part of the Observable standard library.
     it contains the width of the page and is updated
     when you resize the page. */
  const visWidth = width - margin.left - margin.right;
  const visHeight = 600 - margin.top - margin.bottom;

  const svg = d3.create('svg')
      .attr('width', visWidth + margin.left + margin.right)
      .attr('height', visHeight + margin.top + margin.bottom);

  const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // add title
  
  g.append("text")
    .attr("x", visWidth / 2)
    .attr("y", -margin.top + 5)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .attr("font-family", "sans-serif")
    .attr("font-size", "16px")
    .text("Top 20 NYC 311 Service Request Types for February 4th, 2019");
  
  // create scales
  
  const x = d3.scaleLinear()
      .domain([0, d3.max(topRequestTypes, d => d.count)]).nice()
      .range([0, visWidth]);
  
  const y = d3.scaleBand()
      .domain(topRequestTypes.map(d => d.type))
      .range([0, visHeight])
      .padding(0.2);
  
  // create and add axes
  
  const xAxis = d3.axisBottom(x);
  
  g.append("g")
      .attr("transform", `translate(0, ${visHeight})`)
      .call(xAxis)
      .call(g => g.select(".domain").remove())
    .append("text")
      .attr("x", visWidth / 2)
      .attr("y", 40)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .text("Count");
  
  const yAxis = d3.axisLeft(y);
  
  g.append("g")
      .call(yAxis)
      // remove baseline from the axis
      .call(g => g.select(".domain").remove());
  
  // draw bars
  
  g.append("g")
    .selectAll("rect")
    .data(topRequestTypes)
    .join("rect")
      .attr("x", d => 0)
      .attr("y", d => y(d.type))
      .attr("width", d => x(d.count))
      .attr("height", d => y.bandwidth())
      .attr("fill", "steelblue");
  
  return svg.node();
}
);
  main.variable(observer("line_chart")).define("line_chart", ["md"], function(md){return(
md`## Line chart

Additional examples: [1](/@d3/line-chart), [2](/@d3/area-chart)

See the [Line and Area Charts](/@nyuvis/lines-and-maps) notebook for more info about line charts.

For data transformation, we'll get the number of requests for each hour of the day:`
)});
  main.variable(observer("numRequestsByHour")).define("numRequestsByHour", ["d3","serviceRequests"], function(d3,serviceRequests){return(
d3.rollups(
  serviceRequests,
  // get the number of requests in the group
  requestsForHour => requestsForHour.length,
  /*
  group requests by the hour

  d3.timeHour will floor the date to the hour.
  For example, 2019-02-04T05:41 becomes 2019-02-04T05:00.
  */
  d => d3.timeHour(d.date)
).map(([time, count]) => ({time, count}))
)});
  main.variable(observer()).define(["width","d3","numRequestsByHour"], function(width,d3,numRequestsByHour)
{
  const margin = {top: 40, right: 20, bottom: 20, left: 40};

  const visWidth = width - margin.left - margin.right;
  const visHeight = 600 - margin.top - margin.bottom;

  const svg = d3.create('svg')
      .attr('width', visWidth + margin.left + margin.right)
      .attr('height', visHeight + margin.top + margin.bottom);

  const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // add title

  g.append("text")
    .attr("x", visWidth / 2)
    .attr("y", -margin.top + 5)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .attr("font-family", "sans-serif")
    .attr("font-size", "16px")
    .text("Count of NYC 311 Service Requests per Hour on February 4th, 2019");
  
  // create scales
  
  const x = d3.scaleTime()
      .domain(d3.extent(numRequestsByHour, d => d.time))
      .range([0, visWidth]);
  
  const y = d3.scaleLinear()
      .domain([0, d3.max(numRequestsByHour, d => d.count)]).nice()
      .range([visHeight, 0]);
  
  // create and add axes
  
  const xAxis = d3.axisBottom(x)
      .ticks(d3.timeHour.every(2));
  
  g.append("g")
      .attr("transform", `translate(0, ${visHeight})`)
      .call(xAxis);
  
  const yAxis = d3.axisLeft(y);

  g.append("g")
      .call(yAxis)
      .call(g => g.select(".domain").remove());
  
  // draw line
  
  const line = d3.line()
      .x(d => x(d.time))
      .y(d => y(d.count));
  
  g.append("path")
     .datum(numRequestsByHour)
     .attr("d", line)
     .attr("fill", "none")
     .attr("stroke", "steelblue")
     .attr("stroke-width", 2);
  
  return svg.node();
}
);
  main.variable(observer("symbol_map")).define("symbol_map", ["md"], function(md){return(
md`## Symbol Map

Additional example: [1](/@d3/bubble-map?collection=@observablehq/maps)

See the [Maps](/@nyuvis/maps) for more detail about how to create maps.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Since this visualization is a map, we'll load the GeoJSON data for NYC from the attached file. This contains the boundaries of the zip codes in NYC:`
)});
  main.variable(observer("nycGeo")).define("nycGeo", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("nyu-2451-34509-geojson.json").json()
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Also, we'll get a map from zip code to the GeoJSON object for that zip code:`
)});
  main.variable(observer("zipToGeo")).define("zipToGeo", ["d3","nycGeo"], function(d3,nycGeo){return(
d3.index(nycGeo.features, d => d.properties.zcta)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`For data transformation, we'll get the number of requests for each zip code:`
)});
  main.variable(observer("mapZipCodes")).define("mapZipCodes", ["nycGeo"], function(nycGeo){return(
new Set(nycGeo.features.map(d => d.properties.zcta))
)});
  main.variable(observer("zipToNumRequests")).define("zipToNumRequests", ["d3","serviceRequests","mapZipCodes"], function(d3,serviceRequests,mapZipCodes){return(
d3.rollup(
  // only include zip codes that we have geographical information for
  serviceRequests.filter(d => mapZipCodes.has(d.zip)), 
  requestsForZip => requestsForZip.length,
  d => d.zip
)
)});
  main.variable(observer("maximumNumberOfRequests")).define("maximumNumberOfRequests", ["d3","zipToNumRequests"], function(d3,zipToNumRequests){return(
d3.max(zipToNumRequests, ([zip, numRequests]) => numRequests)
)});
  main.variable(observer()).define(["d3","maximumNumberOfRequests","nycGeo","lightgray","zipToNumRequests","zipToGeo"], function(d3,maximumNumberOfRequests,nycGeo,lightgray,zipToNumRequests,zipToGeo)
{
  // margin convention
  const margin = {top: 40, right: 0, bottom: 0, left: 40};
  const visWidth = 600 - margin.left - margin.right;
  const visHeight = 600 - margin.top - margin.bottom;

  const svg = d3.create('svg')
      .attr('width', visWidth + margin.left + margin.right)
      .attr('height', visHeight + margin.top + margin.bottom);

  const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  // add title
  
  g.append("text")
    .attr("x", visWidth / 2)
    .attr("y", -margin.top + 5)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .attr("font-family", "sans-serif")
    .attr("font-size", "16px")
    .text("Number of 311 service requests on February 4th, 2019");
  
  // create scale

  const maxRadius = 10;
  // we want to map number of requests to the area of the circle,
  // so we use scaleSqrt since the area of a circle is pi * (r^2)
  const radius = d3.scaleSqrt()
      .domain([0, maximumNumberOfRequests])
      .range([0, maxRadius]);
  
  // add legend

  const legend = g.append("g")
    .selectAll("g")
    .data([25, 50, 75, 100, 125])
    .join("g")
      .attr("transform", (d, i) => `translate(0, ${i * 2.5 * maxRadius})`);
  
  legend.append("circle")
    .attr("r", d => radius(d))
    .attr("fill", "steelblue");

  legend.append("text")
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
    .attr("dominant-baseline", "middle")
    .attr("x", maxRadius + 5)
    .text(d => d);
  
  // draw map
  
  const projection =  d3.geoAlbers()
      .fitSize([visWidth, visHeight], nycGeo);

  const path = d3.geoPath().projection(projection);

  g.append("path")
      .datum(nycGeo)
      .attr("d", path)
      .attr("fill", lightgray)
      .attr("stroke", "white")

  // draw circles

  g.append("g")
    .selectAll("circle")
    .data(zipToNumRequests)
    .join("circle")
      .attr("fill", "steelblue")
      .attr("cx", ([zip, numRequests]) => {
        // get the center of the zip code
        const [x, y] = path.centroid(zipToGeo.get(zip));
        return x;
      })
      .attr("cy", ([zip, numRequests]) => {
        const [x, y] = path.centroid(zipToGeo.get(zip));
        return y;
      })
      .attr("r", ([zip, numRequests]) => radius(numRequests))

  return svg.node();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`Here's another way to create the same visualization without using \`zipToGeo\`:`
)});
  main.variable(observer()).define(["d3","maximumNumberOfRequests","nycGeo","lightgray","zipToNumRequests"], function(d3,maximumNumberOfRequests,nycGeo,lightgray,zipToNumRequests)
{
  // margin convention
  const margin = {top: 40, right: 0, bottom: 0, left: 40};
  const visWidth = 600 - margin.left - margin.right;
  const visHeight = 600 - margin.top - margin.bottom;

  const svg = d3.create('svg')
      .attr('width', visWidth + margin.left + margin.right)
      .attr('height', visHeight + margin.top + margin.bottom);

  const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  // add title
  
  g.append("text")
    .attr("x", visWidth / 2)
    .attr("y", -margin.top + 5)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .attr("font-family", "sans-serif")
    .attr("font-size", "16px")
    .text("Number of 311 service requests on February 4th, 2019");
  
  // create scale

  const maxRadius = 10;
  // we want to map number of requests to the area of the circle,
  // so we use scaleSqrt since the area of a circle is pi * (r^2)
  const radius = d3.scaleSqrt()
      .domain([0, maximumNumberOfRequests])
      .range([0, maxRadius]);
  
  // add legend

  const legend = g.append("g")
    .selectAll("g")
    .data([25, 50, 75, 100, 125])
    .join("g")
      .attr("transform", (d, i) => `translate(0, ${i * 2.5 * maxRadius})`);
  
  legend.append("circle")
    .attr("r", d => radius(d))
    .attr("fill", "steelblue");

  legend.append("text")
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
    .attr("dominant-baseline", "middle")
    .attr("x", maxRadius + 5)
    .text(d => d);
  
  // draw map
  
  const projection =  d3.geoAlbers()
      .fitSize([visWidth, visHeight], nycGeo);

  const path = d3.geoPath().projection(projection);

  g.selectAll(".border")
    .data(nycGeo.features)
    .join("path")
      .attr("class", "border")
      .attr("d", path)
      .attr("fill", lightgray)
      .attr("stroke", "white");

  // draw circles

  g.append("g")
    .selectAll("circle")
    .data(nycGeo.features)
    .join("circle")
      .attr("fill", "steelblue")
      .attr("transform", d => `translate(${path.centroid(d)})`)
      .attr("r", d => radius(zipToNumRequests.get(d.properties.zcta)))

  return svg.node();
}
);
  main.variable(observer("matrix")).define("matrix", ["md"], function(md){return(
md`## Matrix

Additional examples: [1](/@d3/calendar-view), [2](/@mbostock/the-impact-of-vaccines), [3](/@mbostock/electric-usage-2019)

See the [SVG and D3 Basics Practice Exercise](/@nyuvis/svg-and-d3-basics-practice-solutions) for more explanation.

For data transformation, first we'll get the names of the boroughs and agencies, sorted by number of request. We will use this info so that the categories for each axis are sorted in order from most to fewest requests.`
)});
  main.variable(observer("boroughsSortedByNumRequests")).define("boroughsSortedByNumRequests", ["d3","serviceRequests"], function(d3,serviceRequests){return(
d3.groupSort(
  serviceRequests.filter(d => d.borough !== "Unspecified"),
  group => -group.length,
  d => d.borough
)
)});
  main.variable(observer("agenciesSortedByNumRequests")).define("agenciesSortedByNumRequests", ["d3","serviceRequests"], function(d3,serviceRequests){return(
d3.groupSort(
  serviceRequests.filter(d => d.borough !== "Unspecified"),
  group => -group.length,
  d => d.agency
)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Next, for each agency, we'll get the number of requests per borough:`
)});
  main.variable(observer("agencyBoroughCounts")).define("agencyBoroughCounts", ["d3","serviceRequests"], function(d3,serviceRequests){return(
d3.flatRollup(
  serviceRequests.filter(d => d.borough !== "Unspecified"),
  requests => requests.length,
  d => d.agency,
  d => d.borough
).map(([agency, borough, count]) => ({ agency, borough, count }))
)});
  main.variable(observer("maxCount")).define("maxCount", ["d3","agencyBoroughCounts"], function(d3,agencyBoroughCounts){return(
d3.max(agencyBoroughCounts, d => d.count)
)});
  main.variable(observer()).define(["width","agenciesSortedByNumRequests","boroughsSortedByNumRequests","d3","maxCount","agencyBoroughCounts"], function(width,agenciesSortedByNumRequests,boroughsSortedByNumRequests,d3,maxCount,agencyBoroughCounts)
{
  // margin convention
  const margin = {top: 30, right: 100, bottom: 50, left: 120};
  const cellSize = (width - margin.left - margin.right) / agenciesSortedByNumRequests.length;
  const visWidth = agenciesSortedByNumRequests.length * cellSize;
  const visHeight = boroughsSortedByNumRequests.length * cellSize;

  const svg = d3.create('svg')
      .attr('width', visWidth + margin.left + margin.right)
      .attr('height', visHeight + margin.top + margin.bottom);

  const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  // add title

  g.append("text")
    .attr("x", visWidth / 2)
    .attr("y", -margin.top + 5)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .attr("font-family", "sans-serif")
    .attr("font-size", "16px")
    .text("Number of Requests by Agency and Borough");
  
  // create scales

  const y = d3.scalePoint()
      .domain(boroughsSortedByNumRequests)
      .range([0, visHeight])
      .padding(0.5);
  
  const x = d3.scalePoint()
      .domain(agenciesSortedByNumRequests)
      .range([0, visWidth])
      .padding(0.5);
  
  const maxRadius = Math.min(y.step(), x.step()) / 2 - 2;
  const radius = d3.scaleSqrt()
      .domain([0, maxCount])
      .range([0, maxRadius]);
  
  // add legend
  
  const legend = g.append("g")
      .attr("transform", `translate(${visWidth + margin.right - 50}, 0)`)
    .selectAll("g")
    .data([100, 300, 500, 700])
    .join("g")
      .attr("transform", (d, i) => `translate(0, ${i * 2.5 * maxRadius})`);
  
  legend.append("circle")
    .attr("r", d => radius(d))
    .attr("fill", "steelblue");

  legend.append("text")
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
    .attr("dominant-baseline", "middle")
    .attr("x", maxRadius + 5)
    .text(d => d);
  
  // create and add axes
  
  const xAxis = d3.axisBottom(x);
  
  g.append("g")
      .attr("transform", `translate(0, ${visHeight})`)
      .call(xAxis)
      // remove baseline from the axis
      .call(g => g.select(".domain").remove())
    // add axis label
    .append("text")
      .attr("x", visWidth / 2)
      .attr("y", 40)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .text("Agency");
  
  const yAxis = d3.axisLeft(y);
  
  g.append("g")
      .call(yAxis)
      // remove baseline from axis
      .call(g => g.select(".domain").remove())
    // add axis label
    .append("text")
      .attr("x", -margin.left)
      .attr("y", visHeight / 2)
      .attr("fill", "black")
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "start")
      .text("Borough");
  
  // draw points
  
  const cols = g.append("g")
    .selectAll("circle")
    .data(agencyBoroughCounts)
    .join("circle")
      .attr("cx", d => x(d.agency))
      .attr("cy", d => y(d.borough))
      .attr("r", d => radius(d.count))
      .attr("fill", "steelblue");
  
  return svg.node();
}
);
  main.variable(observer("appendix")).define("appendix", ["md"], function(md){return(
md`---
## Appendix`
)});
  const child1 = runtime.module(define1);
  main.import("swatches", child1);
  main.variable(observer("lightgray")).define("lightgray", function(){return(
"#dcdcdc"
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require('d3@7')
)});
  return main;
}
