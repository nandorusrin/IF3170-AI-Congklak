function drawCongkakBoard(canvas, ctx) {
  const boardColor = "#0095DD";

  function drawHalfCircle(xOffset, isLeft) {
    ctx.beginPath();

    var x = canvas.width/2 + xOffset; // x coordinate
    var y = canvas.height/2; // y coordinate
    var radius = 60; // Arc radius
    var startAngle = 1.5 * Math.PI; // Starting point on circle
    var endAngle = Math.PI * (1/2); // End point on circle
    var anticlockwise = isLeft; // clockwise or anticlockwise

    ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
    ctx.fillStyle = boardColor;
    ctx.fill();

    ctx.closePath();
  }

  function drawBody(x, y, width, height) {
    ctx.beginPath();

    ctx.fillStyle = boardColor;
    ctx.fillRect(x, y, width, height);

    ctx.closePath();
  }

  function drawHomeHole(isPlayer1) {
    ctx.beginPath();

    
    let xOffset = 200;
    if (!isPlayer1) {
      xOffset = xOffset * -1;
    }

    var x = canvas.width/2 + xOffset; // x coordinate
    var y = canvas.height/2; // y coordinate
    var radius = 35; // Arc radius
    var startAngle = 0; // Starting point on circle
    var endAngle = Math.PI * 2; // End point on circle
    ctx.fillStyle = "#026e99";

    ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise=true);
    ctx.fill();

    ctx.closePath();
  }

  function drawSingleVillageHole(xOffset, yOffset) {
    ctx.beginPath();

    var x = canvas.width/2 + xOffset; // x coordinate
    var y = canvas.height/2 + yOffset; // y coordinate
    var radius = 18; // Arc radius
    var startAngle = 0; // Starting point on circle
    var endAngle = Math.PI * 2; // End point on circle
    ctx.fillStyle = "#006e99";

    ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise=true);
    ctx.fill();

    ctx.closePath();
  }

  function drawVillageHoles(villagesConfigPlayer) {
    for (let i = 1; i <= 7; i++) {
      drawSingleVillageHole((-180 + i * 45), villagesConfigPlayer[i-1].yOffset);
    }
  }

  function setVillageHoles(villagesConfig) {
    for (let i = 1; i <= 7; i++) {
      villagesConfig['player1'][i-1] = {
        x: canvas.width/2 + (-180 + i * 45),
        y: canvas.height/2 + 25,
        radius: 18,
        startAngle: 0,
        endAngle: Math.PI * 2,
        key: i-1,
        yOffset: 25,
      }

      villagesConfig['player2'][7-i] = {
        x: canvas.width/2 + (-180 + i * 45),
        y: canvas.height/2 + (-25),
        radius: 18,
        startAngle: 0,
        endAngle: Math.PI * 2,
        key: i + 6,
        yOffset: -25,
      }
    }
  }

  drawHalfCircle(-200, isLeft=true);
  drawHalfCircle(200, isLeft=false);
  drawBody(canvas.width/2 + -200, canvas.height/2-60, 400, 120);
  drawHomeHole(isPlayer1=true);
  drawHomeHole(isPlayer1=false);
  setVillageHoles(this.villagesConfig);
  drawVillageHoles(this.villagesConfig['player1']);
  drawVillageHoles(this.villagesConfig['player2']);
}

function drawBeans(canvas, ctx) {
  var villageXOffsets = Array(7).fill(0); // 7 items (a village each)
  const defaultXOffset = -135;
  const defaultUserYOffset = 25, defaultEnemyYOffset = -25;
  for (let iter = 0; iter < 7; iter++) {
    villageXOffsets[iter] = (iter === 0 ? (defaultXOffset - 45) : villageXOffsets[iter-1]) + 45;  // distance between village is 45
  }

  function drawIndividualBean(xOffset, yOffset, spreadFactor = 7) {
    var randomIntSign = () => ((Math.random()*100 < 50) ? 1 : -1);

    var x = canvas.width/2 + xOffset + Math.floor(Math.random() * spreadFactor * randomIntSign()); // x coordinate
    var y = canvas.height/2 + yOffset + Math.floor(Math.random() * spreadFactor * randomIntSign()); // y coordinate

    var radius = 4; // Arc radius
    var startAngle = 0; // Starting point on circle
    var endAngle = Math.PI * 2; // End point on circle
    var anticlockwise = true; // clockwise or anticlockwise

    ctx.strokeStyle = "#2b2222";
    ctx.fillStyle = "#6f4e37";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
    ctx.fill();
    ctx.stroke();

    ctx.closePath();
  }

  function drawBeanInVillage(index, quantity, isPlayer1=true) {
    assert(index >= 0 && index <= 6);

    const yOffset = (isPlayer1) ? defaultUserYOffset : defaultEnemyYOffset;
    for (let iter = 0; iter < quantity; iter++) {
      drawIndividualBean(villageXOffsets[index], yOffset);
    }
  }

  function drawBeanInHome(quantity, isPlayer1=true) {
    const xOffset = (isPlayer1) ? -200 : 200;
    for (let iter = 0; iter < quantity; iter++) {
      drawIndividualBean(xOffset, 0, spreadFactor=15);
    }
  }

  for (let iter = 0; iter < 7; iter++) {
    drawBeanInVillage(iter, this.state['player1'].villages[iter], isPlayer1=true);
    drawBeanInVillage(iter, this.state['player2'].villages[6-iter], isPlayer1=false);
  }

  assert(this && this.state && this.state['player1'] && this.state['player2'], "State undefined in drawCounterText()")

  drawBeanInHome(this.state['player1']['home'], isPlayer1=true);
  drawBeanInHome(this.state['player2']['home'], isPlayer1=false);
}

function drawCounterText(canvas, ctx, pointer=-1, side=-1, hand=0) {
  function drawVillageHolesCounter(isPlayer1, numbers) {
    let yOffset = (isPlayer1) ? 58 : -45;
    let xOffset = 0;

    for (let i = 1; i <= 7; i++) {
      ctx.font = '17px arial';
      ctx.fillStyle = "#fcfcfc";
      xOffset = (i >= 10) ? -4 : xOffset;
      if (!isPlayer1) {
        ctx.fillText(numbers[7-i], canvas.width/2 + (-180 + i * 45) - 5 + xOffset, canvas.height/2 + yOffset);
      } else {
        ctx.fillText(numbers[i-1], canvas.width/2 + (-180 + i * 45) - 5 + xOffset, canvas.height/2 + yOffset);
      }
    }
  }

  function drawHomeHoleCounter(isPlayer1, value) {
    let xOffset = 0;
    if (isPlayer1) {
      if (value >= 10) {
        xOffset = 216;
      } else {
        xOffset = 208;
      }
    } else {
      if (value >= 10) {
        xOffset = -184;
      } else {
        xOffset = -192;
      }
    }

    xOffset *= -1;

    ctx.font = '30px arial';
    ctx.fillStyle = "#fcfcfc";
    ctx.fillText(value, canvas.width/2 + xOffset, canvas.height/2 + 10);
  }

  assert(this && this.state && this.state['player1'] && this.state['player2'], "State undefined in drawCounterText()")
  drawVillageHolesCounter(isPlayer1=true, this.state['player1']['villages']);
  drawVillageHolesCounter(isPlayer1=false, this.state['player2']['villages']);

  drawHomeHoleCounter(isPlayer1=true, value=this.state['player1']['home']);
  drawHomeHoleCounter(isPlayer1=false, value=this.state['player2']['home']);

  drawPointer(canvas, ctx, this.villagesConfig, pointer, side, hand);
}

function initCongkakBoard() {
  this.drawCongkakBoard(this.backgroundLayer.scene.canvas, this.backgroundLayer.scene.context)
  this.drawBeans(this.beansLayer.scene.canvas, this.beansLayer.scene.context)
  this.drawCounterText(this.textCounterLayer.scene.canvas, this.textCounterLayer.scene.context)
}

function updateCongkakDisplay(pointer=-1, side=-1, hand=0) {
  this.beansLayer.scene.clear();
  this.drawBeans(this.beansLayer.scene.canvas, this.beansLayer.scene.context)
  this.textCounterLayer.scene.clear();
  this.drawCounterText(this.textCounterLayer.scene.canvas, this.textCounterLayer.scene.context, pointer, side, hand)
}

function drawPointer(canvas, ctx, villagesConfigPlayer, pointer, side, hand) {
  if (pointer === -1 && side === -1) {
    return;
  }

  let vill;
  if (side === 1) {
    vill = villagesConfigPlayer['player1'][pointer];
  } else {  // side == 2
    vill = villagesConfigPlayer['player2'][6-pointer];
  }
  
  let X = vill.x, Y = vill.y;
  
  ctx.fillStyle = "#4CAF50";

  var height = 40 * (Math.sqrt(3)/2);
  ctx.beginPath();
  if (side === 1) {
    Y += 40;
    ctx.moveTo(X, Y);
    ctx.lineTo(X+10, Y+height);
    ctx.lineTo(X-10, Y+height);
    ctx.lineTo(X, Y);
    ctx.fillText(hand.toString(), X, Y+60);
  } else {  // side === 2
    Y -= 40;
    ctx.moveTo(X, Y);
    ctx.lineTo(X+10, Y-height);
    ctx.lineTo(X-10, Y-height);
    ctx.lineTo(X, Y);
    ctx.fillText(hand.toString(), X, Y-40);
  }

  
  ctx.fill();
  ctx.closePath();
}

// pointer = 0..6 (left to right)
function sendMove(gameState, selected) {
  function takeBeans(side, pointer, boardState) {
    let temp;
    if (side === 1) {
      temp = boardState['player1'].villages[pointer]
      boardState['player1'].villages[pointer] = 0
    } else if (side === 2) {
      temp = boardState['player2'].villages[6-pointer]
      boardState['player2'].villages[6-pointer] = 0
    }

    return temp;
  }

  function putBeanToHome(turn, boardState) {
    if (turn === 1) {
      boardState['player1'].home += 1;
    } else if (turn === 2) {
      boardState['player2'].home += 1;
    }
  }

  function putBean(side, pointer, boardState) {
    if (side === 1) {
      boardState['player1'].villages[pointer] += 1;
    } else if (side === 2) {
      boardState['player2'].villages[6-pointer] += 1;
    }
  }

  function isDead(side, pointer, turn, round, boardState) {
    if (side == 1) {
      return (boardState['player1'].villages[pointer] === 1)
    } else if (side == 2) {
      return (boardState['player2'].villages[6-pointer] === 1)
    }
  }

  function getBeansInOppositeVillage(side, pointer, boardState) {
    let temp;
    if (side === 1) {
      temp = boardState['player2'].villages[6-pointer];
      boardState['player2'].villages[6-pointer] = 0;
    } else if (side === 2) {
      temp = boardState['player1'].villages[6-pointer];
      boardState['player1'].villages[6-pointer] = 0;
    }
  return temp;
  }

  function anyBeansInOppositeVillage(side, pointer, boardState) {
    if (side === 1) {
      return (boardState['player2'].villages[6-pointer] > 0);
    } else if (side === 2) {
      return (boardState['player1'].villages[6-pointer] > 0);
    }
  }

  let turn = gameState.turn;
  let pointer = (turn === 2) ? (6-selected) : selected;
  let side = turn;
  let round = false;
  let hand = takeBeans(side, pointer, this.state);
  let inHome = false;
  let isNextTurn = true;

  // Board representation
  // 2 | 6 ... 0
  // 1 | 0 ... 6

  let nIntervId = setInterval(() => {
    this.updateCongkakDisplay(inHome ? -1: pointer, inHome ? -1 : side, hand)
    this.viewport.render();
    // move CW
    if (inHome) {
      if (turn === 1) {
        side = 2;
        // pointer = 6;
      } else if (turn === 2) {
        side = 1;
        // pointer = 6;
      }
      inHome = false;
    } else {
      if (side === 1 && pointer === 0) {
        if (turn === 1) { // put to home
          inHome = true;
        } else if (turn === 2) {
          side = 2;
          round = true;
        }
      } else if (side === 2 && pointer === 6) {
        if (turn === 1) {
          side = 1;
          round = true;
        } else if (turn === 2) {  // put to home
          inHome = true;
        }
      } else {
        if (side === 1) {
          pointer--;
        } else {
          pointer++;
        }
      }
    }

    // put 1
    hand -= 1;
    if (inHome) {
      putBeanToHome(turn, this.state);
    } else {
      putBean(side, pointer, this.state);
    }

    // check if dead
    if (hand === 0 && (inHome || isDead(side, pointer, turn, round, this.state))) {
      if (inHome) {
        isNextTurn = false;
      } else {
        if (turn === 1 && side === 1) { // check kemungkinan nembak
          if (round && anyBeansInOppositeVillage(side, pointer, this.state)) {
            hand = getBeansInOppositeVillage(side, pointer, this.state)
          }
        } else if (turn === 2 && side === 2) {
          if (round && anyBeansInOppositeVillage(side, pointer, this.state)) {
            hand = getBeansInOppositeVillage(side, pointer, this.state)
          }
        }
      }
    } else if (hand === 0){
      hand += takeBeans(side, pointer, this.state);
    }

    if (hand <= 0) {
      this.updateCongkakDisplay(inHome ? -1: pointer , inHome ? -1 : side, hand)
      this.viewport.render();
      if (isNextTurn) {
        gameState.turn = (gameState.turn === 1) ? 2 : 1
      }
      clearInterval(nIntervId);
      
    }
  }, 500);
}

class CongkakBoard {
  static createBoard(viewport, congkakContainer, backgroundLayer, beansLayer, textCounterLayer, pointerLayer) {
    this.viewport = viewport;
    this.congkakContainer = congkakContainer;
    this.backgroundLayer = backgroundLayer;
    this.beansLayer = beansLayer;
    this.textCounterLayer = textCounterLayer;
    this.pointerLayer = pointerLayer;
  }

  static drawCongkakBoard = drawCongkakBoard;
  static drawBeans = drawBeans;
  static drawCounterText = drawCounterText;
  static initCongkakBoard = initCongkakBoard;
  static drawPointer = drawPointer;

  static updateCongkakDisplay = updateCongkakDisplay;

  static sendMove = sendMove;
  
  // attributes
  static state = {
    'player1': {
      'home': 0,
      'villages': Array(7).fill(7)
    },
    'player2': {
      'home': 0,
      'villages': Array(7).fill(7)
    }
  }

  // needed for hit detection
  static villagesConfig = {
    'player1': Array(7),
    'player2': Array(7),
  }

  static player1 = "human";
  static player2 = "human";
}
