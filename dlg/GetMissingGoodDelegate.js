var mongo = require('mongodb');
var config = require('../config');
var converter = require('../conv/MissingGoodConverter');

var MongoClient = mongo.MongoClient;

exports.getMissingGood = function(req) {

  var missingGoodId = req.params.id;

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      var results = db.db(config.dbName).collection(config.collections.missingGoods).findOne({_id: new mongo.ObjectId(missingGoodId)}, function(err, doc) {

        db.close();

        success(converter.missingGoodConverter.toMissingGood(doc));

      });
    });
  });

}
