Array.max = function( array ){
    return Math.max.apply( Math, array );
};

//Circular buffer to store float32
var createRingBuffer = function(length){
	var pointer = 0, buffer = new Float32Array(length), bufferLin = new Float32Array(length);
	for (var ii =0; ii<length; ii++){
		buffer[ii]=0;
		buffer[ii]=0;
	} 
  	return {
		    get  : function(key){return buffer[key];},
		    push : function(item){
		    buffer[pointer] = item;
		    pointer = (length + pointer +1) % length;
		    },
		    get_buff: function(){return buffer;},
		    copyLinBuff: function(){
		    	for (var ii=0; ii<length; ii++ ){
		    		bufferLin[ii] = buffer[(ii+pointer)%length];
		    	}
		    },
		    getLinBuff: function(key){return bufferLin;}
  };
};
function mod(i, i_max) {
   return ((i % i_max) + i_max) % i_max;
}

//Circular buffer to store notes
var createRingBuffer_obj = function(length){
	var pointer = 0, buffer = []; 
  	return {
		    get  : function(key){return buffer[mod(key, length)];},
		    set  : function(key, val){return buffer[mod(key, length)]=val;},
		    push : function(item){
		    buffer[pointer] = item;
		    pointer = mod((length + pointer +1), length);
	    	},
	    	get_length: function(){return buffer.length;},
	    	get_buff: function(){return buffer;},
	    	get_pointer: function(){return pointer;}
  };
};

function interpolate_cubic(leftVal, middleVal, rightVal, currentBin){
  var delta_x = 0.5*((leftVal - rightVal)/(leftVal - 2*middleVal + rightVal));
  resultBin = currentBin + delta_x;
  return resultBin
}