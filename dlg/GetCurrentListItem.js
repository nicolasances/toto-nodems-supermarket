var mongo = require('mongodb');
var config = require('../config');

var MongoClient = mongo.MongoClient;

exports.do = function(req) {

  var id = req.params.id;

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      // Fetch the data!
      db.db(config.dbName).collection(config.collections.currentList)
                          .find({_id: new mongo.ObjectId(id)})
                          .toArray(function(err, array) {

        db.close();

        if (array == null || array.length == 0) success({});

        success({
          id: array[0]._id,
          name: array[0].name,
          note: array[0].note,
          noteBy: array[0].noteBy,
          noteByGivenName: array[0].noteByGivenName,
          grabbed: array[0].grabbed,
          category: array[0].categoryId
        })

      });
    });
  });

}
