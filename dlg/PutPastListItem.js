var mongo = require('mongodb');
var config = require('../config');
var eventBus = require('../event/EventBus');
var moment = require('moment-timezone');

var MongoClient = mongo.MongoClient;

exports.do = function(listId, name, data) {

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      // VALIDATION
      let validationErrors = [];

      // Check what data has to be provided
      // If it's a recategorization, the user email must be provided
      if (data.category && !data.userEmail) validationErrors.push({message: 'Missing user email (field userEmail).'})
      // If it's a recategorization, the item name must be provided
      if (data.category && !data.itemName) validationErrors.push({message: 'Missing item name (field itemName).'})

      // If there's any validation error, go back
      if (validationErrors.length > 1) {

        // Fail
        failure({httpStatusCode: 400, erorrs: validationErrors})

        // Return
        return;
      }

      // Filter statement
      let filter = {_id: new mongo.ObjectId(listId), items: {$elemMatch: {name: name}}};

      // Data to be updated
      let updateData = {};

      if (data.category != null) updateData['items.$.categoryId'] = data.category;

      // Define the update statement
      let updateStatement = {$set: updateData};

      // Do the update
      db.db(config.dbName).collection(config.collections.executions)
                          .updateOne(filter, updateStatement, function(err, res) {

        db.close();

        success({});

        // If the category was updated (manual categorization), send a manual
        // categorization event
        // I'm not capturing the success or failure... TODO ?
        eventBus.publishEvent('supermarket-categorization', {
          time: moment().tz('Europe/Rome').format('YYYYMMDDHHmmssSSS'),
          userEmail: data.userEmail,
          itemName: data.itemName,
          categoryId: data.category
        });
      });

    });
  });

}
