//d3.select("body").append("p").text("New paragraph!");

var CANVAS_WIDTH = 1300;
var CANVAS_HEIGHT = 500;

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = CANVAS_WIDTH - margin.left - margin.right,
    height = CANVAS_HEIGHT - margin.top - margin.bottom;

var svg;
var x; // scale variable for x
var y; // scale variable for y
var bar;

var xAxis;
var yAxis;

/**
* Created to initialize the variables using the d3 library.
*/
function initDraw(xRange, yRange) {
  svg = d3.select("body").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom)
  .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //x = d3.scale.linear().range([0, width]).domain([xRange.min, xRange.max]);
  var xDomain = [];
  for (var i = xRange.min; i <= xRange.max; i++) {
    xDomain.push(i);
  }
  x = d3.scale.ordinal().domain(xDomain).rangeBands([0, width]);

  y = d3.scale.linear().range([height, 0]).domain([yRange.min,yRange.max]);
  //y = d3.scale.linear().range([height, 0]);

  xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Prominence");
}

var line = d3.svg.line()
.x(function(d,i) 
  {
    return x(i);
  })
.y(function(d,i) 
  {
    return y(d);
  });

function draw(data) {
  var tempData = [];
  for (var i = 0; i < 120; i++) {
    tempData.push(Math.random() * 30);
  }
  console.log(tempData);
  svg.selectAll(".bar").remove();
  svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d, i) {return x(i)})
      .attr("y", function(d, i) {return y(d)})
      .attr("width", x.rangeBand())
      .attr("height", function(d) {return height - y(d)});
}