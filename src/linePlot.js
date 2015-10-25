//d3.select("body").append("p").text("New paragraph!");

var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;

console.log(screenWidth);
console.log(screenHeight);

var CANVAS_WIDTH_LINEPLOT = Math.floor(screenWidth*0.48);
var CANVAS_HEIGHT_LINEPLOT = Math.floor(screenHeight*0.3);

var marginLinePlot = {top: 0, right: 20, bottom: 30, left: 50},
    widthLinePlot = CANVAS_WIDTH_LINEPLOT - marginLinePlot.left - marginLinePlot.right ;
    heightLinePlot = CANVAS_HEIGHT_LINEPLOT - marginLinePlot.top - marginLinePlot.bottom;

var xLinePlot; // scale variable for x
var yLinePlot; // scale variable for y

//var xAxis;

//var yAxis;

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

  var xAxis = d3.svg.axis()
    .scale(xLinePlot)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(yLinePlot)
    .orient("left");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + heightLinePlot + ")")
      .call(xAxis);

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

  //var testD = [];
  //for (var i = 0; i <1200; i++) {
    /*if (i < 300) {
      testD.push(0);
    } else if (i < 600){
      testD.push(50);
    } else if (i < 900) {
      testD.push(100);
    } else {
      testD.push(150);
    }*/
    //testD.push(Math.random() * 150);
  //}
  //console.log(Array.max(data));
  var svg = d3.select("svg#linePlot");
  svg.select("path#graph").datum(data).attr("class", "line").attr("d", line);
}