/*
This is a js implementation of YIN algorithm for detecting pitch from an audio signal.
Ref + Lis -> coming soon...
*/

//Crucial parameters
var min_f0 = -1;
var max_f0 = -1;
var samplingRate = -1;
var interpolate = -1;
var tolerance = -1;
var minTau = -1;
var maxTau = -1;
var octFold = -1;
var nDelays = -1


function findLocalMinimas(buffer){

	minimas = []
	min_val = 10000000000000;
	min_offset = -1;

	for (var ii =1 ; ii < buffer.length-1; ii++){
		if ((buffer[ii]-buffer[ii-1] < 0) && (buffer[ii+1]-buffer[ii]>0)) {
			minimas.push({min_val:buffer[ii], offset:ii});
			if (buffer[ii]<min_val){
				min_val = buffer[ii];
				min_offset = ii;
			}
		}
	}
	return {min_val: min_val, min_offset: min_offset};
}


function initPitchYIN(samplingRate, min_f0, max_f0, interpolate, tolerance, octFold){

	//assigning the default values of the parameters
	samplingRate = samplingRate || 44100;
	console.log("Since no samplingRate was provided, we assume 44100 Hz");
	min_f0 = min_f0 || 100;
	max_f0 = max_f0 || 450;
	tolerance = tolerance || 0.15;
	interpolate = interpolate || 1;
	octFold = octFold || false;

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

	maxTau = Math.min(maxTau, parseInt(buffer.length/2.0);
	yin[0] = 1;
	// Compute difference function
	for (var tau = 1; tau <=yin.length; tau++) {
			yin[tau] = 0;
			for (var jj =0; jj <buffer.length-yin.length; jj++){
				yin[tau]+= Math.pow(buffer[jj]-buffer[jj+(tau)], 2);
			}
		}

	// Compute a cumulative mean normalized difference function
	var sum = yin[0];
	for (tau = 1; tau <= maxTau; tau++){
		sum+=yin[tau];
		yin[tau] = yin[tau] * tau/sum;
	}

	minima = findLocalMinimas(yin);

	if (minima.min_offset > 0)
	{
		if (minima.min_val<=tolerance){
			pitch = samplingRate/min_offset;
			pitch_conf = 1 - minima.min_val;	
		}
		
	}

	return pitch;
}
