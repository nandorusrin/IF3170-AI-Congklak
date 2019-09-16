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

  function drawBaseHole(isUser) {
    ctx.beginPath();

    
    let xOffset = 200;
    if (!isUser) {
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

  function drawSingleSideHole(xOffset, yOffset) {
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

  function drawSideHoles(isUser) {
    let yOffset = 25;
    if (!isUser) {
      yOffset = yOffset * -1;
    }

    for (let i = 1; i <= 7; i++) {
      drawSingleSideHole((-180 + i * 45), yOffset);
    }
  }

  drawHalfCircle(-200, isLeft=true);
  drawHalfCircle(200, isLeft=false);
  drawBody(canvas.width/2 + -200, canvas.height/2-60, 400, 120);
  drawBaseHole(isUser=true);
  drawBaseHole(isUser=false);
  drawSideHoles(isUser=true);
  drawSideHoles(isUser=false);
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

  function drawBeanInVillage(index, quantity, isUser=true) {
    assert(index >= 0 && index <= 7);

    const yOffset = (isUser) ? defaultUserYOffset : defaultEnemyYOffset;
    for (let iter = 0; iter < quantity; iter++) {
      drawIndividualBean(villageXOffsets[index], yOffset);
    }
  }

  function drawBeanInHome(quantity, isUser=true) {
    const xOffset = (isUser) ? -200 : 200;
    for (let iter = 0; iter < quantity; iter++) {
      drawIndividualBean(xOffset, 0, spreadFactor=15);
    }
  }

  for (let iter = 0; iter < 7; iter++) {
    drawBeanInVillage(iter, 7, isUser=true);
    drawBeanInVillage(iter, 7, isUser=false);
  }

  assert(this && this.state && this.state['player1'] && this.state['player2'], "State undefined in drawCounterText()")
  drawBeanInHome(this.state['player1']['home'], isUser=true);
  drawBeanInHome(this.state['player2']['home'], isUser=false);
}

function drawCounterText(canvas, ctx) {
  function drawSideHolesCounter(isUser, numbers) {
    let yOffset = (isUser) ? 58 : -45;
    let xOffset = 0;

    for (let i = 1; i <= 7; i++) {
      ctx.font = '17px arial';
      ctx.fillStyle = "#fcfcfc";
      xOffset = (i >= 10) ? -4 : xOffset;
      ctx.fillText(numbers[i-1], canvas.width/2 + (-180 + i * 45) - 5 + xOffset, canvas.height/2 + yOffset);
    }
  }

  function drawBaseHoleCounter(isUser, value) {
    let xOffset = 0;
    if (isUser) {
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
  drawSideHolesCounter(isUser=true, this.state['player1']['villages']);
  drawSideHolesCounter(isUser=false, this.state['player2']['villages']);

  drawBaseHoleCounter(isUser=true, value=this.state['player1']['home']);
  drawBaseHoleCounter(isUser=false, value=this.state['player2']['home']);
}

function initCongkakBoard() {
  this.drawCongkakBoard(this.backgroundLayer.scene.canvas, this.backgroundLayer.scene.context)
  this.drawBeans(this.beansLayer.scene.canvas, this.beansLayer.scene.context)
  this.drawCounterText(this.textCounterLayer.scene.canvas, this.textCounterLayer.scene.context)
}

function updateCongkakDisplay() {
  this.beansLayer.scene.clear();
  this.drawBeans(this.beansLayer.scene.canvas, this.beansLayer.scene.context)
  this.textCounterLayer.scene.clear();
  this.drawCounterText(this.textCounterLayer.scene.canvas, this.textCounterLayer.scene.context)
}

class CongkakBoard {
  static createBoard(backgroundLayer, beansLayer, textCounterLayer) {
    this.backgroundLayer = backgroundLayer;
    this.beansLayer = beansLayer;
    this.textCounterLayer = textCounterLayer;
  }

  static drawCongkakBoard = drawCongkakBoard;
  static drawBeans = drawBeans;
  static drawCounterText = drawCounterText;
  static initCongkakBoard = initCongkakBoard;

  static updateCongkakDisplay = updateCongkakDisplay;

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
}
