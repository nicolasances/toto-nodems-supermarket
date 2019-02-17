var mongo = require('mongodb');
var config = require('../config');
var http = require('request');
var moment = require('moment-timezone');
var postPayment = require('./integration/PostPayment');
var getPayment = require('./integration/GetPayment');
var putPastList = require('./PutPastList');

var MongoClient = mongo.MongoClient;

/**
 * This delegate is used to add a payment in the "expenses" app and mark a
 * supermarket expense as "paid"
 */
exports.do = function(req) {

  var list = req.body;
  var cid = req.headers['x-correlation-id'];

  return new Promise(function(success, failure) {

    // 1. Set the list as "paid"
    return MongoClient.connect(config.mongoUrl, function(err, db) {

      // Define the update statement
      let updateStatement = {$set: {paid: true}};

      // Do the update
      db.db(config.dbName).collection(config.collections.executions)
                          .updateOne({_id: new mongo.ObjectId(list.id)}, updateStatement, function(err, res) {

        // Close the connection
        db.close();

        // Return back to the called, from now on it's all async
        success({});

        // POST a payment on the /expenses API
        postPayment.do({
          amount: parseFloat(list.cost),
          date: list.date,
          category: 'SUPERMERCATO',
          description: 'Supermarket: Føtex', // TODO : put the true name of the supermarket and location (e.g. Copenhagen)
          yearMonth: moment(list.date, 'YYYYMMDD').tz('Europe/Rome').format('YYYYMM'),
          currency: 'DKK', // TODO: set the true currency,
          additionalData: {
            supermarketListId: list.id
          }
        }, cid).then((data) => {

          // Retrieve the payment data and update the list with the payment ID
          getPayment.do(data.id, cid).then((data) => {

            // Update the list with the payment ID
            putPastList.do(data.additionalData.supermarketListId, {paymentId: data.id});

          });

        }, (err) => {

          console.log(err);
          // TODO: what should we do with that ???
        });
      });

    });
  });

}
