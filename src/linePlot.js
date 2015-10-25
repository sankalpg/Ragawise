var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;

var CANVAS_WIDTH_LINEPLOT = Math.floor(screenWidth*0.48);
var CANVAS_HEIGHT_LINEPLOT = Math.floor(screenHeight*0.3);

var marginLinePlot = {top: 0, right: 20, bottom: 30, left: 50};
var widthLinePlot = CANVAS_WIDTH_LINEPLOT - marginLinePlot.left - marginLinePlot.right ;
var heightLinePlot = CANVAS_HEIGHT_LINEPLOT - marginLinePlot.top - marginLinePlot.bottom;

var xLinePlot; // scale variable for x
var yLinePlot; // scale variable for y

/**
* Created to initialize the variables using the d3 library.
*/
function initDraw(xRange, yRange) {
  var svg = d3.select("body").append("svg")
  .attr("id", "linePlot")
  .attr("width", widthLinePlot + marginLinePlot.left + marginLinePlot.right).attr("height", heightLinePlot + marginLinePlot.top + marginLinePlot.bottom)
  .append("g").attr("transform", "translate(" + marginLinePlot.left + "," + marginLinePlot.top + ")");

  xLinePlot = d3.scale.linear().range([0, widthLinePlot]).domain([xRange.min, xRange.max]);
  yLinePlot = d3.scale.linear().range([heightLinePlot, 0]).domain([yRange.min,yRange.max]);

  svg.append("text")
    .attr("x", widthLinePlot/2.2)
    .attr("y", 10)
    .attr("font-size", 12)
    .attr("font-weight", 'bold')
    .text("Pitch Contour");

  var xAxis = d3.svg.axis()
    .scale(xLinePlot)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(yLinePlot)
    .orient("left");

  // svg.append("g")
  //     .attr("class", "x axis")
  //     .attr("transform", "translate(0," + heightLinePlot + ")")
  //     .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Cents");

  svg.append("path").attr("id","graph");
}

var line = d3.svg.line()
.x(function(d,i) 
  {
    return xLinePlot(i);
  })
.y(function(d,i) 
  {
    return yLinePlot(d);
  });

function draw(data) {
  var svg = d3.select("svg#linePlot");
  svg.select("path#graph").datum(data).attr("class", "line").attr("d", line);
}