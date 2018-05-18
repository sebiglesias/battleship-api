const AWS = require("aws-sdk");
const awsRegion = "us-east-2";
AWS.config.update({
    region: awsRegion
});
const uuid = require("uuid/v5");
const userTable = "battleship-users";
const docClient = new AWS.DynamoDB.DocumentClient();


exports.getUser = function (id, callback) {
    let params = {
        TableName: userTable,
        Key: {
            "id": createId(id)
        }
    };

    console.log(params);
    docClient.get(params, function (err, data) {
        console.log(err);
        console.log(data);
        if (err) {
            console.log('Error, user not exist');
            // callback(err);
        } else {
            console.log(data.Item.id);
            // callback(data.Item.id);
        }
    });
};

exports.newUser = function (id, name) {
    const newUser = {
        Item: {
            "id": createId(id),
            "name": name
        },
        TableName: userTable,
        Key: {
            "id": createId(id)
        }
    };

    // Put the new Article in the database
    docClient.put(newUser, function (err, data) {
        if (err) {
            console.log('Error to create user');
        } else {
            console.log('User created');
            console.log(data);
        }
    });
};

exports.deleteUser = function (id) {
    const user = {
        TableName: userTable,
        Key: {
            "id": createId(id)
        }
    };

    // Put the new Article in the database
    docClient.delete(user, function (err, data) {
        if (err) {
            console.log('Error to delte user');
        } else {
            console.log('User deleted');
        }
    });
};


function createId(facebookId) {
    const ID = '1b671a64-40d5-491e-99b0-da01ff1f3341';
    return uuid(facebookId, ID);
}
