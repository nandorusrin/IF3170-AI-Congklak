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

let bobot = {
	homeplayer1 : 10,
	homeplayer2 : 10,
	selisihvillage : 5
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
	// shortcut
	var villages = states.player1.villages;
	// array for indeks of indeks==isi villages
	var heurs1 = new Array();
	var i;
	// CASE 1 : ISI = INDEKS(1..7)
	// search for indeks non-empty
	for (i = 0; i < states.player1.villages.length; i++) {
		// isi == indeks + 1
		if (villages[i] === (i + 1)) {
			heurs1.push(i);
		}
	}
	// test indeks non-empty
	console.log(heurs1);
	// generate random indeks non-empty
	var random = Math.floor(Math.random() * heurs1.length);
	// return
	return heurs1[random];
}

function evalutionScore(states) {
	// shortcut
	var homeplayer1 = states.player1.home;
	var homeplayer2 = states.player2.home;
	var villagesplayer1 = states.player1.villages;
	var villagesplayer2 = states.player2.villages;
	var selisihvillage12 = villagesplayer1.reduce((acc, a) => (acc + a), 0) - villagesplayer2.reduce((acc, a) => (acc + a), 0); 
	// nilai evaluasi
	var evaluationSum = (homeplayer1 * bobot.homeplayer1) - (homeplayer2 * bobot.homeplayer2) + (selisihvillage12 * bobot.selisihvillage);
	console.log(evaluationSum);
	return evaluationSum;
}

function generateAllStates(states) {
	var villagesplayer1 = states.player1.villages;
	var listOfStates = [];
	for (var i = 0; i < 7; i++) {
		if (villagesplayer1[i] !== 0) {
			listOfStates.append(nextState(states, i));
		}
	}
}

function nextState(currState, idx) {
	var hand = 0;
	var pointer = idx;
	var side = 1;

	var newState = JSON.parse(JSON.stringify(currState));

	hand = newState.player1.villages[idx];
	newState.player1.villages[idx] = 0;
	while (hand > 0) {
		// gerak 
		if (side === 1) {
			pointer--;
		} else {
			pointer++;
		}
		hand--;
		// di dalam home
		if (pointer === (-1)) {
			newState.player1.home++;
		}
		else if (side === 1) {
			newState.player1.villages[pointer]++;
		} else {
			newState.player2.villages[pointer]++;
		}
	console.log(newState);
	}
}

// test all function
console.log(randomMove(states));
console.log(aiMove(states));
console.log("eval ",evalutionScore(states));
nextState(states, 6);