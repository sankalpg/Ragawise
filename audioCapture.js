    var audio_context;
    var isPlaying = false;
    var sourceNode = null;
    var analyser = null;
    var analyser = null;
    var mediaStreamSource = null;
    var buflen = 1024;
    var myBuffer = new Float32Array( buflen );
    var pitch_hist = new Float32Array(1200);
    var MIN_SAMPLES = 0;
    var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    
    for (var i = 0; i < pitch_hist.length; ++i) { pitch_hist[i] = 0; }
    
    function pitchOctaveFold( frequency ) {
        var freq  = 1200*Math.log(frequency/110.0)/Math.log(2);
        return freq%1200;
    }

    function getUserMedia(dictionary, callback) {
        try {
            navigator.getUserMedia = 
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;
            navigator.getUserMedia(dictionary, callback, error);
        } catch (e) {
            alert('getUserMedia threw exception :' + e);
        }
    }
    
    function gotStream(stream) {
        // Create an AudioNode from the stream.
        mediaStreamSource = audio_context.createMediaStreamSource(stream);

        // Connect it to the destination.
        analyser = audio_context.createAnalyser();
        analyser.fftSize = 2048;
        mediaStreamSource.connect( analyser );  
        getSamples();
    }

    
    function __log(e, data) {
        log.innerHTML += "\n" + e + " " + (data || '');
    }
    
    function error() {
        alert('Stream generation failed.');
    }
    
    function startRecording(inp){
    isPlaying = true;
    getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, gotStream);
    }
function stopRecording()
{
    isPlaying = false;
}
function init() {
    try {
      // webkit shim
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
      window.URL = window.URL || window.webkitURL;
      
      audio_context = new AudioContext();      
    } catch (e) {
      alert('No web audio support in this browser!');
    }
    

  };
  
  function getSamples( time ) {
    analyser.getFloatTimeDomainData(myBuffer);
    var pitch = autoCorrelate(myBuffer, audio_context.sampleRate);
    if (pitch !=-1){
        var pitch_fold =  pitchOctaveFold(pitch);
        pitch_hist[Math.round(pitch_fold)]+=1;
//         console.log(pitch_fold);
    }
    else
    {
//         console.log(pitch);
        
    }
    console.log(pitch_hist);
    
    
    
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = window.webkitRequestAnimationFrame;
    if (isPlaying){
        rafID = window.requestAnimationFrame( getSamples );
    }
    
}

function autoCorrelate( buf, sampleRate ) {
    var SIZE = buf.length;
    var MAX_SAMPLES = Math.floor(SIZE/2);
    var best_offset = -1;
    var best_correlation = 0;
    var rms = 0;
    var foundGoodCorrelation = false;
    var correlations = new Array(MAX_SAMPLES);

    for (var i=0;i<SIZE;i++) {
        var val = buf[i];
        rms += val*val;
    }
    rms = Math.sqrt(rms/SIZE);
    if (rms<0.01) // not enough signal
        return -1;

    var lastCorrelation=1;
    for (var offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
        var correlation = 0;

        for (var i=0; i<MAX_SAMPLES; i++) {
            correlation += Math.abs((buf[i])-(buf[i+offset]));
        }
        correlation = 1 - (correlation/MAX_SAMPLES);
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
            var shift = (correlations[best_offset+1] - correlations[best_offset-1])/correlations[best_offset];  
            return sampleRate/(best_offset+(8*shift));
        }
        lastCorrelation = correlation;
    }
    if (best_correlation > 0.01) {
        // console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
        return sampleRate/best_offset;
    }
    return -1;
//  var best_frequency = sampleRate/best_offset;
}
