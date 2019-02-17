var mongo = require('mongodb');
var config = require('../config');
var converter = require('../conv/MissingGoodConverter');

var MongoClient = mongo.MongoClient;

exports.putMissingGood = function(req) {

  var missingGoodId = req.params.id;
  var updateRequest = req.body;

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      db.db(config.dbName).collection(config.collections.missingGoods).updateOne({_id: new mongo.ObjectId(missingGoodId)}, converter.missingGoodConverter.update(updateRequest), function(err, res) {

        db.close();

        success({id: res.insertedId});
      });

    });
  });

}
