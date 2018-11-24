var mongo = require('mongodb');
var config = require('../config');
var eventBus = require('../event/EventBus');
var moment = require('moment-timezone');

var MongoClient = mongo.MongoClient;

exports.do = function(id, data) {

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      // Data to be updated
      let updateData = {};

      if (data.note != null) updateData.note = data.note;
      if (data.noteBy != null) updateData.noteBy = data.noteBy;
      if (data.noteByGivenName != null) updateData.noteByGivenName = data.noteByGivenName;
      if (data.grabbed != null) updateData.grabbed = data.grabbed;
      if (data.category != null) updateData.category = data.category;

      // Define the update statement
      let updateStatement = {$set: updateData};

      // Do the update
      db.db(config.dbName).collection(config.collections.currentList).updateOne({_id: new mongo.ObjectId(id)}, updateStatement, function(err, res) {

        db.close();

        success({});
      });

      // If the category was updated (manual categorization), send a manual
      // categorization event
      // I'm not capturing the success or failure... TODO ?
      eventBus.publishEvent('supermarket-categorization', {
        time: moment().tz('Europe/Rome').format('YYYYMMDDHHmmssSSS'),
        userEmail: userEmail,
        itemName: itemName,
        categoryId: categoryId
      });

    });
  });

}
