
//global variables
var audio_context;
var isPlaying = false;
var sourceNode = null;
var analyser = null;
var analyser = null;
var mediaStreamSource = null;
var buflen = 2048;
var myBuffer = new Float32Array( buflen );
var pitch_buffer_len;
var pitch_buffer;
var pasttime =1;

// Util functions 
    function __log(e, data) {
    log.innerHTML += "\n" + e + " " + (data || '');
};

function error() {
    alert('Stream generation failed.');
};


//The main functon to get the stream
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
};

// The callback when the stream is set and permissions are granted by the user
function gotStream(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audio_context.createMediaStreamSource(stream);

    // Connect it to the destination.
    analyser = audio_context.createAnalyser();
    analyser.fftSize = 2048;
    mediaStreamSource.connect( analyser );  
    getSamples();
};

// Start recording
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
};


function stopRecording(){
    isPlaying = false;
};

// Function that initializes the audio context
function init() {
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
      window.URL = window.URL || window.webkitURL;
      
      audio_context = new AudioContext();      
    } catch (e) {
      alert('No web audio support in this browser!');
    }
    //initializing pitch visualization
    pitch_buffer_len = 500;
    pitch_buffer  = createRingBuffer(pitch_buffer_len);

    var xRange = {min:0, max:pitch_buffer_len};
    var yRange = {min:-600, max:1800};
    initDraw(xRange, yRange);
    initPitchYIN(samplingRate = audio_context.sampleRate);
    initRagaViz();
    initDraw_hist({'min': 0, 'max':19}, {'min':0.0, 'max':100.0} );
    
    
};

// Function to read the samples and do some processing
function getSamples( time ) {

    // fetch the time domain data deom the analyzer object
    analyser.getFloatTimeDomainData(myBuffer);

    // use the time domain data for pitch estimation
    
    //var pitch = pitchDetect(myBuffer, audio_context.sampleRate);
    var pitch = computePitchYIN(myBuffer);
    //console.log("Pitch is", pitch_C)
    //
    //draw(pitch)
    if (pitch > 0.0000000001){
    pitch_C = 1200*Math.log2(pitch/tonic);    
    }
    else{
        pitch_C = -1;
    }
    transcribe_note(pitch_C);
    pitch_C = pitch_C -1200
    pitch_buffer.push(pitch_C);    
    // var d = new Date();
    // //console.log(pitch, pitch_C, d.getTime()-pasttime);
    // pasttime = d.getTime();
    pitch_buffer.copyLinBuff();
    var linBuff = pitch_buffer.getLinBuff();
    draw(linBuff);  //draw the buffer
    //console.log(pitch)  //logging the pitch

    //This is the way we have made continuous callback to this function
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = window.webkitRequestAnimationFrame;
    
    if (isPlaying){
        rafID = window.requestAnimationFrame( getSamples );
    }

};


