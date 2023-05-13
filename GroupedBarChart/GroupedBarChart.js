import define1 from "./a33468b95d0b15b0@808.js";
import define2 from "./7a9e12f9fb3d8e06@498.js";

function _1(md){return(
md`# Data Challenge Visualization: Grouped Bar Chart`
)}

function _2(htl){return(
htl.html`<script type="module">

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const div = d3.selectAll("div");

</script>`
)}

function _data(FileAttachment){return(
FileAttachment("Dartmouth - Courses.txt").csv({typed: true})
)}

function _4(md){return(
md`Want to see how different department's GPA fared over different terms: combine courses of each department and compare median GPAs of each department over 4 terms`
)}

function _5(md){return(
md`Bar chart of department medians v. departments grouped by terms`
)}

function _key(Legend,chart){return(
Legend(chart.scales.color, {title: "Term"})
)}

function _chart(GroupedBarChart,admptData,d3,width){return(
GroupedBarChart(admptData, {
  x: d => d.department,
  y: d => d.median,
  z: d => d.term,
  xDomain: d3.groupSort(admptData, D => d3.sum(D, d => d.median), d => d.department).slice(0, 10), // top 10 lowest medians
  yLabel: "Median GPA",
  zDomain: admptData.term,
  colors: d3.schemeSpectral[admptData.term],
  width,
  height: 500
})
)}

function _data2(data){return(
data.filter(currentElement => currentElement['Median GPA Points'] != null && currentElement.Department != null && currentElement['Term Number'] != null)
)}

function _coursesByDepartment(d3,data2){return(
d3.group(data2, d => d.Department)
)}

function _10(coursesByDepartment,html,htl){return(
htl.html`html\`<table>
  <thead>
    <tr><th>Department</th><th>Course Number</th></tr>
  </thead>
  <tbody>${Array.from(coursesByDepartment, ([key, values]) => html`
    <tr>
      <td>${key}</td>
      <td>${values.map(d => d['Course Number']).join(", ")}</td>
    </tr>`)}</tbody>
</table>\``
)}

function _avrgDepartmentMedianPerTerm(d3,data2){return(
d3.rollup(data2, g => d3.median(g, d => d['Median GPA Points']), d => d.Department, d => d['Term Number'])
)}

function _depts(avrgDepartmentMedianPerTerm){return(
Array.from(avrgDepartmentMedianPerTerm.keys())
)}

function _admptDepts(){return(
[]
)}

function _14(depts,avrgDepartmentMedianPerTerm,admptDepts){return(
depts.forEach(element => {avrgDepartmentMedianPerTerm.get(element).forEach(key => {admptDepts.push(element)})})
)}

function _temp(){return(
[]
)}

function _admptTerms(){return(
[]
)}

function _17(avrgDepartmentMedianPerTerm,temp){return(
avrgDepartmentMedianPerTerm.forEach(map => {temp.push(Array.from(map.keys()))})
)}

function _18(temp,admptTerms){return(
temp.forEach(array => {array.forEach(element => {admptTerms.push(element)})})
)}

function _admptMed(){return(
[]
)}

function _20(avrgDepartmentMedianPerTerm,admptMed){return(
avrgDepartmentMedianPerTerm.forEach(value => {value.forEach(value => {admptMed.push(value)})})
)}

function _admptArray(admptDepts,admptTerms,admptMed){return(
admptDepts.map((item,index) => {return [item,admptTerms[index] ,admptMed[index]]})
)}

function _admptData(admptArray){return(
admptArray.map(d => ({department: d[0], term: d[1], median: d[2]}))
)}

function _23(admptData){return(
admptData.forEach(obj => {if (obj.term==1) { obj.term = "Winter" } else if (obj.term==2) { obj.term="Spring"} else  if (obj.term==3){obj.term="Summer"} else if (obj.term==4){obj.term="Fall"}})
)}

function _24(md){return(
md`Grouped bar chart`
)}

function _GroupedBarChart(d3){return(
function GroupedBarChart(data, {
  x = (d, i) => i, // given d in data, returns the (ordinal) x-value
  y = d => d, // given d in data, returns the (quantitative) y-value
  z = () => 1, // given d in data, returns the (categorical) z-value
  title, // given d in data, returns the title text
  marginTop = 30, // top margin, in pixels
  marginRight = 0, // right margin, in pixels
  marginBottom = 30, // bottom margin, in pixels
  marginLeft = 40, // left margin, in pixels
  width = 640, // outer width, in pixels
  height = 400, // outer height, in pixels
  xDomain, // array of x-values
  xRange = [marginLeft, width - marginRight], // [xmin, xmax]
  xPadding = 0.1, // amount of x-range to reserve to separate groups
  yType = d3.scaleLinear, // type of y-scale
  yDomain, // [ymin, ymax]
  yRange = [height - marginBottom, marginTop], // [ymin, ymax]
  zDomain, // array of z-values
  zPadding = 0.05, // amount of x-range to reserve to separate bars
  yFormat, // a format specifier string for the y-axis
  yLabel, // a label for the y-axis
  colors = d3.schemeTableau10, // array of colors
} = {}) {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const Z = d3.map(data, z);

  // Compute default domains, and unique the x- and z-domains.
  if (xDomain === undefined) xDomain = X;
  if (yDomain === undefined) yDomain = [0, d3.max(Y)];
  if (zDomain === undefined) zDomain = Z;
  xDomain = new d3.InternSet(xDomain);
  zDomain = new d3.InternSet(zDomain);

  // Omit any data not present in both the x- and z-domain.
  const I = d3.range(X.length).filter(i => xDomain.has(X[i]) && zDomain.has(Z[i]));

  // Construct scales, axes, and formats.
  const xScale = d3.scaleBand(xDomain, xRange).paddingInner(xPadding);
  const xzScale = d3.scaleBand(zDomain, [0, xScale.bandwidth()]).padding(zPadding);
  const yScale = yType(yDomain, yRange);
  const zScale = d3.scaleOrdinal(zDomain, colors);
  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).ticks(height / 60, yFormat);

  // Compute titles.
  if (title === undefined) {
    const formatValue = yScale.tickFormat(100, yFormat);
    title = i => `${X[i]}\n${Z[i]}\n${formatValue(Y[i])}`;
  } else {
    const O = d3.map(data, d => d);
    const T = title;
    title = i => T(O[i], i, data);
  }

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(yAxis)
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
          .attr("x2", width - marginLeft - marginRight)
          .attr("stroke-opacity", 0.1))
      .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(yLabel));

  const bar = svg.append("g")
    .selectAll("rect")
    .data(I)
    .join("rect")
      .attr("x", i => xScale(X[i]) + xzScale(Z[i]))
      .attr("y", i => yScale(Y[i]))
      .attr("width", xzScale.bandwidth())
      .attr("height", i => yScale(0) - yScale(Y[i]))
      .attr("fill", i => zScale(Z[i]));

  if (title) bar.append("title")
      .text(title);

  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis);

  return Object.assign(svg.node(), {scales: {color: zScale}});
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["Dartmouth - Courses.txt", {url: new URL("./files/2eac04e704bffad85dd9a626d3d9c73ee206663f4dbed70e5352cf86103f51f500414ae33a2dce5182ee4a2e052a70cd6ad800b40ab961443efeefadbabc0658.txt", import.meta.url), mimeType: "text/plain", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["htl"], _2);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("key")).define("key", ["Legend","chart"], _key);
  main.variable(observer("chart")).define("chart", ["GroupedBarChart","admptData","d3","width"], _chart);
  main.variable(observer("data2")).define("data2", ["data"], _data2);
  main.variable(observer("coursesByDepartment")).define("coursesByDepartment", ["d3","data2"], _coursesByDepartment);
  main.variable(observer()).define(["coursesByDepartment","html","htl"], _10);
  main.variable(observer("avrgDepartmentMedianPerTerm")).define("avrgDepartmentMedianPerTerm", ["d3","data2"], _avrgDepartmentMedianPerTerm);
  main.variable(observer("depts")).define("depts", ["avrgDepartmentMedianPerTerm"], _depts);
  main.variable(observer("admptDepts")).define("admptDepts", _admptDepts);
  main.variable(observer()).define(["depts","avrgDepartmentMedianPerTerm","admptDepts"], _14);
  main.variable(observer("temp")).define("temp", _temp);
  main.variable(observer("admptTerms")).define("admptTerms", _admptTerms);
  main.variable(observer()).define(["avrgDepartmentMedianPerTerm","temp"], _17);
  main.variable(observer()).define(["temp","admptTerms"], _18);
  main.variable(observer("admptMed")).define("admptMed", _admptMed);
  main.variable(observer()).define(["avrgDepartmentMedianPerTerm","admptMed"], _20);
  main.variable(observer("admptArray")).define("admptArray", ["admptDepts","admptTerms","admptMed"], _admptArray);
  main.variable(observer("admptData")).define("admptData", ["admptArray"], _admptData);
  main.variable(observer()).define(["admptData"], _23);
  main.variable(observer()).define(["md"], _24);
  main.variable(observer("GroupedBarChart")).define("GroupedBarChart", ["d3"], _GroupedBarChart);
  const child1 = runtime.module(define1);
  main.import("Legend", child1);
  main.import("Swatches", child1);
  const child2 = runtime.module(define2);
  main.import("howto", child2);
  main.import("altplot", child2);
  return main;
}
