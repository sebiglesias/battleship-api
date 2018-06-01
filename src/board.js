const uuid = require("uuid/v4");

class Board {


    constructor(playerId, totalShipsCells) {
        this.id = this.createId();
        this.playerId = playerId;
        this.totalShipsCells = totalShipsCells;
    }

    createId() {
        return uuid();
    }


}




class Cell {
    constructor(row, column, shot, occuped) {
        this.row = row;
        this.column = column;
        this.shot = shot;
        this.occuped = occuped;
    }
}


module.exports = Board;
module.exports = Cell;