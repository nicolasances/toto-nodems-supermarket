var express = require('express');
var Promise = require('promise');
var bodyParser = require("body-parser");
var logger = require('toto-apimon-events');

var getMissingGoodsDlg = require('./dlg/GetMissingGoodsDelegate');
var postMissingGoodDlg = require('./dlg/PostMissingGoodDelegate');
var getMissingGoodDlg = require('./dlg/GetMissingGoodDelegate');
var deleteMissingGoodDlg = require('./dlg/DeleteMissingGoodDelegate');
var deleteMissingGoodsDlg = require('./dlg/DeleteMissingGoodsDelegate');
var putMissingGoodDlg = require('./dlg/PutMissingGoodDelegate');

var postCurrentListItem = require('./dlg/PostCurrentListItem');
var getCurrentListItems = require('./dlg/GetCurrentListItems');
var deleteCurrentListItem = require('./dlg/DeleteCurrentListItem');

var apiName = 'supermarket';

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
  next();
});
app.use(bodyParser.json());

app.get('/', function(req, res) {res.send({api: apiName, status: 'running'});});
app.get('/missingGoods', function(req, res) {logger.apiCalled('supermarket', '/missingGoods', 'GET', req.query, req.params, req.body); getMissingGoodsDlg.getMissingGoods({bought: req.params.bought}).then(function(result) {res.send(result);});});
app.delete('/missingGoods', function(req, res) {logger.apiCalled('supermarket', '/missingGoods', 'DELETE', req.query, req.params, req.body); deleteMissingGoodsDlg.deleteMissingGoods({bought: req.params.bought}).then(function() {res.send();});});
app.post('/missingGoods', function(req, res) {logger.apiCalled('supermarket', '/missingGoods', 'POST', req.query, req.params, req.body); postMissingGoodDlg.postMissingGood(req.body).then(function(result) {res.send(result);});});
app.get('/missingGoods/:id', function(req, res) {logger.apiCalled('supermarket', '/missingGoods/{id}', 'GET', req.query, req.params, req.body); getMissingGoodDlg.getMissingGood(req.params.id).then(function(result) {res.send(result);});});
app.put('/missingGoods/:id', function(req, res) {logger.apiCalled('supermarket', '/missingGoods/{id}', 'PUT', req.query, req.params, req.body); putMissingGoodDlg.putMissingGood(req.params.id, req.body).then(function(result) {res.send(result);});});
app.delete('/missingGoods/:id', function(req, res) {logger.apiCalled('supermarket', '/missingGoods/{id}', 'DELETE', req.query, req.params, req.body); deleteMissingGoodDlg.deleteMissingGood(req.params.id).then(function() {res.send()});});

app.post('/currentList/items', function(req, res) {logger.apiCalled('supermarket', '/currentList/items', 'POST', req.query, req.params, req.body); postCurrentListItem.do(req.body).then(function(result) {res.send(result);});});
app.get('/currentList/items', function(req, res) {logger.apiCalled('supermarket', '/currentList/items', 'GET', req.query, req.params, req.body); getCurrentListItems.do().then(function(result) {res.send(result);});});
app.delete('/currentList/items/:id', function(req, res) {logger.apiCalled('supermarket', '/currentList/items/:id', 'DELETE', req.query, req.params, req.body); deleteCurrentListItem.do(req.params.id).then(function(result) {res.send(result);});});


app.listen(8080, function() {
  console.log('Supermarket Microservice up and running');
});
