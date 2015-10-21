/*
This is a js implementation of YIN algorithm for detecting pitch from an audio signal.
Ref + Lis -> coming soon...
*/

//Crucial parameters
var min_f0;
var max_f0;
var samplingRate;
var interpolate;
var tolerance;
var octFold;
var minTau = -1;
var maxTau = -1;
var nDelays = -1


function findLocalMinimas(buffer, minTau, maxTau){

	minimas = []
	min_val = 10000000000000;
	min_offset = -1;

	for (var ii =minTau ; ii < maxTau; ii++){
		if ((buffer[ii]-buffer[ii-1] < 0) && (buffer[ii+1]-buffer[ii]>0)) {
			minimas.push({min_val:buffer[ii], offset:ii});
			if (buffer[ii]<min_val){
				min_val = buffer[ii];
				min_offset = ii;
			}
		}
	}
	return {val: min_val, offset: min_offset};
}


function initPitchYIN(_samplingRate, _min_f0, _max_f0, _interpolate, _tolerance, _octFold){

	//assigning the default values of the parameters
	if (typeof _samplingRate == 'undefined'){
		console.log("Since no samplingRate was provided, we assume 44100 Hz");		
	}
	samplingRate = _samplingRate || 44100.0;	
	min_f0 = _min_f0 || 100;
	max_f0 = _max_f0 || 450;
	tolerance = _tolerance || 0.15;
	interpolate = _interpolate || 1;
	octFold = _octFold || false;

	if (max_f0 <= min_f0){
		console.log("Please provide a sensible min and max f0 value");
	}

	//computing minimum and maximum delay within which we should be searching minima
	minTau = parseInt(Math.floor(samplingRate/max_f0));
	maxTau = parseInt(Math.ceil(samplingRate/min_f0));

	//assigning array to store AMDF vals
	yin = new Float32Array(maxTau+1);
}

function computePitchYIN(buffer){

	var pitch =-1;
	var pitch_conf =0;
	
	maxTau = Math.min(maxTau, parseInt(buffer.length/2.0));
	yin[0] = 1;
	// Compute difference function
	for (var tau = 1; tau <=yin.length; tau++) {
			yin[tau] = 0;
			for (var jj =0; jj <buffer.length-tau; jj++){
				yin[tau]+= Math.pow(buffer[jj]-buffer[jj+(tau)], 2);
			}
		}

	// Compute a cumulative mean normalized difference function
	var sum = yin[0];
	for (tau = 1; tau <= maxTau; tau++){
		sum+=yin[tau];
		yin[tau] = yin[tau] * tau/sum;
	}

	minima = findLocalMinimas(yin, minTau, maxTau);
	//console.log(minima, samplingRate, samplingRate/minima.offset, minTau, maxTau);
	
	if (minima.offset > 0)
	{
		if (minima.val < tolerance){
			var off_fine = interpolate_cubic(yin[minima.offset-1], yin[minima.offset], yin[minima.offset+1], minima.offset);
			pitch = samplingRate/off_fine;
			pitch_conf = 1 - minima.val;	
		}
		
	}
	return pitch;
}
