let states = {
	'player1': {
		'home': 0,
		'villages': [7, 7, 7, 7, 7, 7, 7]
		//'villages': [0, 0, 0, 7, 0, 0, 7]
	}, 
	'player2': {
		'home': 0,
		'villages': [7, 7, 7, 7, 7, 7, 7]
	}
}

function randomMove(states) {
	//  shortcut
	var villages = states.player1.villages;
	// array for indeks of non-empty villages
	var pickVillages = new Array();
	var i;
	// search for indeks non-empty
	for (i = 0; i < states.player1.villages.length; i++) {
		if (villages[i] > 0) {
			pickVillages.push(i);
		}
	}
	// test indeks non-empty
	console.log(pickVillages);
	// generate random indeks non-empty
	var random = Math.floor(Math.random() * pickVillages.length);
	// return
	return pickVillages[random];
}

function aiMove(states) {

}

console.log(randomMove(states));