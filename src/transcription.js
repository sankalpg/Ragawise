



//Crucial parameters
var min_note_dur = 0.2;
var max_gap_allwd = 0.1;
var note_buff_len = 10; //number of past notes to store
var last_frame_pitch = -1;
var time_start = -1;
var time_end = -1;
var note_start = 0;
var tonic = 55.0;
var note_threshold_in = 30;	// in cents
var note_threshold_out = 50;	// in cents
var tshld;
var long_pause_dur = .5;
var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
var svaras = ['S', 'r', 'R', 'g', 'G', 'm', 'M', 'P', 'd', 'D', 'n', 'N']
var phrase_bet_breath = [];
var breath_offset;
var breath_on = true;


//initializations
var note = {name:'', start: -1, end:-1 , duration:0, num:-1};
var note_buffer = createRingBuffer_obj(note_buff_len);

function setTonic(val){
    tonic = val/2.0;
    console.log(tonic);
}
	
function transcribe_note(curr_pitch){
	//This function performs the note transcription 
	//we expect the input curr_pitch in cents.
	var closest_note;
	var date = new Date();
	var curr_time = date.getTime()/1000.0;
	// finding the note number corresponding to the input pitch
	note_num = -1;
	if (curr_pitch != -1){
		closest_note = 100*(Math.round(curr_pitch/100.0));
		diff = (curr_pitch - closest_note);
		if (note_start ==0){
			tshld = note_threshold_in;
		}
		else{
			tshld = note_threshold_out;
		}
		if (diff <tshld ){
			note_num = (closest_note/100.0)%12;
		}
	}
	if (curr_time - breath_offset > long_pause_dur && breath_on){
		phrase_bet_breath.push("---")
		$('#note_val_curr').text(phrase_bet_breath.join(" "));
		breath_on = false;
	}

	//NOTE ONSET
	// if its not a unvoiced frame (note_num != -1)
	// if last frame's pitch is equal to current frame's pitch (two frame with the same pitch)
	// and if the note hasn't started
	//Then go in
	if (note_num != -1 && last_frame_pitch == note_num && note_start==0){
		note_start=1;
		var date = new Date();
		time_start =curr_time;
		console.log("Onset", time_start);
		breath_on = false;
		
	}

	//stable region of a note
	if (note_start == 1 && last_frame_pitch == note_num){
		//console.log("NOTE STABLE",note_num);
		//$('#note_val_curr').text(svaras[note_num]);
	}

	//offset of a note
	if (last_frame_pitch != note_num && note_start ==1){
		console.log("Offset", curr_time, last_frame_pitch);
		if (curr_time - time_start > min_note_dur){
			note.num = last_frame_pitch;
			note.start = time_start;
			note.end = curr_time;
			note.duration = note.end-note.start;
			note_buffer.push(note);
			phrase_bet_breath.push(svaras[last_frame_pitch]);
		}
		
		breath_offset = curr_time;	
		breath_on = true;
		note_start=0;
	}
	
	//console.log(last_frame_pitch, note_num);
	last_frame_pitch = note_num;

}