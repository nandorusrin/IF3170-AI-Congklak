let states = {
	'player1': {
		'home': 0,
		'villages': Array(7).fill(12)
	}, 
	'player2': {
		'home': 0,
		'villages': Array(7).fill(12)
	}
}

let bobot = {
	homeplayer1 : 10,
	homeplayer2 : 10,
	selisihvillage : 1
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

function evaluationScore(states) {
	// shortcut
	var homeplayer1 = states.player1.home;
	var homeplayer2 = states.player2.home;
	var villagesplayer1 = states.player1.villages;
	var villagesplayer2 = states.player2.villages;
	var selisihvillage12 = villagesplayer1.reduce((acc, a) => (acc + a), 0) - villagesplayer2.reduce((acc, a) => (acc + a), 0); 
	// nilai evaluasi
	var evaluationSum = (homeplayer1 * bobot.homeplayer1) - (homeplayer2 * bobot.homeplayer2) + (selisihvillage12 * bobot.selisihvillage);
	//console.log(evaluationSum);
	return evaluationSum;
}

/*function generateAllStates(states) {
	var villagesplayer1 = states.player1.villages;
	var listOfStates = {};
	for (var i = 0; i < 7; i++) {
		if (villagesplayer1[i] !== 0) {
			listOfStates[i] =  nextState(states, i);
			//console.log(evaluationScore(listOfStates[i]));
		}
	}
	return listOfStates;
}*/

function nextStateEnemy(currState, idx){
	//console.log(JSON.stringify(currState))
	var hand = 0;
	var round = false;
	var pointer = idx;
	var side = 2;

	var newState = JSON.parse(JSON.stringify(currState));

	hand = newState.player2.villages[idx];
	newState.player2.villages[idx] = 0;
	while (hand > 0) {
		// gerak 
		if (pointer === 7) {
			side = 1;
			pointer = 6;
		} else if (side === 2) {
			pointer++;
		} else {
			//pindah side dari 1 --> 2
			if (pointer === 0) {
				round = true;
				side = 2;
			} else {
				pointer--;
			}
		}

		hand--;
		// di dalam home
		if (pointer === 7) {
			newState.player2.home++;
		}
		else if (side === 2) {
			newState.player2.villages[pointer]++;
		} else {
			newState.player1.villages[pointer]++;
		}
		//
		if (hand === 0) {
			if (newState['player' + side].villages[pointer] > 1) {
				hand = newState['player' + side].villages[pointer];
				newState['player' + side].villages[pointer] = 0;
			}
		}
		//console.log(JSON.stringify(newState), hand, pointer, side);
	}

	if (side === 2 && pointer < 7 && newState['player'+side].villages[pointer] === 1 && newState['player1'].villages[pointer] > 0){
		newState['player2'].home += newState['player1'].villages[pointer] + newState['player2'].villages[pointer];
		newState['player2'].villages[pointer] = 0;
		newState['player1'].villages[pointer] = 0;

	}
	//console.log(JSON.stringify(newState));
	return newState;
}

function nextStatePlayer(currState, idx) {
	//console.log(JSON.stringify(currState))
	var hand = 0;
	var round = false;
	var pointer = idx;
	var side = 1;

	var newState = JSON.parse(JSON.stringify(currState));

	hand = newState.player1.villages[idx];
	newState.player1.villages[idx] = 0;
	while (hand > 0) {
		// gerak 
		if (pointer === (-1)) {
			side = 2;
			pointer = 0;
		} else if (side === 1) {
			pointer--;
		} else {
			//pindah side dari 2 --> 1
			if (pointer === 6) {
				round = true;
				side = 1;
			} else {
				pointer++;
			}
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
		//
		if (hand === 0) {
			if (newState['player' + side].villages[pointer] > 1) {
				hand = newState['player' + side].villages[pointer];
				newState['player' + side].villages[pointer] = 0;
			}
		}
		//console.log(JSON.stringify(newState), hand, pointer, side);
	}

	if (side === 1 && pointer >= 0 && newState['player'+side].villages[pointer] === 1 && newState['player2'].villages[pointer] > 0){
		newState['player1'].home += newState['player2'].villages[pointer] + newState['player1'].villages[pointer];
		newState['player1'].villages[pointer] = 0;
		newState['player2'].villages[pointer] = 0;

	}
	//console.log(JSON.stringify(newState));


	return newState;
}
function isTerminalState(states) {
	return (states.player1.villages.reduce((acc, a) => (acc + a), 0) === 0 || 
					states.player2.villages.reduce((acc, a) => (acc + a), 0) === 0
	);
}

var j = 0;
var pruneCount = 0;
function alphaBetaDecision(state) {
	var alpha = Number.NEGATIVE_INFINITY;
	var beta = Number.POSITIVE_INFINITY;
	let savedIdx;
	let v = Number.NEGATIVE_INFINITY;
	j += 1;
	let depth = 1;
	for (let i=0; i<7; i++) {
		nextState = nextStatePlayer(state, i);
		temp = minValue(nextState, alpha, beta, depth);
		if (temp > v) {
			savedIdx = i;
			//console.log('savedindex', i);
		}
		v = Math.max(v, temp);
		//console.log(alpha, beta);
	}
	return savedIdx;
}
function maxValue(state, alpha, beta, depth) {
	// for (let j=0; j<depth; j++) {
	// 	console.log("y")
	// }
	j += 1;
	if (isTerminalState(state) || depth === 0) {
		//console.log(alpha, " ", beta);
		return evaluationScore(state);
	}
	let v = Number.NEGATIVE_INFINITY;
	for (let i=0; i<7; i++) {
		if (state.player1.villages[i] > 0) {
			nextState = nextStatePlayer(state, i)
			
			v = Math.max(v, minValue(nextState, alpha, beta, depth-1));
			if (v >= beta){
				pruneCount += 1;
				return v;
			}
			alpha = Math.max(alpha, v);
		}
	}

	return v;
}

function minValue(state, alpha, beta, depth) {
	// for (let j=0; j<depth; j++) {
	// 	console.log("x")
	// }
	j += 1;
	if (isTerminalState(state) || depth === 0) {
		//console.log(alpha, " ", beta);
		return evaluationScore(state);
	}
	let v = Number.POSITIVE_INFINITY;
	for (let i=0; i<7; i++) {
		if (state.player2.villages[i] > 0) {
			nextState = nextStateEnemy(state, i);
			// j += 1;
			v = Math.min(v, maxValue(nextState, alpha, beta, depth-1));
			if (v <= alpha){
				pruneCount += 1;
				return v;
			}
			beta = Math.min(beta, v);
		}
	}

	return v;
}

console.log(alphaBetaDecision(states));
console.log(j);
console.log("prune Count : ", pruneCount);
// test all functio
//console.log(randomMove(states));
//console.log(aiMove(states));
//console.log("eval ",evaluationScore(states));
//nextState(states, 6);
