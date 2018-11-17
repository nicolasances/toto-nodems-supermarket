var http = require('request');
var moment = require('moment-timezone');

/**
 * This delegate is used to post a payment on the POST /expenses microservice endpoint
 */
exports.do = function(paymentInfo) {

  return new Promise(function(success, failure) {

      http(
        { method: 'POST',
          uri: 'http://toto-nodems-expenses:8080/expenses',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(paymentInfo)
        },
        (err, resp, body) => {

          if (err) {
            console.log(err);
            failure({message: 'An error occurred while posting the payment'});
            return;
          }

          console.log(body);

          // Check that the payment id has been received
          if (body.id == null) {
            failure({message: 'No payment ID in the response. The payment has probably not been created'});
            return;
          }

          success(body);

        }
      )

  });

}
