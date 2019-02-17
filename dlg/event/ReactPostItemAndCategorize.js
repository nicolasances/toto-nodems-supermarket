var moment = require('moment-timezone');
var getCurrentListItem = require('../GetCurrentListItem');
var putCurrentListItem = require('../PutCurrentListItem');
var getManualCategorizations = require('../categorization/GetManualCategorizations');

/**
 * Reacts to a POSTed item to categorize it
 */
exports.do = (event) => {

    // Extract data from the event
    let data = event;

    // Only care about POSTed items
    if (data.action != 'POST') return;

    let itemId = data.itemId;

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
        putCurrentListItem.do(itemId, {automatic: true, category: items[0].categoryId});

      })
    });

};
