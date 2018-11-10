var mongo = require('mongodb');
var config = require('../config');

var MongoClient = mongo.MongoClient;

exports.do = function(filters) {

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      // Filter definition
      let filter = {};

      if (filters.grabbed != null) {
        if (filter.grabbed == 'true') filter.grabbed = true;
        else filter.$or = [{grabbed: false}, {grabbed: null}];
      }

      console.log(filter);

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
            noteByGivenName: item.noteByGivenName
          });
        }

        success({items: items});

      });
    });
  });

}
