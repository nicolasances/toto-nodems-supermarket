var mongo = require('mongodb');
var config = require('../config');

var MongoClient = mongo.MongoClient;

exports.do = function(filters) {

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      // Filter definition
      let filter = {};

      if (filters.grabbed != null) {
        if (filters.grabbed == 'true') filter.grabbed = true;
        else filter.$or = [{grabbed: false}, {grabbed: null}];
      }

      // Fetch the data!
      db.db(config.dbName).collection(config.collections.currentList)
                          .find(filter)
                          .toArray(function(err, array) {

        db.close();

        var items = [];
        for (var i = 0; i < array.length; i++) {

          let item = array[i];

          items.push({
            id: item._id,
            name: item.name,
            note: item.note,
            noteBy: item.noteBy,
            noteByGivenName: item.noteByGivenName,
            grabbed: item.grabbed,
            category: item.categoryId
          });
        }

        success({items: items});

      });
    });
  });

}
