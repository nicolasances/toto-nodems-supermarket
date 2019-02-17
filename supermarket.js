var Controller = require('toto-api-controller');
var TotoEventConsumer = require('toto-event-consumer');
var totoEventPublisher = require('toto-event-publisher');

var getMissingGoods = require('./dlg/GetMissingGoodsDelegate');
var postMissingGood = require('./dlg/PostMissingGoodDelegate');
var getMissingGood = require('./dlg/GetMissingGoodDelegate');
var deleteMissingGood = require('./dlg/DeleteMissingGoodDelegate');
var deleteMissingGoods = require('./dlg/DeleteMissingGoodsDelegate');
var putMissingGood = require('./dlg/PutMissingGoodDelegate');

var closeCurrentList = require('./dlg/CloseCurrentList');
var postCurrentListItem = require('./dlg/PostCurrentListItem');
var getCurrentListItems = require('./dlg/GetCurrentListItems');
var deleteCurrentListItem = require('./dlg/DeleteCurrentListItem');
var putCurrentListItem = require('./dlg/PutCurrentListItem');

var getPastLists = require('./dlg/GetPastLists');
var getPastList = require('./dlg/GetPastList');
var payPastList = require('./dlg/PayPastList');
var putPastListItem = require('./dlg/PutPastListItem');

var getCommonItems = require('./dlg/GetCommonItems');

var reactCategorization = require('./dlg/event/ReactCategorization');
var reactPostItemAndCategorize = require('./dlg/event/ReactPostItemAndCategorize');

// API
var apiName = 'supermarket';

// Registering event producers
totoEventPublisher.registerTopic({topicName: 'supermarket-categorization', microservice: apiName}).then(() => {}, (err) => {console.log(err);});
totoEventPublisher.registerTopic({topicName: 'supermarket-items', microservice: apiName}).then(() => {}, (err) => {console.log(err);});

// Start the event REACTors
var eventConsumer = new TotoEventConsumer(apiName, 'supermarket-categorization', reactCategorization.do);
var eventConsumer = new TotoEventConsumer(apiName, 'supermarket-items', reactPostItemAndCategorize.do);

// Starting api
var api = new Controller(apiName, totoEventPublisher, null);

api.path('GET', '/missingGoods', getMissingGoods);
api.path('DELETE', '/missingGoods', deleteMissingGoods);
api.path('POST', '/missingGoods', postMissingGood);
api.path('GET', '/missingGoods/:id', getMissingGood);
api.path('PUT', '/missingGoods/:id', putMissingGood);
api.path('DELETE', '/missingGoods/:id', deleteMissingGood);

api.path('PUT', '/currentList', closeCurrentList);
api.path('POST', '/currentList/items', postCurrentListItem);
api.path('GET', '/currentList/items', getCurrentListItems);
api.path('DELETE', '/currentList/items/:id', deleteCurrentListItem);
api.path('PUT', '/currentList/items/:id', putCurrentListItem);

api.path('GET', '/pastLists', getPastLists);
api.path('GET', '/pastLists/:id', getPastList);
api.path('POST', '/pastLists/:id/pay', payPastList);
api.path('PUT', '/pastLists/:id/items/:name', putPastListItem);

api.path('GET', '/commonItems', getCommonItems);

api.listen();
