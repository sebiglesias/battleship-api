class Cell {

    constructor(row, column, occupied) {
        this.id = row + ',' + column;
        this.row = row;
        this.column = column;
        this.occupied = occupied;
    }
}

module.exports = Cell;