//Crucial parameters
var tonic = 55.0;
var minNoteDur = 0.2;
var maxMergeDur = 1;	//for note merging
var minSilDur = .5;
var noteBufferLen = 200; //number of past notes to store
var prevNoteNum = -1;
var noteOnsetTime = -1;
var breathOnsetTime =-1;
var pitchAllowanceIn = 30;	// in cents
var pitchAllowanceOut = 50;	// in cents
var thsldTemp;
var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
var svaras = ['S', 'r', 'R', 'g', 'G', 'm', 'M', 'P', 'd', 'D', 'n', 'N', '---']
var symbolBuffer = [];
var isNoteOn = false;
var isBreathOn = true;
var firstNoteDetected = false;
var validNoteDurDetected = false;

//initializations
var noteBuffer = createRingBuffer_obj(noteBufferLen);

//setting tonic value for every singer (input from the web interface)
function setTonic(val){
    tonic = val/2.0;
    console.log(tonic);
}

//this function checks if the last note stored is same as the current note
function isLastNoteSame(_noteBuffer, current_note){
	var pointer = _noteBuffer.get_pointer();
	var last_note = _noteBuffer.get(pointer-1);
	if ((last_note.num == current_note.num) && ((current_note.start - last_note.end) < maxMergeDur)){
		return true;
	}
	else{
		return false;
	}
}

function updateTranscriptionDisplay(){
	$('#note_val_curr').text(symbolBuffer.join(" "));
}

function updatePrevNoteOffsetTime(currTime){
	var pointer = noteBuffer.get_pointer();
	var lastNote = noteBuffer.get(pointer-1);
	lastNote.end = currTime;
	noteBuffer.set(pointer-1, lastNote);
}

//this is the main function to transcribe melody	
//NOTE: we expect the input currPitch in cents.
function transcribe_note(currPitch){
	
	var nearestNote;
	var date = new Date();
	var currTime = date.getTime()/1000.0;
	var diff;

	// ############################################################
	// finding the note number corresponding to the input currPitch
	// ############################################################
	var currNoteNum = 12;
	if (currPitch != -1){
		nearestNote = 100*(Math.round(currPitch/100.0));
		diff = Math.abs(currPitch - nearestNote);
		if (isNoteOn == false){
			thsldTemp = pitchAllowanceIn;
		}
		else{
			thsldTemp = pitchAllowanceOut;
		}
		if (diff < thsldTemp ){
			currNoteNum = (nearestNote/100.0)%12;
		}
	}

	// ############################################################
	// Breath Onset
	// ############################################################
	if (currNoteNum == 12 && prevNoteNum != 12){
		isBreathOn = true;
		breathOnsetTime = currTime;
	}	

	// ############################################################
	// Breath pause is confirmed at this point (with this condition)
	// ############################################################
	if ( (currTime - breathOnsetTime >= minSilDur) && (isBreathOn == true) && (validNoteDurDetected = false)){
		// we treat silence as a musical symbol and push it
		var note = {name:'', start: -1, end:-1 , duration:0, num:-1};
		note.num = 12;
		note.start = breathOnsetTime;
		note.end = currTime;
		note.duration = note.end-note.start;
		// pushing silence symbol in noteBuffer and symbolBuffer
		noteBuffer.push(note);
		symbolBuffer.push(svaras[note.num]);
		updateTranscriptionDisplay();
		validNoteDurDetected = true;
	}

	// ############################################################
	// Breath pause is confirmed at this point (with this condition)
	// ############################################################
	if (currNoteNum != 12 && prevNoteNum == 12){
		isBreathOn = false;
		if (validNoteDurDetected == true){
			updatePrevNoteOffsetTime(currTime);
		}
		validNoteDurDetected = false;
	}

	// ############################################################
	// Detecting note onset
	// ############################################################
	if (currNoteNum != 12 && prevNoteNum == currNoteNum && isNoteOn == false){
		isNoteOn = true;
		noteOnsetTime =currTime;
		validNoteDurDetected = false;
	}

	// ############################################################
	// At this point a note qualifies a minimum note duration
	// ############################################################
	if (isNoteOn == 1 && ((currTime- noteOnsetTime) > minNoteDur) && validNoteDurDetected == false){
		var note = {name:'', start: -1, end:-1 , duration:0, num:-1};
		note.num = currNoteNum;
		note.start = noteOnsetTime;
		note.end = currTime;
		note.duration = note.end-note.start;
		// pushing silence symbol in noteBuffer and symbolBuffer
		noteBuffer.push(note);
		symbolBuffer.push(svaras[note.num]);
		updateTranscriptionDisplay();
		validNoteDurDetected = true;
	}

	// ############################################################
	// Detecting note offset
	// ############################################################
	if (prevNoteNum != currNoteNum && isNoteOn ==1){
		isNoteOn = false;
		if (validNoteDurDetected == true){			
			var isPrevNoteSame = false
			var note = {name:'', start: -1, end:-1 , duration:0, num:-1};
			note.num = prevNoteNum;
			note.start = noteOnsetTime;
			note.end = currTime;
			note.duration = note.end-note.start;
			if (firstNoteDetected == true){
				isPrevNoteSame = isLastNoteSame(noteBuffer, note);	
			}
			if (isPrevNoteSame == false){
				noteBuffer.push(note);
				symbolBuffer.push(svaras[note.num]);	
				firstNoteDetected = true;
			}
			else{
				updatePrevNoteOffsetTime(currTime);
			}
			validNoteDurDetected = false;

		}		
		
	}
	prevNoteNum = currNoteNum;

}