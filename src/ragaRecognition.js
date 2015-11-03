//Global variables
var raga_info;
var thaat_info
var raga_indexes;
var raga_conf;
var raga_color;
//Loading needed data for raga recognition
// fetching dictionary of sounds
var getRagaInfo = new XMLHttpRequest();
getRagaInfo.open("GET", "/ragawise/api/get_raga_info", true);
getRagaInfo.send();
getRagaInfo.onreadystatechange = function() {
    if (getRagaInfo.readyState == 4 && getRagaInfo.status == 200) {
        raga_info = JSON.parse(getRagaInfo.responseText);
    }
}

// fetching dictionary of sounds
var getThaatInfo = new XMLHttpRequest();
getThaatInfo.open("GET", "/ragawise/api/get_thaat_info", true);
getThaatInfo.send();
getThaatInfo.onreadystatechange = function() {
    if (getThaatInfo.readyState == 4 && getThaatInfo.status == 200) {
        thaat_info = JSON.parse(getThaatInfo.responseText);
    }
}
function updateRagaConf(){
    raga_conf = []
    raga_color = []
    var max_conf = -1
    for (thaat in thaat_info){
        for (uuid in thaat_info[thaat]){
            raga_conf.push(thaat_info[thaat][uuid]['likelihood']);
            if (max_conf < thaat_info[thaat][uuid]['likelihood']){
                max_conf = thaat_info[thaat][uuid]['likelihood'];
            }
            raga_color.push(thaat_info[thaat][uuid]['color']);
        }
    }
    if (max_conf > 75){
        for (thaat in thaat_info){
            for (uuid in thaat_info[thaat]){
                thaat_info[thaat][uuid]['likelihood']= thaat_info[thaat][uuid]['likelihood']*50/max_conf;
            }
        }
    }


}
	
// fetching dictionary of sounds
var getRagaIndexes = new XMLHttpRequest();
getRagaIndexes.open("GET", "/ragawise/api/get_raga_indexes", true);
getRagaIndexes.send();
getRagaIndexes.onreadystatechange = function() {
    if (getRagaIndexes.readyState == 4 && getRagaIndexes.status == 200) {
        raga_indexes = JSON.parse(getRagaIndexes.responseText);
    }
}
function getRaga4Svara(svara){
    console.log(raga_indexes['svars']);
    var ragas = []
    var raga_names = []
    for (var ii in raga_indexes['svars'][svara]){
        raga_uuid = raga_indexes['svars'][svara][ii]['uuid']
        thaat_info[raga_info[raga_uuid]['thaat']][raga_uuid]['likelihood']+=0.5*raga_indexes['svars'][svara][ii]['weight']
        ragas.push(raga_uuid);
        //raga_names.push(raga_indexes['svars'][svara][ii]['common_name']);
        //console.log("raga for svara", svara, raga_indexes['svars'][svara][ii]['common_name'], raga_indexes['svars'][svara][ii]['weight']);    
    }
    animateRagas(ragas, 0, 100, 500);
}

function getRaga4Transition(svaraCurr, svaraPrev){
    var ragas = []
    var raga_names = []
    if (svaraCurr in raga_indexes['transitions']){ 
        if (svaraPrev in raga_indexes['transitions'][svaraCurr]){ 
            for (var ii in raga_indexes['transitions'][svaraCurr][svaraPrev]){
                raga_uuid = raga_indexes['transitions'][svaraCurr][svaraPrev][ii]['uuid']
                thaat_info[raga_info[raga_uuid]['thaat']][raga_uuid]['likelihood']+= 1.0*raga_indexes['transitions'][svaraCurr][svaraPrev][ii]['weight']
                ragas.push(raga_uuid);
                //raga_names.push(raga_indexes['transitions'][svaraCurr][svaraPrev][ii]['common_name']);
                //console.log("raga for svara", svaraCurr, svaraPrev, raga_indexes['transitions'][svaraCurr][svaraPrev][ii]['common_name'], raga_indexes['transitions'][svaraCurr][svaraPrev][ii]['weight']);    
            }
        }
    }
    animateRagas(ragas, 1, 100, 700);
}

function getRaga4Phrase(phrase){
    var ragas = []
    var raga_names = []
    if (phrase in raga_indexes['phrases']){
        for (var kk in raga_indexes['phrases'][phrase]){
            raga_uuid = raga_indexes['phrases'][phrase][kk]['uuid']
            thaat_info[raga_info[raga_uuid]['thaat']][raga_uuid]['likelihood']+= 15.0
            ragas.push(raga_uuid);
            //raga_names.push(raga_indexes['phrases'][phrase][kk]['common_name']);
            //console.log("raga for phrase", phrase, raga_indexes['phrases'][phrase][kk]['common_name']);
        }
        
    }
    animateRagas(ragas, 2, 100, 1500);
    
}
