var moment = require('moment');

exports.missingGoodConverter = {

    toMissingGood: function(json) {

      if (json == null) return {};

      return {
        id: json._id,
        amount: json.amount,
        name: json.name,
        bought: json.bought,
        boughtOn: json.boughtOn,
      };
    },

    toMissingGoodPO : function(missingGood) {

      return {
        name: missingGood.name,
        date: moment().format('YYYYMMDD'),
        amount: 1,
        bought: false
      };
    },

    filter : function(missingGoodsFilter) {

      if (missingGoodsFilter == null || missingGoodsFilter.bought == null) return {};

      return {bought: missingGoodsFilter.bought};
    },

    update : function(updateRequest) {

      var up = {};

      if (updateRequest != null && updateRequest.bought != null) {

        up.bought = updateRequest.bought;

        if (updateRequest.bought) up.boughtOn = moment().format('YYYYMMDD');
        else up.boughtOn = null;
      }

      return {"$set": up};
    }
}
