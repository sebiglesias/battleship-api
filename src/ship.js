const uuid = require("uuid/v4");

class Ship {

    constructor(size, cells) {
        this.id = this.createId();
        this.size = size;
        this.shots = 0;
        this.cells = cells;
    }

    createId(){
        return uuid();
    }
}


module.exports = Ship;