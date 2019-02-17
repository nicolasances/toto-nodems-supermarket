var mongo = require('mongodb');
var config = require('../config');
var converter = require('../conv/MissingGoodConverter');

var MongoClient = mongo.MongoClient;

exports.postMissingGood = function(req) {

  var missingGood = req.body;

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      db.db(config.dbName).collection(config.collections.missingGoods).insertOne(converter.missingGoodConverter.toMissingGoodPO(missingGood), function(err, res) {

        db.close();

        success({id: res.insertedId});
      });

    });
  });

}
