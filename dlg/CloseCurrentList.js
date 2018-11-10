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

    console.log('Closing a supermarket List with cost: ' + cost);

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      var results = db.db(config.dbName).collection(config.collections.currentList)
                                        .find({grabbed: true})
                                        .toArray(function(err, array) {

        // If there's no data, just leave
        if (array == null || array.length == 0) {
          success({});
          return;
        }

        // 1. Copy all the grabbed items to a closed list
        let execution = {
          date: moment().tz('Europe/Rome').format('YYYYMMDD'),
          items: [],
          cost: cost
        }

        for (var i = 0; i < array.length; i++) {
          execution.items.push({
            array[i].name,
            array[i].note,
            array[i].noteBy,
          });
        }

        console.log('Saving an execution: ');
        console.log(execution);

        // 2. Save the execution
        db.db(config.dbName).collection(config.collections.executions).insertOne(execution, function(err, result) {

          console.log('Execution saved under ' + config.collections.executions);
          console.log('Removing grabbed items from current list...');

          // 3. Remove grabbed items
          db.db(config.dbName).collection(config.collections.currentList).deleteMany({grabbed: true}, function(err, res) {

            console.log('Grabbed items removed. ');
            console.log('Done!');

            db.close();

            success({});

          });
        });
      });
    });
  });

}
