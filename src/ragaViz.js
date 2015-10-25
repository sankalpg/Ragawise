
var data = [
	{
		"thaat": "Bilawal",
		"ragas":["Alahiya_Bilawal", "Bihag"]
	},
	{
		"thaat": "Kalyan",
		"ragas":["Bhoopali", "Yaman"]	
	},
	{
		"thaat": "Khamaj",
		"ragas":["Rageshri", "Khamaj"]	
	},
	{
		"thaat": "Bhairav",
		"ragas":["Ahir_Bhairav", "Nat_Bhairav"]	
	},
	{
		"thaat": "Purvi",
		"ragas":["Shree", "Puriya_Dhanashree"]	
	},
	{
		"thaat": "Marwa",
		"ragas":["Marwa", "Puriya"]	
	},
	{
		"thaat": "Kafi",
		"ragas":["Bhimpalasi", "Desi"]	
	},
	{
		"thaat": "Asavari",
		"ragas":["Jaunpuri", "Kaunsi_Kanada"]	
	},
	{
		"thaat": "Bhairavi",
		"ragas":["Malkauns", "Bilaskhani"]	
	},
	{
		"thaat": "Todi",
		"ragas":["Todi", "Multani", "Mitti"]	
	}
];

/*var margin = {
			top: 40,
			right: 40,
			bottom: 40,
			left: 40,
			svgRight: 10
		}, width = 1200 - margin.left - margin.right,
			height = 650 - margin.top - margin.bottom;
*/

//var y = d3.scale.ordinal().domain(d3.range(1)).rangePoints([0, height]);

function drawCircleCols(data) {

	var xPostCircle = 10;
	var xCircleGap = 50;
	var width = Math.floor(screenWidth*0.32);
	var height = Math.floor(screenHeight*0.60);
	var topMargin = 10;
	var headers = ['Svara', 'Svara Transition', 'Phrases']
	offsetHeaders = [40, 25, 35]

	var rows = 10;

	for (var i = 0 ; i < 3; i++) {
		//var thaat = data[i].thaat;
		var svg = d3.select("body")
					.append("svg")
					.attr("id","container_" + i)
					.attr("width", width)
					.attr("height", height)
					.attr("viewBox", "0 0 100 100");

		var group = svg.append("g")
					//.attr("id", data[j].thaat + "G")
					//.attr("stroke", "green")
					//.attr("fill", "white")
					.attr("stroke-width", 1);
		group.append("text")
				.attr("font-size", 5)
				.attr("x", offsetHeaders[i])
				.attr("y", topMargin/2)
				.text(headers[i]);

		var radius = (100 -topMargin)/ (rows * 2.5);

		var j = 0;

		for(var thaat in data) {
			var count = 0;
			var yPos =  topMargin +3+ (j * 2.6) * radius;
			for (var uuid in data[thaat]) {

				group.append("circle") // set the id here...
				.attr("fill", data[thaat][uuid]["color"])
				.attr("stroke-width", 0)
				.attr("id", "id_" + uuid + "_" + i)
				.attr("cx", xPostCircle + xCircleGap * count)
				.attr("cy", yPos)
				.attr("r", radius);

				group.append("text")
				.attr("id", "txt_" + uuid + "_" + i)
				.attr("font-size", 2)
				.attr("x", xPostCircle + xCircleGap * count + 2*radius )
				.attr("y", yPos + radius/2)
				.text(data[thaat][uuid]["common_name"]);

				count++;
			}

			j++;
		}

		/*for (var j = 0; j < rows; j++) {

			var yPos = (j * 3  + 2) * radius;
			
			group.append("circle") // set the id here...
				.attr("fill", data[i][0])
				.attr("cx", 30)
				.attr("cy", yPos)
				.attr("r", radius / 2);

			group.append("circle") // set the id here...
				.attr("cx", 70)
				.attr("cy", yPos)
				.attr("r", radius / 2);
		}*/

		//setTimeout(2000, animateRagas(["96ef352a-9baf-4ba9-a628-9cabb59b2175"], 0));
	}
	//setTimeout(2000, animateRagas(["id_" + "dd59147d-8775-44ff-a36b-0d9f15b31319", "id_" + "48b37bed-e847-4882-8a01-5c721e07f07d"], 0));
}

function animateRagas(uuids, index, firstDur, secondDur) {
	
	for (ind in uuids) {
		var thisCircle = d3.select("body").select("svg#" + "container_" + index).select("circle#id_" + uuids[ind] + "_" + index);
		var thisText = d3.select("body").select("svg#" + "container_" + index).select("text#txt_" + uuids[ind] + "_" + index);
		var oldRadius = thisCircle.attr("r");
		var newRadius =  oldRadius * 1.5;

		thisCircle.transition()
		.duration(firstDur)
        .attr("r", newRadius)
        .attr("stroke-width",2)
        .each("end", function(){
        	d3.select(this).transition()
			.duration(secondDur)
        	.attr("r", oldRadius)
        	.attr("stroke-width", 0);
        });

        thisText.transition()
		.duration(firstDur)
        .attr("font-size", 4)
        .each("end", function(){
        	d3.select(this).transition()
			.duration(secondDur)
        	.attr("font-size", 2);
        });
	}
} 

function initRagaViz() {
	

	var getThaatInfo = new XMLHttpRequest();
		getThaatInfo.open("GET", "http://127.0.0.1:5000/get_thaat_info", true);
		getThaatInfo.send();
		getThaatInfo.onreadystatechange = function() {
		    if (getThaatInfo.readyState == 4 && getThaatInfo.status == 200) {
		        baseData = JSON.parse(getThaatInfo.responseText);
		        //currentJson = formatData(baseData);
		        console.log(baseData);
		        drawCircleCols(baseData);
		    }
		}
						
		/*var ragas = data[i].ragas;
		var numRagas = ragas.length;
		
		var radius = 100 / (numRagas * 3 + 1);

		group.selectAll("circle")
				.data(ragas)
				.enter()
				.append("circle")
				.attr("id", function(d,idx) {return thaat + d})
				.attr("cx", function(d,idx){ return (3 * idx + 2) * radius;})
				.attr("cy", 50)
				.attr("r", radius/2);*/
				

	//updateRagaViz();
}

function updateRagaViz(newData) {
	newData = data;
	for (var i = 0; i < newData.length; i++) {
		var thaat = newData[i].thaat;
		var ragas = newData[i].ragas;
		var radius = 100 / (ragas.length * 3 + 1);
		for (var j=0; j < ragas.length; j++) {
			d3.select("circle#" + thaat + ragas[j])
				.transition()
				.duration(1000)
				.attr("stroke-width", 2)
				.attr("r", radius * 1.5);
		}
	}
}



//var modRow = margin.left + 5 * (margin.svgRight + width + margin.left + margin.right);
//var modCol = margin.top

/*var svg = d3.select("body")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom);*/

/*for (var i = 0; i < 5; i++) {
	var temp = (margin.left + i *(width + margin.svgRight +margin.left + margin.right)) % modRow;
	var g = d3.select("svg")
		.append("g")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.attr("margin-right", margin.svgRight);
}*/

/*var svg = d3.select("body")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");*/
	
	/*svg.selectAll("circle")
	.data(y.domain())
	.enter()
	.append("circle")
	.attr("stroke-width", 20)
	.attr("r", 10)
	.attr("cx", width / 2)
	.attr("cy", y)
	.each(pulse);*/

/*function pulse() {
	var circle = svg.select("circle");
	(function repeat() {
		circle = circle.transition()
			.duration(2000)
			.attr("stroke-width", 20)
			.attr("r", 10)
			.transition()
			.duration(2000)
			.attr('stroke-width', 0.5)
			.attr("r", 200)
			.ease('sine')
			.each("end", repeat);
	})();
}*/