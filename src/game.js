const uuid = require("uuid/v4");
const Board = require('./Board.js');

class Game {

    constructor(playerA, playerB) {
        this.playerA = playerA;
        this.playerB = playerB;
        this.id = this.createId();
    }


    createId(){
        return uuid();
    }
}

module.exports = Game;