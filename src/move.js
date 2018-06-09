class Move{

    constructor(turn, myBoard, boardOpponent, winner) {
        this.turn = turn;
        this.myBoard = myBoard;
        this.boardOpponent = boardOpponent;
        this.winner = winner;
    }
}

module.exports = Move;