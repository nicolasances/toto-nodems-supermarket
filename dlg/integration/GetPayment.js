var http = require('request');

/**
 * This delegate is used to post a payment on the POST /expenses microservice endpoint
 */
exports.do = function(id) {

  return new Promise(function(success, failure) {

      http(
        { method: 'GET',
          uri: 'http://toto-nodems-expenses:8080/expenses/' + id,
          headers: {
            'Accept': 'application/json'
          }
        },
        (err, resp, body) => {

          if (err) {
            console.log(err);
            failure({message: 'An error occurred while posting the payment'});
            return;
          }

          success(body);

        }
      )

  });

}
