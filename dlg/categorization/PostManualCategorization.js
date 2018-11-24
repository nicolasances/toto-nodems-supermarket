var mongo = require('mongodb');
var config = require('../../config');

var MongoClient = mongo.MongoClient;

exports.do = function(data) {

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      // Object to persist
      let po = {
        date: data.date,
        userEmail: data.userEmail,
        itemName: data.itemName,
        categoryId: data.categoryId
      }

      // Persist
      db.db(config.dbName)
                .collection(config.collections.categorizations)
                .insertOne(po, function(err, res) {

        db.close();

        success({id: res.insertedId});
      });

    });
  });

}
