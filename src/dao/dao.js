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
        docClient.put(params, function (err, data) {
                callback(err, data);
        });
    };

    put(params, callback){
        docClient.update(params, function (err, data) {
            if (err) {
                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                callback(null, data);
            }
        });
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
