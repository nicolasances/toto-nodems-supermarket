var moment = require('moment-timezone');

var postManualCategorization = require('../categorization/PostManualCategorization');
var propagateCategorizationToCurrentList = require('../categorization/PropagateCategorizationToCurrentList');
var propagateCategorizationToPastLists = require('../categorization/PropagateCategorizationToPastLists');

/**
 * Reacts to receiving a message on the supermarket-categorization topic
 */
exports.do = (event) => {

    // Extract data from the event
    let data = event;

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

}
