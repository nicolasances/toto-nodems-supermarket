var http = require('toto-request');

/**
 * This delegate is used to post a payment on the POST /expenses microservice endpoint
 */
exports.do = function(id, correlationId) {

  return new Promise(function(success, failure) {

      http({
        correlationId: correlationId,
        method: 'GET',
        microservice: 'toto-nodems-expenses',
        resource: '/expenses/' + id
      }).then((data) => {success(data);}, failure);

  });

}
