const AWS = require("aws-sdk");
const awsRegion = "us-east-2";
AWS.config.update({
    region: awsRegion
});
const docClient = new AWS.DynamoDB.DocumentClient();

class Dao {

    constructor() {
    }

    get(params, callback) {
        docClient.get(params, function (err, data) {
            callback(err, data);
        });
    };


    post(params, callback) {
        // Put the new Article in the database
        docClient.put(params, function (err, data) {
                callback(err, data);
        });
    };

    put(params, callback){

    }

    delete(params, callback) {
        // Put the new item in the database
        docClient.delete(params, function (err, data) {
            if (err) {
                console.log('Error to delete');
                callback(err, data);
            } else {
                console.log('User deleted');
                callback(err, data);
            }
        });
    };

}

module.exports = new Dao();
