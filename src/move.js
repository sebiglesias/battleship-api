class Move{

    constructor(turn, myBoard, boardOpponent, ships, winner) {
        this.turn = turn;
        this.myBoard = myBoard;
        this.boardOpponent = boardOpponent;
        this.destroyedShips = ships;
        this.winner = winner;
    }
}

module.exports = Move;