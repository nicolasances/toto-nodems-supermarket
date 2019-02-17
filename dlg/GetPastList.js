var mongo = require('mongodb');
var config = require('../config');

var MongoClient = mongo.MongoClient;

exports.do = function(req) {

  var listId = req.params.id;

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      // Fetch the data!
      db.db(config.dbName).collection(config.collections.executions)
                          .find({_id: new mongo.ObjectId(listId)})
                          .toArray(function(err, array) {

        db.close();

        if (array == null) {
          success({});
          return;
        }

        // Define the list
        let list = {
          id: array[0]._id,
          cost: array[0].cost,
          date: array[0].date,
          paid: array[0].paid == null ? false : array[0].paid,
          paymentId: array[0].paymentId,
          items: []
        }

        // Add the items if any
        if (array[0].items != null) {

          for (var i = 0; i < array[0].items.length; i++) {
            list.items.push({
              name: array[0].items[i].name,
              note: array[0].items[i].note,
              noteBy: array[0].items[i].noteBy,
              category: array[0].items[i].categoryId
            });
          }
        }

        // Return the result
        success(list);

      });
    });
  });

}
