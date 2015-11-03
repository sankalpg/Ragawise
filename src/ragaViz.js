var radius;
function drawCircleCols(data) {

	var xPostCircle = 10;
	var xCircleGap = 50;
	var width = Math.floor(screenWidth*0.32);
	var height = Math.floor(screenHeight*0.60);
	var topMargin = 10;
	var headers = ['Svara', 'Svara Transition', 'Phrases']
	var offsetHeaders = [40, 25, 35]
	var rows = 10;

	radius = (100 -topMargin)/ (rows * 2.5);
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


		var j = 0;

		for(var thaat in data) {
			var count = 0;
			var yPos =  topMargin +3+ (j * 2.6) * radius;
			for (var uuid in data[thaat]) {
				
				var _url = "http://dunya.compmusic.upf.edu/hindustani/raag/"+uuid;

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
				//.attr("xlink:href", )
				.on('click', function (event) {window.open("http://dunya.compmusic.upf.edu/hindustani/raag/"+d3.select(this).attr("id").split('_')[1], '_blank')})
				.text(data[thaat][uuid]["common_name"]);

				count++;
			}

			j++;
		}
	}
}

function animateRagas(uuids, index, firstDur, secondDur) {
	
	for (ind in uuids) {
		var thisCircle = d3.select("body").select("svg#" + "container_" + index).select("circle#id_" + uuids[ind] + "_" + index);
		var thisText = d3.select("body").select("svg#" + "container_" + index).select("text#txt_" + uuids[ind] + "_" + index);
		var oldRadius = radius;
		var newRadius =  oldRadius * 1.25;

		thisCircle.transition()
		.duration(firstDur)
        .attr("r", newRadius)
        .attr("stroke-width",1.25)
        .each("end", function(){
        	d3.select(this).transition()
			.duration(secondDur)
        	.attr("r", oldRadius)
        	.attr("stroke-width", 0);
        });

        thisText.transition()
		.duration(firstDur)
        .attr("font-size", 3)
        .each("end", function(){
        	d3.select(this).transition()
			.duration(secondDur)
        	.attr("font-size", 2);
        });
	}
} 

function initRagaViz() {
	

	var getThaatInfo = new XMLHttpRequest();
		getThaatInfo.open("GET", "/ragawise/api/get_thaat_info", true);
		getThaatInfo.send();
		getThaatInfo.onreadystatechange = function() {
		    if (getThaatInfo.readyState == 4 && getThaatInfo.status == 200) {
		        baseData = JSON.parse(getThaatInfo.responseText);
		        //currentJson = formatData(baseData);
		        console.log(baseData);
		        drawCircleCols(baseData);
		    }
		}
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
