//Crucial parameters
var tonic = 110.0/2.0;
var minNoteDur = 0.25;
var maxMergeDur = 1;	//for note merging
var minSilDur = 1;
var noteBufferLen = 200; //number of past notes to store
var prevNoteNum = -1;
var noteOnsetTime = -1;
var breathOnsetTime =-1;
var pitchAllowanceIn = 30;	// in cents
var pitchAllowanceOut = 50;	// in cents
var thsldTemp;
var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
var svaras = ['S', 'r', 'R', 'g', 'G', 'm', 'M', 'P', 'd', 'D', 'n', 'N', '---']
var svaras2Num = {'S':0, 'r':1, 'R':2, 'g':3, 'G':4, 'm':5, 'M':6, 'P':7, 'd':8, 'D':9, 'n':10, 'N':11}
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

function get_phrases(){
	var len = symbolBuffer.length;
	if (len > 4){
	return {'status': true, '3len':symbolBuffer.slice(len-3,len).join("-"), '4len': symbolBuffer.slice(len-4,len).join("-")};	
	}
	return {'status': true, '3len':"", '4len': ""};
	
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
		//console.log("Breath Onset");
		isBreathOn = true;
		breathOnsetTime = currTime;
	}	

	// ############################################################
	// Breath pause is confirmed at this point (with this condition)
	// ############################################################
	if ( ((currTime - breathOnsetTime) >= minSilDur) && (isBreathOn == true) && (validNoteDurDetected == false)){
		// we treat silence as a musical symbol and push it
		//console.log("Breath note validation");
		var note = {name:'', start: -1, end:-1 , duration:0, num:-1};
		note.num = 12;
		note.start = breathOnsetTime;
		note.end = currTime;
		note.duration = note.end-note.start;
		var isPrevNoteSame = false;
		// pushing silence symbol in noteBuffer and symbolBuffer
		if (firstNoteDetected == true){
				isPrevNoteSame = isLastNoteSame(noteBuffer, note);	
			}
		if (isPrevNoteSame == false){
			noteBuffer.push(note);
			symbolBuffer.push(svaras[note.num]);	
			updateTranscriptionDisplay();
		}
		validNoteDurDetected = true;
	}

	// ############################################################
	// Breath Offset
	// ############################################################
	if (currNoteNum != 12 && prevNoteNum == 12){
		//console.log("Breath Offset");
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
		//console.log("Note Onset");
		isNoteOn = true;
		noteOnsetTime =currTime;
		validNoteDurDetected = false;
	}

	// ############################################################
	// At this point a note qualifies a minimum note duration
	// ############################################################
	if (isNoteOn == 1 && ((currTime- noteOnsetTime) > minNoteDur) && validNoteDurDetected == false){
		//console.log("Note duration verified");
		var note = {name:'', start: -1, end:-1 , duration:0, num:-1};
		note.num = currNoteNum;
		note.start = noteOnsetTime;
		note.end = currTime;
		note.duration = note.end-note.start;
		// pushing silence symbol in noteBuffer and symbolBuffer
		var isPrevNoteSame = false;
		// pushing silence symbol in noteBuffer and symbolBuffer
		if (firstNoteDetected == true){
				isPrevNoteSame = isLastNoteSame(noteBuffer, note);	
			}
		if (isPrevNoteSame == false){
			noteBuffer.push(note);
			symbolBuffer.push(svaras[note.num]);	
			updateTranscriptionDisplay();
			out = get_phrases();
			symLen = symbolBuffer.length;
			if (symLen >=2 ){
				svarCurrent = svaras2Num[symbolBuffer[symLen-1]];
				svarPrev = svaras2Num[symbolBuffer[symLen-2]];
				getRaga4Svara(svarCurrent);
				getRaga4Transition(svarCurrent, svarPrev);	
			}
			if (out.status == true){
				getRaga4Phrase(out['4len']);
				getRaga4Phrase(out['3len']);
			}
			updateRagaConf();
			drawHist(raga_conf, raga_color);
			// for (var pp in thaat_info){
			// 	for (var ll in thaat_info[pp]){
			// 		console.log(pp, thaat_info[pp][ll]['common_name'], thaat_info[pp][ll]['likelihood']);
			// 	}
			// }
		}
		validNoteDurDetected = true;
	}

	// ############################################################
	// Detecting note offset
	// ############################################################
	if (prevNoteNum != currNoteNum && isNoteOn ==1){
		isNoteOn = false;
		if (validNoteDurDetected == true){			
			//console.log("Note Offset");
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
