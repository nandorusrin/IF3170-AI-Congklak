// var gameState = {
//   turn: 1,
//   congkakState: {},
//   textStatus: '',
//   gameMode: '',
//   player1: Object,
//   player2: Object,
//   dynamic: {
//     player1SelectedVillage: -1,
//     player2SelectedVillage: -1,
//   }
// }

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

function startGame(congkakContainer, mode="playerVSplayer") {

  if (mode === "playerVSplayer") {
    gameState.gameMode = 'playerVSplayer'
    gameState.player[0] = new Human(communication.player1Interface);
    gameState.player[1] = new Human(communication.player2Interface);
    gameState.textStatus = 'Player 1: Human turn'
  } else if (mode === "playerVSbotrandom") {
    gameState.gameMode = 'playerVSbotrandom'
    gameState.player[0] = new Human(communication.player1Interface);
    gameState.player[1] = new BotRandom(communication.player2Interface);
    gameState.textStatus = 'Player 1: Human turn'
  } else if (mode === "playerVSbotai") {
    gameState.gameMode = 'playerVSbotai'
    gameState.player[0] = new Human(communication.player1Interface);
    gameState.player[1] = new BotAI(communication.player2Interface);
    gameState.textStatus = 'Player 1: Human turn'
  } else if (mode === "botrandomVSbotai") {
    gameState.gameMode = 'botrandomVSbotai'
    gameState.player[0] = new BotRandom(communication.player1Interface);
    gameState.player[1] = new BotAI(communication.player2Interface);
    gameState.textStatus = 'Player 1: Bot Random Turn'
  }

  var villagesConfig = CongkakBoard.villagesConfig;

  congkakContainer.addEventListener('click', function(event) {
    function isAHoleSelected(villages, x, y) {
      assert(x >= 0 && y >= 0);
      assert(villages && villages.length === 7);
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
    if (gameState.turn === 1) { // player 1 turn
      selectedVillage = isAHoleSelected(villagesConfig['player1'], x, y);
      if (selectedVillage !== -1 && gameState.congkakState['player1']['villages'][selectedVillage] > 0) {
        gameState.player1SelectedVillage = selectedVillage;
        resumeGameExecution();
      }
    } else if (gameState.turn === 2) {  // player 2 turn
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

