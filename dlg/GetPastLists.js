var mongo = require('mongodb');
var config = require('../config');

var MongoClient = mongo.MongoClient;

exports.do = function(filters) {

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      // Filter definition
      let filter = {};
      let options = {};

      // Max results
      if (filters.maxResults != null) options.limit = filters.maxResults;

      // Sorting
      options.sort = [{date: '-1'}];

      // Fetch the data!
      db.db(config.dbName).collection(config.collections.executions)
                          .find(filter, options)
                          .toArray(function(err, array) {

        db.close();

        if (array == null) {
          success({});
          return;
        }

        var items = [];
        for (var i = 0; i < array.length; i++) {

          let item = array[i];

          items.push({
            id: item._id,
            cost: item.cost,
            date: item.date
          });
        }

        success({items: items});

      });
    });
  });

}
