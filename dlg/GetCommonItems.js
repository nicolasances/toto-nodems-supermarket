var mongo = require('mongodb');
var config = require('../config');

var MongoClient = mongo.MongoClient;

exports.do = function() {

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      db.db(config.dbName).collection(config.collections.currentList).find().toArray(function(err, array) {

        db.close();

        stubbedCommonItems = [
          {name: 'Kylling bristfillet'},
          {name: 'Eggs'},
          {name: 'Milk'},
          {name: 'Bacon i tern'},
          {name: 'Bacon slices'},
          {name: 'Sweet potatoes'},
          {name: 'Greek yogurt'},
          {name: 'Hytteost'},
          {name: 'Coffee'},
          {name: 'Carrots'}
        ]

        // TODO fix with actual logic
        // For now return a stubbed object
        success({items: stubbedCommonItems});

        // success({items: items});

      });
    });
  });

}
