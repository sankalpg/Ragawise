//d3.select("body").append("p").text("New paragraph!");

var CANVAS_WIDTH = 960;
var CANVAS_HEIGHT = 500;

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = CANVAS_WIDTH - margin.left - margin.right,
    height = CANVAS_HEIGHT - margin.top - margin.bottom;

var svg;
var x; // scale variable for x
var y; // scale variable for y

var xAxis;

var yAxis;

/**
* Created to initialize the variables using the d3 library.
*/
function initDraw(xRange, yRange) {
  svg = d3.select("body").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom)
  .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x = d3.scale.linear().range([0, width]).domain([xRange.min, xRange.max]);
  y = d3.scale.linear().range([height, 0]).domain([yRange.min,yRange.max]);

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
      .text("Cents");

  svg.append("path").attr("id","graph");
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

  var testD = [];
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
  console.log(Array.max(data));
 
  svg.select("path#graph").datum(data).attr("class", "line").attr("d", line);
}