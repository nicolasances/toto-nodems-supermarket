var mongo = require('mongodb');
var config = require('../config');
var converter = require('../conv/MissingGoodConverter');

var MongoClient = mongo.MongoClient;

exports.getMissingGoods = function(missingGoodsFilter) {

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      var results = db.db(config.dbName).collection(config.collections.missingGoods).find(converter.missingGoodConverter.filter(missingGoodsFilter));

      results.toArray(function(err, array) {
        db.close();

        var missingGoods = [];
        for (var i = 0; i < array.length; i++) {

          missingGoods.push(converter.missingGoodConverter.toMissingGood(array[i]));
        }

        success({goods: missingGoods});

      });
    });
  });

}
