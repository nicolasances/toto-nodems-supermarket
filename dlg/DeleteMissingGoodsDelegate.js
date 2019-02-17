var mongo = require('mongodb');
var config = require('../config');
var converter = require('../conv/MissingGoodConverter');

var MongoClient = mongo.MongoClient;

exports.deleteMissingGoods = function(req) {

  var deleteMissingGoodsFilter = req.query;

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      var results = db.db(config.dbName).collection(config.collections.missingGoods).deleteMany(converter.missingGoodConverter.filter(deleteMissingGoodsFilter), function(err, doc) {

        db.close();

        success();

      });
    });
  });

}
