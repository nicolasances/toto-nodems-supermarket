var mongo = require('mongodb');
var config = require('../config');

var MongoClient = mongo.MongoClient;

exports.do = function(id) {

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      var results = db.db(config.dbName).collection(config.collections.currentList).deleteOne({_id: new mongo.ObjectId(id)}, function(err, doc) {

        db.close();

        success();

      });
    });
  });

}
