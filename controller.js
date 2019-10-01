var lock = false;

function handleStart(obj) {
  document.getElementById("container-GUI").style.display = "none";
  document.getElementById("congkakContainer").style.display = "block";
  
  let difficulty = "easy-peasy";
  let elements = document.getElementsByName("difficulty");
  for (let i=0; i<elements.length; i++) {
    if (elements[i].checked) {
      difficulty = elements[i].value;
      break;
    }
  }

  startGame(congkakContainer, obj.id, difficulty);
}

function resumeGameExecution() {
  let selected;

  if (gameState.turn === 1) {
    selected = gameState.player1SelectedVillage;
    gameState.player1SelectedVillage = -1;
  } else if (gameState.turn === 2) {
    selected = gameState.player2SelectedVillage;
    gameState.player2SelectedVillage = -1;
  }

  CongkakBoard.sendMove(gameState, selected);
}

function startGame(congkakContainer, mode, difficulty) {
  if (mode === "playerVSplayer") {
    gameState.player[0] = new Human();
    gameState.player[1] = new Human();
  } else if (mode === "playerVSbotrandom") {
    gameState.player[0] = new Human();
    gameState.player[1] = new BotRandom();
  } else if (mode === "playerVSbotai") {
    gameState.player[0] = new Human();
    gameState.player[1] = new BotAI(difficulty);
  } else if (mode === "botrandomVSbotai") {
    gameState.player[0] = new BotRandom();
    gameState.player[1] = new BotAI(difficulty);
  }

  function reverseState(state) {
    let newState = {
      'player1': {
        'home': state.player2.home,
        'villages': []
      },
      'player2': {
        'home': state.player1.home,
		    'villages': []
      }
    }

    for (let i=0; i<7; i++) {
      newState.player1.villages.push(state.player2.villages[i])
      newState.player2.villages.push(state.player1.villages[i])
    }

    return newState;
  }

  let nIntervBotListener = setInterval(() => {
    if (!gameState.isEndGame && !lock && gameState.turn === 1 && gameState.player[0].type === "bot") {  // bot random gerak
      lock = true;
      gameState.player1SelectedVillage = gameState.player[0].move(gameState.congkakState)
      resumeGameExecution()
    } else if (!gameState.isEndGame && !lock && gameState.turn === 2  && (gameState.player[1].type === "bot" || gameState.player[1].type === "bot")) {
      lock = true;
      gameState.player2SelectedVillage = gameState.player[1].move(reverseState(gameState.congkakState))
      resumeGameExecution()
    }

    if (gameState.isEndGame) {
      clearInterval(nIntervBotListener);
    }
  }, 1000);

  var villagesConfig = CongkakBoard.villagesConfig;


  congkakContainer.addEventListener('click', function(event) {
    function isAHoleSelected(villages, x, y) {
      for (let i=0; i<7; i++) {
        const vill = villages[i];
        if (Math.sqrt(Math.pow(x-vill.x, 2) + Math.pow(y-vill.y, 2)) <= vill.radius) {
          return i;
        }
      }

      return -1;
    }

    let selectedVillage = -1;

    const x = event.pageX - congkakContainer.offsetLeft,
          y = event.pageY - congkakContainer.offsetTop;
    if (!gameState.isEndGame && !lock && gameState.turn === 1 && gameState.player[0].type === "human") { // player 1 turn
      selectedVillage = isAHoleSelected(villagesConfig['player1'], x, y);
      if (selectedVillage !== -1 && gameState.congkakState['player1']['villages'][selectedVillage] > 0) {
        lock = true;
        gameState.player1SelectedVillage = selectedVillage;
        resumeGameExecution();
      }
    } else if (!gameState.isEndGame && !lock && gameState.turn === 2 && gameState.player[1].type === "human") {  // player 2 turn
      selectedVillage = isAHoleSelected(villagesConfig['player2'], x, y);
      if (selectedVillage !== -1 && gameState.congkakState['player2']['villages'][selectedVillage] > 0) {
        lock = true;
        gameState.player2SelectedVillage = selectedVillage;
        resumeGameExecution();
      }
    }
  }); 
}

