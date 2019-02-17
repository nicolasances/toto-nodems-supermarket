var http = require('toto-request');
var moment = require('moment-timezone');

/**
 * This delegate is used to post a payment on the POST /expenses microservice endpoint
 */
exports.do = function(paymentInfo, correlationId) {

  return new Promise(function(success, failure) {

      http({
        correlationId: correlationId,
        method: 'POST',
        microservice: 'toto-nodems-expenses',
        resource: '/expenses',
        body: paymentInfo
      }).then((data) => {success(data);}, failure);

  });

}
