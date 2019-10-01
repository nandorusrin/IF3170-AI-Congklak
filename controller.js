// var gameState = {
//   turn: 1,
//   congkakState: {},
//   gameMode: '',
//   player1: Object,
//   player2: Object,
//   dynamic: {
//     player1SelectedVillage: -1,
//     player2SelectedVillage: -1,
//   }
// }

function handleStart(obj) {
  document.getElementById("container-GUI").style.display = "none";
  document.getElementById("congkakContainer").style.display = "block";
  startGame(congkakContainer, obj.id);
}

function updateGameStatusText() {
  assert(gameState.turn === 1 || gameState.turn === 2)
  let newStatus = 'Player ' + gameState.turn + ': ';
  if (gameState.player[gameState.turn-1].type === 'human') {
    newStatus += 'Human turn'
  } else if (gameState.player[gameState.turn-1].type === 'botrandom') {
    newStatus += 'Bot Random turn'
  } else if (gameState.player[gameState.turn-1].type === 'botai') {
    newStatus += 'Bot AI turn'
  }
}

function resumeGameExecution() {
  let selected;

  console.log(gameState)
  if (gameState.turn === 1) {
    selected = gameState.player1SelectedVillage;
    gameState.player1SelectedVillage = -1;
  } else if (gameState.turn === 2) {
    selected = gameState.player2SelectedVillage;
    gameState.player2SelectedVillage = -1;
  }
  updateGameStatusText()

  CongkakBoard.sendMove(gameState, selected);
}

function startGame(congkakContainer, mode) {
  if (mode === "playerVSplayer") {
    gameState.gameMode = 'playerVSplayer'
    gameState.player[0] = new Human();
    gameState.player[1] = new Human();
  } else if (mode === "playerVSbotrandom") {
    gameState.gameMode = 'playerVSbotrandom'
    gameState.player[0] = new Human();
    gameState.player[1] = new BotRandom();
  } else if (mode === "playerVSbotai") {
    gameState.gameMode = 'playerVSbotai'
    gameState.player[0] = new Human();
    gameState.player[1] = new BotAI();
  } else if (mode === "botrandomVSbotai") {
    gameState.gameMode = 'botrandomVSbotai'
    gameState.player[0] = new BotRandom();
    gameState.player[1] = new BotAI();
  }

  let nIntervBotListener = setInterval(() => {
    if (gameState.turn === 1 && gameState.player[0].type === "botrandom") {  // bot random gerak
      gameState.player1SelectedVillage = gameState.player[0].move(gameState.congkakState)
      resumeGameExecution()
    } else if (gameState.turn === 2  && (gameState.player[1].type === "botrandom" || gameState.player[1].type === "botai")) {
      gameState.player2SelectedVillage = gameState.player[1].move(gameState.congkakState)
      resumeGameExecution()
    }
  }, 1000);

  var villagesConfig = CongkakBoard.villagesConfig;



  congkakContainer.addEventListener('click', function(event) {
    function isAHoleSelected(villages, x, y) {
      assert(x >= 0 && y >= 0);
      assert(villages && villages.length === 7);
      for (let i=0; i<7; i++) {
        const vill = villages[i];
        // console.log(vill)
        if (Math.sqrt(Math.pow(x-vill.x, 2) + Math.pow(y-vill.y, 2)) <= vill.radius) {
          return i;
        }
      }

      return -1;
    }

    let selectedVillage = -1;

    const x = event.pageX - congkakContainer.offsetLeft,
          y = event.pageY - congkakContainer.offsetTop;
    if (gameState.turn === 1 && gameState.player[0].type === "human") { // player 1 turn
      selectedVillage = isAHoleSelected(villagesConfig['player1'], x, y);
      if (selectedVillage !== -1 && gameState.congkakState['player1']['villages'][selectedVillage] > 0) {
        gameState.player1SelectedVillage = selectedVillage;
        resumeGameExecution();
      }
    } else if (gameState.turn === 2 && gameState.player[1].type === "human") {  // player 2 turn
      selectedVillage = isAHoleSelected(villagesConfig['player2'], x, y);
      if (selectedVillage !== -1 && gameState.congkakState['player2']['villages'][selectedVillage] > 0) {
        gameState.player2SelectedVillage = selectedVillage;
        resumeGameExecution();
      }
    }
  }); 

  // player1.move();
  // gameOver = CongkakBoard.checkGameOver();
  // player2.move();
  // gameOver = CongkakBoard.checkGameOver();
}

