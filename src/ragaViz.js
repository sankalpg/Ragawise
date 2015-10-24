
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

function initRagaViz() {
	var height = "33%";
	var width = "33%";

	var rows = data.length;

	for (var i = 0 ; i < 3; i++) {
		//var thaat = data[i].thaat;
		var svg = d3.select("body")
					.append("svg")
					.attr("width", width)
					.attr("height", height)
					.attr("viewBox", "0 0 100 100");

		var group = svg.append("g")
					//.attr("id", data[j].thaat + "G")
					.attr("stroke", "green")
					.attr("fill", "white")
					.attr("stroke-width", 1);

		var radius = 100 / (rows * 3 + 1);

		for (var j = 0; j < rows; j++) {

			var yPos = (j * 3  + 2) * radius;
			
			group.append("circle") // set the id here...
				.attr("cx", 30)
				.attr("cy", yPos)
				.attr("r", radius / 2);

			group.append("circle") // set the id here...
				.attr("cx", 70)
				.attr("cy", yPos)
				.attr("r", radius / 2);
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
				
	}

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