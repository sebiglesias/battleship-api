class Cell {

    constructor(row, column, occupied, shooted) {
        this.id = row + ',' + column;
        this.row = row;
        this.column = column;
        this.occupied = occupied;
        this.shooted = shooted;
    }
}

module.exports = Cell;