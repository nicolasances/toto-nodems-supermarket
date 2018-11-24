var mongo = require('mongodb');
var config = require('../../config');

var MongoClient = mongo.MongoClient;

exports.do = function(filter) {

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      // Filtering
      let mongoFilter = {};

      if (filter.itemName) mongoFilter.itemName = filter.itemName;

      // Persist
      db.db(config.dbName)
                .collection(config.collections.categorizations)
                .find(mongoFilter, function(err, array) {

        db.close();

        let items = [];

        if (array == null) {
          success({items: items});
          return;
        }

        for (var i = 0; i < array.length; i++) {
          items.push({
            date: items[i].date,
            userEmail: items[i].userEmail,
            itemName: items[i].itemName,
            categoryId: items[i].categoryId
          })
        }

        success({items: items});
      });

    });
  });

}
