var diameter, format, pack, svg;

var baseData = undefined;
//var pack = d3.layout.pack()
//			.size()

var node;
var currentJson;

function initRagaViz() {

	diameter = 650;

	format = d3.format(",d");

	pack = d3.layout.pack()
	    .size([diameter - 4, diameter - 4])
	    .value(function(d) { return d.size; });

	svg = d3.select("body").append("svg")
	    .attr("width", diameter)
	    .attr("height", diameter)
		.append("g")
	    .attr("transform", "translate(2,2)"); 

	    ////////////////////////////////

	    ///////////////////////////

	//data = getData();

	// getting data from JSON for testing.
	// fetching dictionary of sounds
	/*var getThaatInfo = new XMLHttpRequest();
	getThaatInfo.open("GET", "http://127.0.0.1:5000/get_thaat_info", true);
	getThaatInfo.send();
	getThaatInfo.onreadystatechange = function() {
	    if (getThaatInfo.readyState == 4 && getThaatInfo.status == 200) {
	        currentJson = JSON.parse(getThaatInfo.responseText);
	        refresh();
	    }
	}*/

	//refreshData();
	refreshData();
}

/**
* This function is used to format the data in the format required by D3.pack
*/
function formatData(inputData, ovverrideRadius) {

	var formatData = {"name": "Raga Viz", "children": []};
	console.log(inputData);


	for (var thaat in inputData) {
		if(inputData.hasOwnProperty(thaat)) {
			var thaatObj = {"name": thaat};
			var ragaList = [];

			var ragas = inputData[thaat];
			for (var i = 0; i < ragas.length; i++) {
				//ragaList.push({"name": ragas[i].common_name, "size": ovverrideRadius? ovverrideRadius:ragas[i].likelihood});
				ragaList.push({"name": ragas[i].common_name, "size": Math.random() * 100});
			}
			// Assigning the ragaList to the children of the thaatObj
			thaatObj.children = ragaList;
			formatData.children.push(thaatObj);
		}
	}
	console.log(formatData);

	return formatData;
}


function refreshData() {
	if (undefined !== baseData) {
		currentJson = formatData(baseData);
		refresh();
	} else{
		var getThaatInfo = new XMLHttpRequest();
		getThaatInfo.open("GET", "http://127.0.0.1:5000/get_thaat_info", true);
		getThaatInfo.send();
		getThaatInfo.onreadystatechange = function() {
		    if (getThaatInfo.readyState == 4 && getThaatInfo.status == 200) {
		        baseData = JSON.parse(getThaatInfo.responseText);
		        currentJson = formatData(baseData);
		        refresh();
		    }
		}
	}
}

/**
* This is the initial function call for the plotting the initial raga vizualization.
*/
/*function drawInitialViz(myData) {

	var data = formatData(myData, 10);

	var node = svg.datum(data).selectAll(".node")
				.data(pack.nodes).enter()
				.append("g")
				.attr("class", function(d) {return d.children ? "node" : "leaf node";})
				.attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")";});

	node.append("title")
		.text(function(d) { return d.name + (d.children ? "" : ": " + format(d.size)); });

	node.append("circle")
      .attr("r", function(d) { return d.r; });
   
    node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.name.substring(0, d.r / 3); });
}*/

/*function updateVis(newData) {

    pack.value(function(d) { return d.size; });

    var formatNewData = formatData(newData);

    var data1 = pack.nodes(data);

    titles.attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; })
        .text(function(d) { return d.name +
            (d.children ? "" : ": " + format(d.value)); });

    circles.transition()
        .duration(3000)
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", function(d) { return d.r; });
}*/


var refresh = function() {

	node = svg.selectAll(".node")
                    .data(pack.nodes(currentJson));

    var innerNodes = node.enter().append("g")
            .classed("node", true)
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
       
    innerNodes.append("circle")
            .attr("r", 0)
            .transition()
            .duration(2000)
            .attr("r", function(d) { return d.r; });

    innerNodes.append("text")
    		.attr("y", function(d) {return d.children ? 0 - d.r : 0;})
      		.style("text-anchor", "middle")
     		.text(function(d) { return d.name.substring(0, d.r / 3); });

    innerNodes.select("text").filter(function(d) {return d.children;})
    		.attr("font","15px sans-serif");


    // updating ... transitions
    node.transition()
        .duration(2000)
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.select("circle")
        .transition()
        .duration(2000)
        .attr("r", function(d) { return d.r; });

    node.select("text")
    	.attr("y", function(d) {return d.children ? 0 - d.r : 0;});

    setTimeout(refreshData, 3000);
}

/*
function classes(root) {
  var classes = [];
  function recurse(name, node) {
    if (node.children) {
      node.children.forEach(function(child) { recurse(node.name, child); });
    } else {
      var newNode = {packageName: name, className: node.name, value: node.size};
      for (var attr in node) { newNode[attr] = node[attr]; }
      classes.push(newNode);
    }
  }
  recurse(null, root);
  return {children: classes};
}

function drawFlat(json) {
  var pack = d3.select("body").append("svg")
  	.attr("width", diameter)
	.attr("height", diameter)
    .chart("pack.flattened")
      //.diameter(200)
      .name("className")
      .bubble({
          flatten : classes,
          title   : function(d) { return d.packageName + ": " + d3.format(",d")(d.value); },
          pack    : function(d) { return d.packageName; }
      })
      .zoomable([0.1, 4])
      //.colors(['#FF0000', '#00FF00', '#0000FF'])
      ;
  pack.draw(json);
};
*/