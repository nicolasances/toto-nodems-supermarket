var mongo = require('mongodb');
var config = require('../config');

var MongoClient = mongo.MongoClient;

exports.do = function(id, data) {

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      // Data to be updated
      let updateData = {paymentId: data.paymentId};

      // Define the update statement
      let updateStatement = {$set: updateData};

      // Do the update
      db.db(config.dbName).collection(config.collections.executions)
                          .updateOne({_id: new mongo.ObjectId(id)}, updateStatement, function(err, res) {

        db.close();

        success({});
      });

    });
  });

}
