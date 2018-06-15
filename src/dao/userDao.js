const dao = require('./dao.js');
const uuid = require("uuid/v5");
const userTable = 'battleship-users';

function getUser(id, callback) {
    let params = {
        TableName: userTable,
        Key: {
            "id": createId(id)
        }
    };
    dao.get(params, function (err, data) {
        if (err) {
            console.log('Error to get user');
        } else {
            callback(data);
        }
    });
}

function newUser(id, callback) {
    const newUser = {
        TableName: userTable,
        Key: {
            "id": createId(id)
        },
        Item: {
            'id': createId(id),
            'win': 0,
            'lost': 0,
            'totalShoots': 0,
            'hits': 0,
            'games': []
        }
    };

    dao.post(newUser, function (err, data) {
        if (err) {
            console.log('Error to create user');
        } else {
            console.log('User created');
            callback(newUser.Item);
        }
    });
}

function deleteUser(id) {
    const user = {
        TableName: userTable,
        Key: {
            "id": createId(id)
        }
    };
    // Put the new Article in the database
    dao.delete(user, function (err, data) {
        if (err) {
            console.log('Error to delte user');
        } else {
            callback(null, data);
        }
    });
}

function updateUser(id, win, lost, shots, hits, gameId) {
    const user = {
        TableName: userTable,
        Key: {
            "id": id
        },
        UpdateExpression: "set win = win + :w, lost = lost + :l, hits = hits + :h, totalShoots = totalShoots + :ts, games = list_append(games, :g)",
        ExpressionAttributeValues: {
            ":w": win,
            ":l": lost,
            ":h": hits,
            ":ts": shots,
            ":g": [gameId]
        },
        ReturnValues: "UPDATED_NEW"
    };

    dao.put(user, (err, data) => {
        console.log(data);
    })

}


function createId(facebookId) {
    const ID = '1b671a64-40d5-491e-99b0-da01ff1f3341';
    return uuid(facebookId, ID);
}

module.exports.getUser = getUser;
module.exports.newUser = newUser;
module.exports.updateUser = updateUser;