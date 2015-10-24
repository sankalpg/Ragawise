//Global variables
var raga_info;
var thaat_info
var raga_indexes;

//Loading needed data for raga recognition
// fetching dictionary of sounds
var getRagaInfo = new XMLHttpRequest();
getRagaInfo.open("GET", "http://127.0.0.1:5000/get_raga_info", true);
getRagaInfo.send();
getRagaInfo.onreadystatechange = function() {
    if (getRagaInfo.readyState == 4 && getRagaInfo.status == 200) {
        raga_info = JSON.parse(getRagaInfo.responseText);
    }
}

// fetching dictionary of sounds
var getThaatInfo = new XMLHttpRequest();
getThaatInfo.open("GET", "http://127.0.0.1:5000/get_thaat_info", true);
getThaatInfo.send();
getThaatInfo.onreadystatechange = function() {
    if (getThaatInfo.readyState == 4 && getThaatInfo.status == 200) {
        thaat_info = JSON.parse(getThaatInfo.responseText);
    }
}
	
// fetching dictionary of sounds
var getRagaIndexes = new XMLHttpRequest();
getRagaIndexes.open("GET", "http://127.0.0.1:5000/get_raga_indexes", true);
getRagaIndexes.send();
getRagaIndexes.onreadystatechange = function() {
    if (getRagaIndexes.readyState == 4 && getRagaIndexes.status == 200) {
        raga_indexes = JSON.parse(getRagaIndexes.responseText);
    }
}
