const uuid = require("uuid/v4");
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
                row[j] = new Cell(i, j, false, false)
            }
            array[i] = row;
            row = [];
        }
        return array;
    }

    shot(row, column, player) {
        if (player === this.playerA.userId) {
            console.log('playerA');
            const isShip = this.check(this.playerBboard, row, column);
            console.log('isShip: ' + isShip);
            this.setShotOpponent(this.boardAopponent, row, column, isShip);
            this.setShot(this.playerBboard, row, column, isShip);
        } else {
            console.log('playerB:' + this.playerB.userId);
            console.log('playerB:' + player);
            const isShip = this.check(this.playerAboard, row, column);
            console.log('isShip: ' + isShip);
            this.setShotOpponent(this.boardBopponent, row, column, isShip);
            this.setShot(this.playerAboard, row, column, isShip);
        }
    }

    check(boardOpponent, row, column) {
        return boardOpponent.cells[row][column].occupied;
    }

    setShotOpponent(boardOpponent, row, column, isShip) {
        boardOpponent[row][column].shooted = true;
        boardOpponent[row][column].occupied = isShip;
    }

    setShot(myboard, row, column, isShip) {
        myboard.cells[row][column].shot.hit = isShip;
        if (isShip) {
            console.log('resta 1');
            myboard.totalShipsCells = myboard.totalShipsCells - 1;
            const id = row + ',' + column;
            this.setShotShip(myboard.ships, id)
        }
    }

    setShotShip(ships, id) {
        for (let i = 0; i < ships.length; i++) {
            for (let j = 0; j < ships[i].cells.length; j++) {
                if(ships[i].cells[j].id === id){
                    ships[i].shot += 1;
                }
            }
        }
    }

    winner() {
        if (this.playerAboard.totalShipsCells === 0) {
            return this.playerB.userId;
        } else if (this.playerBboard.totalShipsCells === 0) {
            return this.playerA.userId;
        } else return undefined;
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