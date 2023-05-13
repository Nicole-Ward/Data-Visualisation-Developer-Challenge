function _1(md){return(
md`# Data Challenge Visualization: Bar Chart Race`
)}

function _2(md){return(
md`Demonstrate how different departments' average medians change per term using a bar chart race`
)}

function _replay(html){return(
html`<button>Replay`
)}

function _4(htl){return(
htl.html`<script type="module">

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const div = d3.selectAll("div");

</script>`
)}

async function* _chart(replay,d3,width,height,bars,axis,labels,ticker,keyframes,duration,x,invalidation)
{
  replay;

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  const updateBars = bars(svg);
  const updateAxis = axis(svg);
  const updateLabels = labels(svg);
  const updateTicker = ticker(svg);

  yield svg.node();

  for (const keyframe of keyframes) {
    const transition = svg.transition()
        .duration(duration)
        .ease(d3.easeLinear);

    // Extract the top bar’s value.
    x.domain([0, keyframe[1][0].median]);

    updateAxis(keyframe, transition);
    updateBars(keyframe, transition);
    updateLabels(keyframe, transition);
    updateTicker(keyframe, transition);

    invalidation.then(() => svg.interrupt());
    await transition.end();
  }
}


function _temp_data(FileAttachment){return(
FileAttachment("Dartmouth - Courses.txt").csv({typed: true})
)}

function _data(temp_data){return(
temp_data.filter(currentElement => currentElement['Median GPA Points'] != null && currentElement.Department != null && currentElement['Term Number'] != null && currentElement['Course Number'] != null && currentElement.Year != null)
)}

function _parseTime(d3){return(
d3.timeParse("%m-%d-%Y")
)}

function _9(data,parseTime){return(
data.forEach(element => {element.Year = (parseTime("0" + String(element['Term Number'] + "-01-" + String(element.Year))))})
)}

function _10(data){return(
data.forEach(element => {element.Department += ": " + element['Course Number']})
)}

function _dataCopy(data){return(
data
)}

function _join(){return(
function join(lookupTable, mainTable, lookupKey, mainKey, select) {
    var l = lookupTable.length,
        m = mainTable.length,
        lookupIndex = [],
        output = [];
    for (var i = 0; i < l; i++) { // loop through l items
        var row = lookupTable[i];
        lookupIndex[row[lookupKey]] = row; // create an index for lookup table
    }
    for (var j = 0; j < m; j++) { // loop through m items
        var y = mainTable[j];
        var x = lookupIndex[y[mainKey]]; // get corresponding row from lookupTable
        output.push(select(y, x)); // select only the columns you need
    }
    return output;
}
)}

function _termMedians(join,data,dataCopy){return(
join(data, dataCopy, "date", "Year", function(data, dataCopy) {
    return {
        course: data.Department,
        median: data['Median GPA Points'],
        date: data.Year
    };
})
)}

function _duration(){return(
400
)}

function _n(){return(
12
)}

function _courses(termMedians){return(
new Set(termMedians.map(d => d.course))
)}

function _datevalues(d3,termMedians){return(
Array.from(d3.rollup(termMedians, ([d]) => d.median, d => +d.date, d => d.course))
  .map(([date, data]) => [new Date(date), data])
  .sort(([a], [b]) => d3.ascending(a, b))
)}

function _rank(courses,d3,n){return(
function rank(median) {
  const data = Array.from(courses, course => ({course, median: median(course)}));
  data.sort((a, b) => d3.descending(a.median, b.median));
  for (let i = 0; i < data.length; ++i) data[i].rank = Math.min(n, i);
  return data;
}
)}

function _k(){return(
10
)}

function _keyframes(d3,datevalues,k,rank)
{
  const keyframes = [];
  let ka, a, kb, b;
  for ([[ka, a], [kb, b]] of d3.pairs(datevalues)) {
    for (let i = 0; i < k; ++i) {
      const t = i / k;
      keyframes.push([
        new Date(ka * (1 - t) + kb * t),
        rank(course => (a.get(course) || 0) * (1 - t) + (b.get(course) || 0) * t)
      ]);
    }
  }
  keyframes.push([new Date(kb), rank(course => b.get(course) || 0)]);
  return keyframes;
}


function _nameframes(d3,keyframes){return(
d3.groups(keyframes.flatMap(([, data]) => data), d => d.course)
)}

function _prev(nameframes,d3){return(
new Map(nameframes.flatMap(([, data]) => d3.pairs(data, (a, b) => [b, a])))
)}

function _next(nameframes,d3){return(
new Map(nameframes.flatMap(([, data]) => d3.pairs(data)))
)}

function _bars(n,color,y,x,prev,next){return(
function bars(svg) {
  let bar = svg.append("g")
      .attr("fill-opacity", 0.6)
    .selectAll("rect");

  return ([date, data], transition) => bar = bar
    .data(data.slice(0, n), d => d.course)
    .join(
      enter => enter.append("rect")
        .attr("fill", color)
        .attr("height", y.bandwidth())
        .attr("x", x(0))
        .attr("y", d => y((prev.get(d) || d).rank))
        .attr("width", d => x((prev.get(d) || d).median) - x(0)),
      update => update,
      exit => exit.transition(transition).remove()
        .attr("y", d => y((next.get(d) || d).rank))
        .attr("width", d => x((next.get(d) || d).median) - x(0))
    )
    .call(bar => bar.transition(transition)
      .attr("y", d => y(d.rank))
      .attr("width", d => x(d.median) - x(0)));
}
)}

function _labels(n,x,prev,y,next,textTween){return(
function labels(svg) {
  let label = svg.append("g")
      .style("font", "bold 12px var(--sans-serif)")
      .style("font-variant-numeric", "tabular-nums")
      .attr("text-anchor", "end")
    .selectAll("text");

  return ([date, data], transition) => label = label
    .data(data.slice(0, n), d => d.course)
    .join(
      enter => enter.append("text")
        .attr("transform", d => `translate(${x((prev.get(d) || d).median)},${y((prev.get(d) || d).rank)})`)
        .attr("y", y.bandwidth() / 2)
        .attr("x", -6)
        .attr("dy", "-0.25em")
        .text(d => d.course)
        .call(text => text.append("tspan")
          .attr("fill-opacity", 0.7)
          .attr("font-weight", "normal")
          .attr("x", -6)
          .attr("dy", "1.15em")),
      update => update,
      exit => exit.transition(transition).remove()
        .attr("transform", d => `translate(${x((next.get(d) || d).median)},${y((next.get(d) || d).rank)})`)
        .call(g => g.select("tspan").tween("text", d => textTween(d.median, (next.get(d) || d).median)))
    )
    .call(bar => bar.transition(transition)
      .attr("transform", d => `translate(${x(d.median)},${y(d.rank)})`)
      .call(g => g.select("tspan").tween("text", d => textTween((prev.get(d) || d).median, d.median))));
}
)}

function _textTween(d3,formatNumber){return(
function textTween(a, b) {
  const i = d3.interpolateNumber(a, b);
  return function(t) {
    this.textContent = formatNumber(i(t));
  };
}
)}

function _formatNumber(d3){return(
d3.format(",d")
)}

function _tickFormat(){return(
undefined
)}

function _axis(margin,d3,x,width,tickFormat,barSize,n,y){return(
function axis(svg) {
  const g = svg.append("g")
      .attr("transform", `translate(0,${margin.top})`);

  const axis = d3.axisTop(x)
      .ticks(width / 160, tickFormat)
      .tickSizeOuter(0)
      .tickSizeInner(-barSize * (n + y.padding()));

  return (_, transition) => {
    g.transition(transition).call(axis);
    g.select(".tick:first-of-type text").remove();
    g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "white");
    g.select(".domain").remove();
  };
}
)}

function _ticker(barSize,width,margin,n,formatDate,keyframes){return(
function ticker(svg) {
  const now = svg.append("text")
      .style("font", `bold ${barSize}px var(--sans-serif)`)
      .style("font-variant-numeric", "tabular-nums")
      .attr("text-anchor", "end")
      .attr("x", width - 6)
      .attr("y", margin.top + barSize * (n - 0.45))
      .attr("dy", "0.32em")
      .text(formatDate(keyframes[0][0]));

  return ([date], transition) => {
    transition.end().then(() => now.text(formatDate(date)));
  };
}
)}

function _formatDate(d3){return(
d3.utcFormat("%Y")
)}

function _color(d3,data)
{
  const scale = d3.scaleOrdinal(d3.schemeTableau10);
  if (data.some(d => d.category !== undefined)) {
    const categoryByName = new Map(data.map(d => [d.course, d.category]))
    scale.domain(categoryByName.values());
    return d => scale(categoryByName.get(d.course));
  }
  return d => scale(d.course);
}


function _x(d3,margin,width){return(
d3.scaleLinear([0, 1], [margin.left, width - margin.right])
)}

function _y(d3,n,margin,barSize){return(
d3.scaleBand()
    .domain(d3.range(n + 1))
    .rangeRound([margin.top, margin.top + barSize * (n + 1 + 0.1)])
    .padding(0.1)
)}

function _height(margin,barSize,n){return(
margin.top + barSize * n + margin.bottom
)}

function _barSize(){return(
48
)}

function _margin(){return(
{top: 16, right: 6, bottom: 6, left: 0}
)}

function _d3(require){return(
require("d3@6")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["Dartmouth - Courses.txt", {url: new URL("./files/2eac04e704bffad85dd9a626d3d9c73ee206663f4dbed70e5352cf86103f51f500414ae33a2dce5182ee4a2e052a70cd6ad800b40ab961443efeefadbabc0658.txt", import.meta.url), mimeType: "text/plain", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("viewof replay")).define("viewof replay", ["html"], _replay);
  main.variable(observer("replay")).define("replay", ["Generators", "viewof replay"], (G, _) => G.input(_));
  main.variable(observer()).define(["htl"], _4);
  main.variable(observer("chart")).define("chart", ["replay","d3","width","height","bars","axis","labels","ticker","keyframes","duration","x","invalidation"], _chart);
  main.variable(observer("temp_data")).define("temp_data", ["FileAttachment"], _temp_data);
  main.variable(observer("data")).define("data", ["temp_data"], _data);
  main.variable(observer("parseTime")).define("parseTime", ["d3"], _parseTime);
  main.variable(observer()).define(["data","parseTime"], _9);
  main.variable(observer()).define(["data"], _10);
  main.variable(observer("dataCopy")).define("dataCopy", ["data"], _dataCopy);
  main.variable(observer("join")).define("join", _join);
  main.variable(observer("termMedians")).define("termMedians", ["join","data","dataCopy"], _termMedians);
  main.variable(observer("duration")).define("duration", _duration);
  main.variable(observer("n")).define("n", _n);
  main.variable(observer("courses")).define("courses", ["termMedians"], _courses);
  main.variable(observer("datevalues")).define("datevalues", ["d3","termMedians"], _datevalues);
  main.variable(observer("rank")).define("rank", ["courses","d3","n"], _rank);
  main.variable(observer("k")).define("k", _k);
  main.variable(observer("keyframes")).define("keyframes", ["d3","datevalues","k","rank"], _keyframes);
  main.variable(observer("nameframes")).define("nameframes", ["d3","keyframes"], _nameframes);
  main.variable(observer("prev")).define("prev", ["nameframes","d3"], _prev);
  main.variable(observer("next")).define("next", ["nameframes","d3"], _next);
  main.variable(observer("bars")).define("bars", ["n","color","y","x","prev","next"], _bars);
  main.variable(observer("labels")).define("labels", ["n","x","prev","y","next","textTween"], _labels);
  main.variable(observer("textTween")).define("textTween", ["d3","formatNumber"], _textTween);
  main.variable(observer("formatNumber")).define("formatNumber", ["d3"], _formatNumber);
  main.variable(observer("tickFormat")).define("tickFormat", _tickFormat);
  main.variable(observer("axis")).define("axis", ["margin","d3","x","width","tickFormat","barSize","n","y"], _axis);
  main.variable(observer("ticker")).define("ticker", ["barSize","width","margin","n","formatDate","keyframes"], _ticker);
  main.variable(observer("formatDate")).define("formatDate", ["d3"], _formatDate);
  main.variable(observer("color")).define("color", ["d3","data"], _color);
  main.variable(observer("x")).define("x", ["d3","margin","width"], _x);
  main.variable(observer("y")).define("y", ["d3","n","margin","barSize"], _y);
  main.variable(observer("height")).define("height", ["margin","barSize","n"], _height);
  main.variable(observer("barSize")).define("barSize", _barSize);
  main.variable(observer("margin")).define("margin", _margin);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}
