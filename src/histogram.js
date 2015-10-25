//d3.select("body").append("p").text("New paragraph!");

var CANVAS_WIDTH_HIST = 1300;
var CANVAS_HEIGHT_HIST = 500;

var marginHist = {top: 20, right: 20, bottom: 30, left: 50},
    widthHist = CANVAS_WIDTH_HIST - marginHist.left - marginHist.right,
    heightHist = CANVAS_HEIGHT_HIST - marginHist.top - marginHist.bottom;

var xHist; // scale variable for x
var yHist; // scale variable for yHist


/**
* Created to initialize the variables using the d3 library.
*/
function initDraw(xRange, yRange) {
  var svg = d3.select("body").append("svg")
  .attr("id", "hitogram")
  .attr("width", widthHist + marginHist.left + marginHist.right).attr("height", heightHist + marginHist.top + marginHist.bottom)
  .append("g").attr("transform", "translate(" + marginHist.left + "," + marginHist.top + ")");

  //xHist = d3.scale.linear().range([0, widthHist]).domain([xRange.min, xRange.max]);
  var xDomain = [];
  for (var i = xRange.min; i <= xRange.max; i++) {
    xDomain.push(i);
  }
  xHist = d3.scale.ordinal().domain(xDomain).rangeBands([0, widthHist]);

  yHist = d3.scale.linear().range([heightHist, 0]).domain([yRange.min,yRange.max]);
  //yHist = d3.scale.linear().range([heightHist, 0]);

  var xAxis = d3.svg.axis()
    .scale(xHist)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(yHist)
    .orient("left");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + heightHist + ")")
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

/*var line = d3.svg.line()
.x(function(d,i) 
  {
    return xHist(i);
  })
.y(function(d,i) 
  {
    return yHist(d);
  });
*/
function drawHist(data) {
  
  var svg = d3.select("body").select("svg#hitogram").select("g");

  svg.selectAll(".bar").remove();
  svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d, i) {return xHist(i)})
      .attr("y", function(d, i) {return yHist(d)})
      .attr("width", x.rangeBand())
      .attr("height", function(d) {return heightHist - yHist(d)});
}