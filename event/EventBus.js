var kafka = require('kafka-node');
var moment = require('moment-timezone');

Producer = kafka.Producer;
client = new kafka.KafkaClient({kafkaHost: 'kafka:9092', connectTimeout: 3000, requestTimeout: 6000});
producer = new Producer(client);

exports.publishEvent = function(topic, event) {

  return new Promise(function(success, failure) {

    // Send the event to the producer
    producer.send([{topic: topic, messages: JSON.stringify(event)}], function(err, data) {

      // If there's an error
      if (err != null) {

        // Log the error
        console.log(err);

        // Invoke a failure
        failure(err);

        // Break
        return;
      }

      // If it's a success
      success();

    })
  })
}
