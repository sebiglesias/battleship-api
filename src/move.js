class Move{

    constructor(turn, myBoard, boardOpponent) {
        this.turn = turn;
        this.myBoard = myBoard;
        this.boardOpponent = boardOpponent;
        this.winner = undefined;
    }
}

module.exports = Move;