const uuid = require("uuid/v4");
const Board = require('./Board.js');
const Cell = require('./cell.js');

class Game {


    constructor(playerA, playerB) {
        this.gameId = this.createId();

        this.playerA = playerA;
        this.playerB = playerB;

        this.playerAboard = undefined;
        this.playerBboard = undefined;

        this.boardAopponent = this.createEmptyBoard();
        this.boardBopponent = this.createEmptyBoard();
    }


    createId() {
        return uuid();
    }

    createEmptyBoard() {
        let array = [];
        let row = [];
        for (let i = 0; i < 13; i++) {
            for (let j = 0; j < 13; j++) {
                console.log(i + ' ' + j);
                row[j] = new Cell(i, j, false)
            }
            array[i] = row;
            row = [];
        }
        console.log(array);
        return array;
    }

    toString() {
        return {
            playerA: this.playerA,
            playerB: this.playerB,
            gameId: this.gameId,
            playerAboard: this.playerAboard,
            playerBboard: this.playerBboard,
            boardAopponent: this.boardAopponent,
            boardBopponent: this.boardBopponent
        };
    }
}

module.exports = Game;