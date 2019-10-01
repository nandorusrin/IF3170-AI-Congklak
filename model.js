class Player {
  move() {
    // move function prototype
  }
}

class Human extends Player {
  constructor () {
    super()
    this.type = 'human';
  }
}

class Bot extends Player {
  constructor () {
    super()
    this.type = "bot"
  }
}

class BotRandom extends Bot {
  constructor () {
    super()
  }

  move(states) {
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
    // console.log(pickVillages);
    // generate random indeks non-empty
    var random = Math.floor(Math.random() * pickVillages.length);
    // return
    // console.log(pickVillages[random])
    return pickVillages[random];
  }
}

function evaluationScore(states) {
  const bobot = {
    homeplayer1 : 10,
    homeplayer2 : 10,
    selisihvillage : 1
  }
  
  // shortcut
  var homeplayer1 = states.player1.home;
  var homeplayer2 = states.player2.home;
  var villagesplayer1 = states.player1.villages;
  var villagesplayer2 = states.player2.villages;
  var selisihvillage12 = villagesplayer1.reduce((acc, a) => (acc + a), 0) - villagesplayer2.reduce((acc, a) => (acc + a), 0); 

  // let positionalScore = 0
  // for (let i=0; i<7; i++) {
  //   positionalScore += (!villagesplayer1[i]) ? ((7-i) * -1) : 0;
  //   positionalScore += (!villagesplayer2[i]) ? i : 0;
  // }

  // nilai evaluasi
  var evaluationSum = (homeplayer1 * bobot.homeplayer1) - (homeplayer2 * bobot.homeplayer2) + (selisihvillage12 * bobot.selisihvillage) // + positionalScore 
  //console.log(evaluationSum);
  return evaluationSum;
}


function nextStateEnemy(currState, idx){
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

  if (side === 2 && pointer < 7 && newState['player'+side].villages[pointer] === 1 && newState['player1'].villages[pointer] > 0 && round){
    newState['player2'].home += newState['player1'].villages[pointer] + newState['player2'].villages[pointer];
    newState['player2'].villages[pointer] = 0;
    newState['player1'].villages[pointer] = 0;

  }
  //console.log(JSON.stringify(newState));
  return newState;
}

function nextStatePlayer(currState, idx) {
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
    if (hand === 0) {
      if (newState['player' + side].villages[pointer] > 1) {
        hand = newState['player' + side].villages[pointer];
        newState['player' + side].villages[pointer] = 0;
      }
    }
  }

  if (side === 1 && pointer >= 0 && newState['player'+side].villages[pointer] === 1 && newState['player2'].villages[pointer] > 0 && round){
    newState['player1'].home += newState['player2'].villages[pointer] + newState['player1'].villages[pointer];
    newState['player1'].villages[pointer] = 0;
    newState['player2'].villages[pointer] = 0;
  }

  return newState;
}


function isTerminalState(states) {
  return (states.player1.villages.reduce((acc, a) => (acc + a), 0) === 0 || 
          states.player2.villages.reduce((acc, a) => (acc + a), 0) === 0
  );
}

function alphaBetaDecision(state, maxDepth) {
  var alpha = Number.NEGATIVE_INFINITY;
  var beta = Number.POSITIVE_INFINITY;
  let v = Number.NEGATIVE_INFINITY;
  
  let depth = maxDepth;
  var savedIdx;
  for (let i=0; i<7; i++) {
    if (state.player1.villages[i] > 0) {
      let nextState = nextStatePlayer(state, i);
      
      // pake min
      let temp = minValue(nextState, alpha, beta, depth);
      // pake max
      // let temp = maxValue(nextState, alpha, beta, depth);
      if (temp > v) {
        savedIdx = i;
      }
      
      v = Math.max(v, temp);
    }
  }
  // console.log("isi savedIdx:", savedIdx)
  return savedIdx;
}

function maxValue(state, alpha, beta, depth) {
  if (isTerminalState(state) || depth === 0) {
    return evaluationScore(state);
  }
  let v = Number.NEGATIVE_INFINITY;
  for (let i=0; i<7; i++) {
    if (state.player1.villages[i] > 0) {
      let nextState = nextStatePlayer(state, i)
      // console.log('isi v', v)
      v = Math.max(v, minValue(nextState, alpha, beta, depth-1));
      if (v >= beta){
        return v;
      }
      alpha = Math.max(alpha, v);
    }
  }

  return v;
}

function minValue(state, alpha, beta, depth) {
  if (isTerminalState(state) || depth === 0) {
    return evaluationScore(state);
  }
  
  let v = Number.POSITIVE_INFINITY;
  for (let i=0; i<7; i++) {
    if (state.player2.villages[i] > 0) {
      let nextState = nextStateEnemy(state, i);
      v = Math.min(v, maxValue(nextState, alpha, beta, depth-1));
      if (v <= alpha){
        return v;
      }
      beta = Math.min(beta, v);
    }
  }

  return v;
}

class BotAI extends Bot {
  constructor (difficulty) {
    super()
    this.difficulty = 0;
    if (difficulty === "easy") {
      this.difficulty = 1;
    } else if (difficulty === "medium") {
      this.difficulty = 3;
    } else if (difficulty === "hard") {
      this.difficulty = 5;
    }
  }

  move(states) {
    const decision = alphaBetaDecision(states, this.difficulty);
    return decision
  }
}

