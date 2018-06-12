const dao = require('./dao.js');
const uuid = require("uuid/v4");
const gameTable = 'battleship-games';

function saveGame(winner, loser) {
    const id = createId();
    const game = {
        TableName: gameTable,
        Key: {
            "id": id
        },
        Item: {
            'id': id,
            'winner': winner,
            'loser': loser,
            'totalShoots': 0,
            'hits': 0,
            'games': []
        }
    };

    return id;
}

function createId() {
    return uuid();
}

module.exports.postGame = saveGame();