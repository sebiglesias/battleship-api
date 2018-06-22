const uuid = require("uuid/v4");
const Cell = require('./cell.js');
const Statistics = require('./statistics.js');
const gameDao = require('./dao/gameDao.js');
const userDao = require('./dao/userDao.js');

class Game {


    constructor(playerA, playerB) {
        this.gameId = this.createId();

        this.playerA = playerA;
        this.playerB = playerB;

        this.playerAboard = undefined;
        this.playerBboard = undefined;

        this.boardAopponent = this.createEmptyBoard();
        this.boardBopponent = this.createEmptyBoard();

        this.shipsAopponent = [];
        this.shipsBopponent = [];

        this.statisticsA = new Statistics(0, 0, 0);
        this.statisticsB = new Statistics(0, 0, 0);

        this.nextTurn = undefined;
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
        if (player === this.playerA.userId && !this.boardAopponent[row][column].shooted) {
            console.log('playerA');
            this.statisticsA.shots += 1;
            const isShip = this.check(this.playerBboard, row, column);
            console.log('isShip: ' + isShip);
            this.setShotOpponent(this.boardAopponent, row, column, isShip);
            this.setShot(this.playerBboard, row, column, isShip, this.shipsAopponent, this.statisticsA);
        } else if(player === this.playerB.userId && !this.boardBopponent[row][column].shooted) {
            console.log('playerB:' + this.playerB.userId);
            this.statisticsB.shots += 1;
            console.log('playerB:' + player);
            const isShip = this.check(this.playerAboard, row, column);
            console.log('isShip: ' + isShip);
            this.setShotOpponent(this.boardBopponent, row, column, isShip);
            this.setShot(this.playerAboard, row, column, isShip, this.shipsBopponent, this.statisticsB);
        }
    }

    check(boardOpponent, row, column) {
        return boardOpponent.cells[row][column].occupied;
    }

    setShotOpponent(boardOpponent, row, column, isShip) {
        boardOpponent[row][column].shooted = true;
        boardOpponent[row][column].occupied = isShip;
    }

    setShot(myboard, row, column, isShip, shipsOpponent, statistics) {
        if (isShip && myboard.cells[row][column].shot.hit !== true) {
            console.log('resta 1');
            myboard.totalShipsCells = myboard.totalShipsCells - 1;
            statistics.hits += 1;
            const id = row + ',' + column;
            this.setShotShip(myboard.ships, id, shipsOpponent)
        } else {
            statistics.misses += 1;
        }
        myboard.cells[row][column].shot.hit = isShip;
    }

    setShotShip(ships, id, shipsOpponent) {
        for (let i = 0; i < ships.length; i++) {
            for (let j = 0; j < ships[i].cells.length; j++) {
                if (ships[i].cells[j].id === id) {
                    ships[i].shot += 1;
                    if(ships[i].shot === ships[i].size){
                        shipsOpponent.push(ships[i])
                    }
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

    finish(winnerId) {
        console.log('-----------------------');
        console.log(this.statisticsA);
        console.log('-----------------------');
        console.log(this.statisticsB);
        console.log('-----------------------');
        console.log('winnerid: ' + winnerId);
        if (this.playerB.userId === winnerId) {
            gameDao.saveGame(winnerId, this.playerA.userId, this.statisticsA, this.statisticsB, (res) => {
                userDao.updateUser(this.playerB.userId, 1, 0, this.statisticsB.shots, this.statisticsB.hits, res.id);
                userDao.updateUser(this.playerA.userId, 0, 1, this.statisticsA.shots, this.statisticsA.hits, res.id);
            });
        } else {
            gameDao.saveGame(winnerId, this.playerB.userId, this.statisticsA, this.statisticsB, (res) => {
                userDao.updateUser(this.playerB.userId, 0, 1, this.statisticsB.shots, this.statisticsB.hits, res.id);
                userDao.updateUser(this.playerA.userId, 1, 0, this.statisticsA.shots, this.statisticsA.hits, res.id);
            });
        }
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