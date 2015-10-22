
//Crucial parameters
var Thsld_energy_per_frame = 0.01;
var min_f0 = 80.0;
var max_f0 = 600.0;
var tonic = 55.0;
var pitch_buffer_len = 500;
var pitch_buffer  = createRingBuffer(pitch_buffer_len);


//Global variables
var freq_res = 1; //frewuency resolution for pitch histogram in cents
var pitch_hist = new Float32Array(Math.ceil(1200/freq_res));
var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

//initializing the pitch histogram with all zeros
function init_hist(){
    //set all the samples to zero
    for (var i = 0; i < pitch_hist.length; ++i) { pitch_hist[i] = 0; }    
}

//set tonic value (input from the web interface)
function setTonic(val){
    tonic = val/2.0;
    console.log(tonic);
}

function interpolate_cubic(leftVal, middleVal, rightVal, currentBin){
  var delta_x = 0.5*((leftVal - rightVal)/(leftVal - 2*middleVal + rightVal));
  resultBin = currentBin + delta_x;
  return resultBin
}

function autoCorrelate( buffer, sampleRate, oct_fold ) {
    // This is a very very basic version of pitch tracking, lets use a better version once we have stuff working
    //console.log(sampleRate);
    var SIZE = buffer.length;
    var sam_min = Math.round(sampleRate/max_f0);
    var sam_max = Math.round(sampleRate/min_f0);
    var MAX_SAMPLES = Math.min(Math.floor(SIZE/2), sam_max);
    var MIN_SAMPLES = sam_min;
    var best_offset = -1;
    var best_correlation = 0;
    var sig_eng = 0;                                    //signal evergy
    var foundGoodCorrelation = false;
    var correlations = new Array(MAX_SAMPLES);

    //a thresholding based on the evergy of the signal
    for (var i=0;i<SIZE;i++) {
        sig_eng += buffer[i]*buffer[i];
    }
    //Compytuing average energy per sample
    sig_eng = Math.sqrt(sig_eng/SIZE);
    //Thresholding
    if (sig_eng < Thsld_energy_per_frame) // not enough energy
        return -1;

    var lastCorrelation=1;
    for (var offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
        var correlation = 0;

        for (var i=0; i<SIZE-offset; i++) {
            correlation += Math.abs((buffer[i])-(buffer[i+offset]));
        }
        correlation = 1 - (correlation/(SIZE-offset));
        correlations[offset] = correlation; // store it, for the tweaking we need to do below.
        if ((correlation>0.9) && (correlation > lastCorrelation)) {
            foundGoodCorrelation = true;
            if (correlation > best_correlation) {
                best_correlation = correlation;
                best_offset = offset;
            }
        } else if (foundGoodCorrelation) {
            // short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
            // Now we need to tweak the offset - by interpolating between the values to the left and right of the
            // best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
            // we need to do a curve fit on correlations[] around best_offset in order to better determine precise
            // (anti-aliased) offset.

            // we know best_offset >=1,
            // since foundGoodCorrelation cannot go to true until the second pass (offset=1), and
            // we can't drop into this clause until the following pass (else if).
           
            //var shift = (correlations[best_offset+1] - correlations[best_offset-1])/correlations[best_offset];
            //return sampleRate/(best_offset+(8*shift));
            var interp_offset = interpolate_cubic(correlations[best_offset-1], correlations[best_offset], correlations[best_offset+1], best_offset);
            return sampleRate/(interp_offset);
        }
        lastCorrelation = correlation;
    }
    if (best_correlation > 0.01) {
        // console.log("f = " + sampleRate/best_offset + "Hz (sig_eng: " + sig_eng + " confidence: " + best_correlation + ")")
        return sampleRate/best_offset;
    }
    return -1;
    //  var best_frequency = sampleRate/best_offset;
}

function pitchOctaveFold( frequency ) {
    var freq  = 1200*Math.log(frequency/tonic)/Math.log(2);
    return freq%1200;
}

function pitchDetect( buffer, sampleRate ){

    var pitch = autoCorrelate(buffer, sampleRate);
    var pitch_fold = -1
    if (pitch !=-1){
        var pitch_fold =  pitchOctaveFold(pitch);
        pitch_hist[Math.round(pitch_fold)]+=1;
    }
    else
    {

    }

    return pitch_fold
}
