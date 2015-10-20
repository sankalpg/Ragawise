Array.max = function( array ){
    return Math.max.apply( Math, array );
};

//Circular buffer to store notes
var createRingBuffer = function(length){
	var pointer = 0, buffer = new Float32Array(length); 
  	return {
		    get  : function(key){return buffer[key];},
		    push : function(item){
		    buffer[pointer] = item;
		    pointer = (length + pointer +1) % length;
		    },
		    get_buff: function(){return buffer;}
  };
};