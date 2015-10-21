
//Circular buffer to store notes
var createRingBuffer_obj = function(length){
	var pointer = 0, buffer = []; 
  	return {
		    get  : function(key){return buffer[key];},
		    push : function(item){
		    buffer[pointer] = item;
		    pointer = (length + pointer +1) % length;
	    	}
  };
};


//Crucial parameters
var min_note_dur = 0.3;
var max_gap_allwd = 0.1;
var note_buff_len = 10; //number of past notes to store
var last_frame_pitch = -1;
var time_start = -1;
var time_end = -1;
var note_start = 0;


//initializations
var note = {name:'', start: -1, end:-1 , duration:0, num:-1};
var note_buffer = createRingBuffer_obj(note_buff_len);


	
function transcribe_note(curr_pitch){
	//This function performs the note transcription 
	//we expect the input curr_pitch in cents.
	
	// finding the note number corresponding to the input pitch
	note_num = -1;
	if (curr_pitch != -1){
		var note_num = Math.round(curr_pitch/100.0)%12;
	}

	//onset of a note
	if (last_frame_pitch == note_num && note_start==0 && note_num != -1){
		note_start=1;
		var date = new Date();
		time_start = date.getTime()/1000.0;
		console.log("Onset", time_start);
	}
	//stable region of a note
	if (last_frame_pitch == note_num && note_start == 1){

	}

	//offset of a note
	if (last_frame_pitch != note_num && note_start ==1){
		var date = new Date();
		console.log("Offset", date.getTime()/1000.0, last_frame_pitch);
		if (date.getTime()/1000.0 - time_start > min_note_dur){
			note.num = last_frame_pitch;
			note.start = time_start;
			note.end = date.getTime()/1000.0;
			note.duration = note.end-note.start;
			note_buffer.push(note)
			console.log(note_buffer.get(0));

		}	
		
		note_start=0;
	}
	
	//console.log(last_frame_pitch, note_num);
	last_frame_pitch = note_num;

}