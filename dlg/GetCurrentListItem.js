var mongo = require('mongodb');
var config = require('../config');

var MongoClient = mongo.MongoClient;

exports.do = function(id) {

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      // Fetch the data!
      db.db(config.dbName).collection(config.collections.currentList)
                          .find({_id: new mongo.ObjectId(id)})
                          .toArray(function(err, array) {

        db.close();

        if (array == null || array.length == 0) success({});

        success({
          id: item._id,
          name: item.name,
          note: item.note,
          noteBy: item.noteBy,
          noteByGivenName: item.noteByGivenName,
          grabbed: item.grabbed,
          category: item.categoryId
        })

      });
    });
  });

}
