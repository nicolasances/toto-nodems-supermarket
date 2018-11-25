var kafka = require('kafka-node');
var moment = require('moment-timezone');

var postManualCategorization = require('../categorization/PostManualCategorization');
var propagateCategorizationToCurrentList = require('../categorization/PropagateCategorizationToCurrentList');
var propagateCategorizationToPastLists = require('../categorization/PropagateCategorizationToPastLists');

// Kafka setup
var Consumer = kafka.Consumer;
var client = new kafka.KafkaClient({kafkaHost: 'kafka:9092', connectTimeout: 3000, requestTimeout: 6000});
var producer = new kafka.Producer(client);

producer.createTopics(['supermarket-categorization'], false, function (err, data) {});

var options = {
  groupId: 'supermarket-api'
}

var consumer = new Consumer(client, [
  {topic: 'supermarket-categorization'}
], options);

/**
 * Reacts to receiving a message on the supermarket-categorization topic
 */
consumer.on('message', (message) => {

    // Extract data from the event
    let data = JSON.parse(message.value);

    // 1. Create a new manual categorization
    postManualCategorization.do({
      date: moment(data.time, 'YYYYMMDDHHmmssSSS').tz('Europe/Rome').format('YYYYMMDD'),
      userEmail: data.userEmail,
      itemName: data.itemName,
      categoryId: data.categoryId
    })

    // 2. Find other stuff that hasn't been categorized - current List
    propagateCategorizationToCurrentList.do({
      itemName: data.itemName,
      categoryId: data.categoryId
    })

    // 3. Find other stuff that hasn't been categorized - past List
    propagateCategorizationToPastLists.do({
      itemName: data.itemName,
      categoryId: data.categoryId
    })

});
