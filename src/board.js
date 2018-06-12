const uuid = require("uuid/v4");

class Board {


    constructor(playerId, cells, totalShipsCells, ships) {
        this.id = this.createId();
        this.playerId = playerId;
        this.cells = cells;
        this.ships = ships;
        this.totalShipsCells = totalShipsCells;
    }

    createId() {
        return uuid();
    }


}

module.exports = Board;