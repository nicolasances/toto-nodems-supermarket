var kafka = require('kafka-node');

var Consumer = kafka.Consumer;
var client = new kafka.KafkaClient({kafkaHost: 'kafka:9092', connectTimeout: 3000, requestTimeout: 6000});

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

  console.log(message);
});
