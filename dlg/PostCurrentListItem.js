var mongo = require('mongodb');
var config = require('../config');

var MongoClient = mongo.MongoClient;

exports.do = function(item) {

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      // Create the data object
      let data = {
        name: item.name
      }

      // Insert the data object
      db.db(config.dbName).collection(config.collections.currentList).insertOne(data, function(err, res) {

        db.close();

        success({id: res.insertedId});
      });

    });
  });

}
