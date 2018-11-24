var mongo = require('mongodb');
var config = require('../../config');

var MongoClient = mongo.MongoClient;

exports.do = function(filter) {

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      // Filtering
      let mongoFilter = {};

      if (filter.itemName) mongoFilter.itemName = filter.itemName;

      console.log(JSON.stringify(filter));

      // Persist
      db.db(config.dbName)
                .collection(config.collections.categorizations)
                .find(mongoFilter)
                .toArray(function(err, array) {

        db.close();

        let items = [];

        console.log(array.length);

        if (array == null) {
          success({items: items});
          return;
        }

        for (var i = 0; i < array.length; i++) {
          items.push({
            date: array[i].date,
            userEmail: array[i].userEmail,
            itemName: array[i].itemName,
            categoryId: array[i].categoryId
          })
        }

        console.log(items);

        success({items: items});
      });

    });
  });

}
