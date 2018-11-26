var mongo = require('mongodb');
var config = require('../config');
var eventBus = require('../event/EventBus');
var moment = require('moment-timezone');

var MongoClient = mongo.MongoClient;

exports.do = function(item) {

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      // Create the data object
      let data = {
        name: item.name,
        categoryId: item.category,
        addedBy: item.addedBy
      }

      // Insert the data object
      db.db(config.dbName).collection(config.collections.currentList).insertOne(data, function(err, res) {

        db.close();

        success({id: res.insertedId});

        // Throw an event to start finding the right category for this item
        eventBus.publishEvent('supermarket-items', {
          time: moment().tz('Europe/Rome').format('YYYYMMDDHHmmssSSS'),
          action: 'POST',
          itemId: res.insertedId
        }).then(() => {console.log('Published POST of item ' + res.insertedId);}, () => {console.log('Failed posting item');});

      });

    });
  });

}
