class CommunicationProtocol {
  constructor () {

  }

  assignPlayer (player1, player2) {
    // player1
    if (player1 === "human") {

    } else if (player1 === "human") {

    }
  }
}

class Player {
  constructor (communicationInterface) {
    this.ci = communicationInterface;
    this.type = ''
  }

  move() {

  }
}

class Human extends Player {
  constructor () {
    super()
    this.type = 'player';
  }

  move() {
    this.ci.sendClick();
  }
}

class Bot extends Player {
  
}

class BotRandom extends Bot {
  constructor () {
    this.type = 'botrandom';
  }
}

class BotAI extends Bot {
  constructor () {
    this.type = 'botai';
  }
}

