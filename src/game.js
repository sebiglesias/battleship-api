const uuid = require("uuid/v4");

class Game {

    constructor(playerA, playerB) {
        this.playerA = playerA;
        this.playerB = playerB;
        this.id = this.createId();
        console.log('juego creado:' + playerA);
    }


    createId(){
        return uuid();
    }
}

module.exports = Game;