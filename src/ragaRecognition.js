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
function getRaga4Svara(svara){
    console.log(raga_indexes['svars']);
    for (var ii in raga_indexes['svars'][svara]){
        raga_uuid = raga_indexes['svars'][svara][ii]['uuid']
        thaat_info[raga_info[raga_uuid]['thaat']][raga_uuid]['likelihood']+=raga_indexes['svars'][svara][ii]['weight']
        //console.log("raga for svara", svara, raga_indexes['svars'][svara][ii]['common_name'], raga_indexes['svars'][svara][ii]['weight']);    
    }
}

function getRaga4Transition(svaraCurr, svaraPrev){
    for (var ii in raga_indexes['transitions'][svaraCurr][svaraPrev]){
        raga_uuid = raga_indexes['transitions'][svaraCurr][svaraPrev][ii]['uuid']
        thaat_info[raga_info[raga_uuid]['thaat']][raga_uuid]['likelihood']+= raga_indexes['transitions'][svaraCurr][svaraPrev][ii]['weight']
        //console.log("raga for svara", svaraCurr, svaraPrev, raga_indexes['transitions'][svaraCurr][svaraPrev][ii]['common_name'], raga_indexes['transitions'][svaraCurr][svaraPrev][ii]['weight']);    
    }
}

function getRaga4Phrase(phrase){
    if (phrase in raga_indexes['phrases']){
        for (var kk in raga_indexes['phrases'][phrase]){
            raga_uuid = raga_indexes['phrases'][phrase][kk]['uuid']
            thaat_info[raga_info[raga_uuid]['thaat']][raga_uuid]['likelihood']+= raga_indexes['phrases'][phrase][kk]['weight']
            //console.log("raga for phrase", phrase, raga_indexes['phrases'][phrase][kk]['common_name']);
        }
        
    }
    
}