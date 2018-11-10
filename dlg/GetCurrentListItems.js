var mongo = require('mongodb');
var config = require('../config');

var MongoClient = mongo.MongoClient;

exports.do = function() {

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      db.db(config.dbName).collection(config.collections.currentList).find().toArray(function(err, array) {

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
