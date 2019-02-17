var mongo = require('mongodb');
var config = require('../config');
var totoEventPublisher = require('toto-event-publisher');
var moment = require('moment-timezone');

var MongoClient = mongo.MongoClient;

exports.do = function(req) {

  var id = req.params.id;
  var data = req.body;

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      // VALIDATION
      let validationErrors = [];

      // Check what data has to be provided
      // If it's a recategorization, the user email must be provided, but DON'T CONSIDER IF AUTOMATIC (DONE AUTOMATICALLY BY TOTO)
      if (!data.automatic && data.category && !data.userEmail) validationErrors.push({message: 'Missing user email (field userEmail).'})
      // If it's a recategorization, the item name must be provided, but DON'T CONSIDER IF AUTOMATIC (DONE AUTOMATICALLY BY TOTO)
      if (!data.automatic && data.category && !data.itemName) validationErrors.push({message: 'Missing item name (field itemName).'})

      // If there's any validation error, go back
      if (validationErrors.length > 1) {

        // Fail
        failure({httpStatusCode: 400, erorrs: validationErrors})

        // Return
        return;
      }

      // Data to be updated
      let updateData = {};

      if (data.note != null) updateData.note = data.note;
      if (data.noteBy != null) updateData.noteBy = data.noteBy;
      if (data.noteByGivenName != null) updateData.noteByGivenName = data.noteByGivenName;
      if (data.grabbed != null) updateData.grabbed = data.grabbed;
      if (data.category != null) updateData.categoryId = data.category;

      // Define the update statement
      let updateStatement = {$set: updateData};

      // Do the update
      db.db(config.dbName).collection(config.collections.currentList).updateOne({_id: new mongo.ObjectId(id)}, updateStatement, function(err, res) {

        db.close();

        success({});
      });

      // If the category was updated (manual categorization), send a manual
      // categorization event
      if (!data.automatic) {

        // I'm not capturing the success or failure... TODO ?
        totoEventPublisher.publishEvent('supermarket-categorization', {
          time: moment().tz('Europe/Rome').format('YYYYMMDDHHmmssSSS'),
          userEmail: data.userEmail,
          itemName: data.itemName,
          categoryId: data.category
        });
      }

    });
  });

}
