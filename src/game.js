const uuid = require("uuid/v4");

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