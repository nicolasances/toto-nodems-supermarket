var mongo = require('mongodb');
var config = require('../../config');

var MongoClient = mongo.MongoClient;

exports.do = function(data) {

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      // Filter definition
      let filter = {items: {$elemMatch: {"name": {$regex: '^' + data.itemName + '$', $options: 'i'}, "categoryId": null}}};

      // Update clause
      let update = {$set: {"items.$.categoryId": data.categoryId}}

      // Fetch the data!
      db.db(config.dbName).collection(config.collections.currentList)
                          .updateMany(filter, update, function(err, res) {

        db.close();

        success();

      });
    });
  });

}
