const dao = require('./dao.js');
const uuid = require("uuid/v4");
const gameTable = 'battleship-games';

function saveGame(winner, loser, statisticsA, statisticsB, callback) {
    const id = createId();
    const  date = new Date();
    const game = {
        TableName: gameTable,
        Key: {
            "id": id
        },
        Item: {
            'id': id,
            'winner': winner,
            'loser': loser,
            'statisticsA': statisticsA,
            'statisticsB': statisticsB,
            'date': date.getTime(),
        }
    };

    dao.post(game, function (err, data) {
        if (err) {
            console.log('Error to save game');
        } else {
            console.log('Game saved.');
            callback(game.Item);
        }
    });
}

function createId() {
    return uuid();
}



module.exports.saveGame = saveGame;