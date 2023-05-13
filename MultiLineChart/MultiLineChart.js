import define1 from "./7a9e12f9fb3d8e06@498.js";

function _1(md){return(
md`# Data Challenge Visualisation: Multi-Line Chart`
)}

function _2(htl){return(
htl.html`<script type="module">

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const div = d3.selectAll("div");

</script>`
)}

function _3(md){return(
md`Compare "popularity" of different departments per term by combining enrollments per term for each department. Hover over different lines to see course popularity path.`
)}

function _data(FileAttachment){return(
FileAttachment("Dartmouth - Courses.txt").csv({typed: true})
)}

function _voronoi(Inputs){return(
Inputs.toggle({label: "Show voronoi"})
)}

function _chart(LineChart,enrollmentData,d3,width,voronoi){return(
LineChart(enrollmentData, {
  x: d => d.term,
  y: d => d.enrollments,
  z: d => d.department,
  zDomain: d3.groupSort(enrollmentData, D => d3.sum(D, d => -d.enrollments), d => d.department).slice(0, 5), // top 5 
  yLabel: "Total Enrollment",
  width,
  height: 500,
  color: "steelblue",
  voronoi // if true, show Voronoi overlay
})
)}

function _tempData(data){return(
data.filter(currentElement => currentElement.Enrollments != null && currentElement.Department != null && currentElement['Term Number'] != null)
)}

function _enrollmentPerTerm(d3,tempData){return(
d3.rollup(tempData, g => d3.sum(g, d => d.Enrollments), d => d.Department, d => d['Term Number'])
)}

function _depts(enrollmentPerTerm){return(
Array.from(enrollmentPerTerm.keys())
)}

function _enrollmentDepts(){return(
[]
)}

function _11(depts,enrollmentPerTerm,enrollmentDepts){return(
depts.forEach(element => {enrollmentPerTerm.get(element).forEach(key => {enrollmentDepts.push(element)})})
)}

function _temp(){return(
[]
)}

function _enrollmentTerms(){return(
[]
)}

function _14(enrollmentPerTerm,temp){return(
enrollmentPerTerm.forEach(map => {temp.push(Array.from(map.keys()))})
)}

function _15(temp,enrollmentTerms){return(
temp.forEach(array => {array.forEach(element => {enrollmentTerms.push(element)})})
)}

function _enrollments(){return(
[]
)}

function _17(enrollmentPerTerm,enrollments){return(
enrollmentPerTerm.forEach(value => {value.forEach(value => {enrollments.push(value)})})
)}

function _enrollmentArray(enrollmentDepts,enrollmentTerms,enrollments){return(
enrollmentDepts.map((item,index) => {return [item,enrollmentTerms[index] ,enrollments[index]]})
)}

function _enrollmentData(enrollmentArray){return(
enrollmentArray.map(d => ({department: d[0], term: d[1], enrollments: d[2]}))
)}

function _focus(Generators,chart){return(
Generators.input(chart)
)}

function _LineChart(d3){return(
function LineChart(data, {
  x = ([x]) => x, // given d in data, returns the (temporal) x-value
  y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
  z = () => 1, // given d in data, returns the (categorical) z-value
  title, // given d in data, returns the title text
  defined, // for gaps in data
  curve = d3.curveLinear, // method of interpolation between points
  marginTop = 20, // top margin, in pixels
  marginRight = 30, // right margin, in pixels
  marginBottom = 30, // bottom margin, in pixels
  marginLeft = 40, // left margin, in pixels
  width = 640, // outer width, in pixels
  height = 400, // outer height, in pixels
  xType = d3.scaleUtc, // type of x-scale
  xDomain, // [xmin, xmax]
  xRange = [marginLeft, width - marginRight], // [left, right]
  yType = d3.scaleLinear, // type of y-scale
  yDomain, // [ymin, ymax]
  yRange = [height - marginBottom, marginTop], // [bottom, top]
  yFormat, // a format specifier string for the y-axis
  yLabel, // a label for the y-axis
  zDomain, // array of z-values
  color = "currentColor", // stroke color of line, as a constant or a function of *z*
  strokeLinecap, // stroke line cap of line
  strokeLinejoin, // stroke line join of line
  strokeWidth = 1.5, // stroke width of line
  strokeOpacity, // stroke opacity of line
  mixBlendMode = "multiply", // blend mode of lines
  voronoi // show a Voronoi overlay? (for debugging)
} = {}) {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const Z = d3.map(data, z);
  const O = d3.map(data, d => d);
  if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
  const D = d3.map(data, defined);

  // Compute default domains, and unique the z-domain.
  if (xDomain === undefined) xDomain = d3.extent(X);
  if (yDomain === undefined) yDomain = [0, d3.max(Y, d => typeof d === "string" ? +d : d)];
  if (zDomain === undefined) zDomain = Z;
  zDomain = new d3.InternSet(zDomain);

  // Omit any data not present in the z-domain.
  const I = d3.range(X.length).filter(i => zDomain.has(Z[i]));

  // Construct scales and axes.
  const xScale = xType(xDomain, xRange);
  const yScale = yType(yDomain, yRange);
  let tickLabels = ['Summer','Fall','Winter', 'Spring'];
  const xAxis = d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0).tickFormat((d,i) => tickLabels[i]);
  const yAxis = d3.axisLeft(yScale).ticks(height / 60, yFormat);

  // Compute titles.
  const T = title === undefined ? Z : title === null ? null : d3.map(data, title);

  // Construct a line generator.
  const line = d3.line()
      .defined(i => D[i])
      .curve(curve)
      .x(i => xScale(X[i]))
      .y(i => yScale(Y[i]));

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
      .style("-webkit-tap-highlight-color", "transparent")
      .on("pointerenter", pointerentered)
      .on("pointermove", pointermoved)
      .on("pointerleave", pointerleft)
      .on("touchstart", event => event.preventDefault());

  // An optional Voronoi display (for fun).
  if (voronoi) svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("d", d3.Delaunay
        .from(I, i => xScale(X[i]), i => yScale(Y[i]))
        .voronoi([0, 0, width, height])
        .render());

  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis);

  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(yAxis)
      .call(g => g.select(".domain").remove())
      .call(voronoi ? () => {} : g => g.selectAll(".tick line").clone()
          .attr("x2", width - marginLeft - marginRight)
          .attr("stroke-opacity", 0.1))
      .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(yLabel));

  const path = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", typeof color === "string" ? color : null)
      .attr("stroke-linecap", strokeLinecap)
      .attr("stroke-linejoin", strokeLinejoin)
      .attr("stroke-width", strokeWidth)
      .attr("stroke-opacity", strokeOpacity)
    .selectAll("path")
    .data(d3.group(I, i => Z[i]))
    .join("path")
      .style("mix-blend-mode", mixBlendMode)
      .attr("stroke", typeof color === "function" ? ([z]) => color(z) : null)
      .attr("d", ([, I]) => line(I));

  const dot = svg.append("g")
      .attr("display", "none");

  dot.append("circle")
      .attr("r", 2.5);

  dot.append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "middle")
      .attr("y", -8);

  function pointermoved(event) {
    const [xm, ym] = d3.pointer(event);
    const i = d3.least(I, i => Math.hypot(xScale(X[i]) - xm, yScale(Y[i]) - ym)); // closest point
    path.style("stroke", ([z]) => Z[i] === z ? null : "#ddd").filter(([z]) => Z[i] === z).raise();
    dot.attr("transform", `translate(${xScale(X[i])},${yScale(Y[i])})`);
    if (T) dot.select("text").text(T[i]);
    svg.property("value", O[i]).dispatch("input", {bubbles: true});
  }

  function pointerentered() {
    path.style("mix-blend-mode", null).style("stroke", "#ddd");
    dot.attr("display", null);
  }

  function pointerleft() {
    path.style("mix-blend-mode", mixBlendMode).style("stroke", null);
    dot.attr("display", "none");
    svg.node().value = null;
    svg.dispatch("input", {bubbles: true});
  }

  return Object.assign(svg.node(), {value: null});
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
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("viewof voronoi")).define("viewof voronoi", ["Inputs"], _voronoi);
  main.variable(observer("voronoi")).define("voronoi", ["Generators", "viewof voronoi"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["LineChart","enrollmentData","d3","width","voronoi"], _chart);
  main.variable(observer("tempData")).define("tempData", ["data"], _tempData);
  main.variable(observer("enrollmentPerTerm")).define("enrollmentPerTerm", ["d3","tempData"], _enrollmentPerTerm);
  main.variable(observer("depts")).define("depts", ["enrollmentPerTerm"], _depts);
  main.variable(observer("enrollmentDepts")).define("enrollmentDepts", _enrollmentDepts);
  main.variable(observer()).define(["depts","enrollmentPerTerm","enrollmentDepts"], _11);
  main.variable(observer("temp")).define("temp", _temp);
  main.variable(observer("enrollmentTerms")).define("enrollmentTerms", _enrollmentTerms);
  main.variable(observer()).define(["enrollmentPerTerm","temp"], _14);
  main.variable(observer()).define(["temp","enrollmentTerms"], _15);
  main.variable(observer("enrollments")).define("enrollments", _enrollments);
  main.variable(observer()).define(["enrollmentPerTerm","enrollments"], _17);
  main.variable(observer("enrollmentArray")).define("enrollmentArray", ["enrollmentDepts","enrollmentTerms","enrollments"], _enrollmentArray);
  main.variable(observer("enrollmentData")).define("enrollmentData", ["enrollmentArray"], _enrollmentData);
  main.variable(observer("focus")).define("focus", ["Generators","chart"], _focus);
  main.variable(observer("LineChart")).define("LineChart", ["d3"], _LineChart);
  const child1 = runtime.module(define1);
  main.import("howto", child1);
  main.import("altplot", child1);
  return main;
}
