var mongo = require('mongodb');
var config = require('../config');
var moment = require('moment-timezone');

var MongoClient = mongo.MongoClient;

/**
 * Deletes the current list, saves the cost of it, archives it and creates a new empty supermarket list
 */
exports.do = function(cost) {

  return new Promise(function(success, failure) {

    if (cost == null) {
      success({});
      return;
    }

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      var results = db.db(config.dbName).collection(config.collections.currentList)
                                        .find({grabbed: true}, function(err, array) {

        // If there's no data, just leave
        if (array == null || array.length == 0) {
          success({});
          return;
        }

        // 1. Copy all the grabbed items to a closed list
        let execution = {
          date: moment().tz('Europe/Rome').format('YYYYMMDD'),
          items: array,
          cost: cost
        }

        // 2. Save the execution
        db.db(config.dbName).collection(config.collections.executions).insertOne(execution, function(err, result) {

          // 3. Remove grabbed items
          db.db(config.dbName).collection(config.collections.currentList).deleteMany({grabbed: true}, function(err, res) {

            db.close();

            success();

          });
        });
      });
    });
  });

}
