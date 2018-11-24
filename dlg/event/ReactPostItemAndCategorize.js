var kafka = require('kafka-node');
var moment = require('moment-timezone');
var getCurrentListItem = require('../GetCurrentListItem');
var getManualCategorizations = require('../categorization/GetManualCategorizations');

// Kafka setup
var Consumer = kafka.Consumer;
var client = new kafka.KafkaClient({kafkaHost: 'kafka:9092', connectTimeout: 3000, requestTimeout: 6000});

var options = {
  groupId: 'supermarket-api'
}

var consumer = new Consumer(client, [
  {topic: 'supermarket-items'}
], options);

/**
 * Reacts to a POSTed item to categorize it
 */
consumer.on('message', (message) => {

    // Extract data from the event
    let data = JSON.parse(message.value);

    // Only care about POSTed items
    if (data.action != 'POST') return;

    // Retrieve the item's details
    getCurrentListItem.do(data.itemId).then(function(item) {

      if (item == null) return;

      // Get the name of the item
      let name = item.name;

      // Find out if anyone has a category for that name
      getManualCategorizations.do({itemName: name}).then((data) => {

        let items = data.items;

        if (items == null || items.length == 0) return;

        // Update the item
        putCurrentListItem.do(data.itemId, {category: items[0].category});

      })
    });

});
