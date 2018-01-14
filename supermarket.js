var express = require('express');
var Promise = require('promise');
var bodyParser = require("body-parser");

var getMissingGoodsDlg = require('./dlg/GetMissingGoodsDelegate');
var postMissingGoodDlg = require('./dlg/PostMissingGoodDelegate');
var getMissingGoodDlg = require('./dlg/GetMissingGoodDelegate');
var deleteMissingGoodDlg = require('./dlg/DeleteMissingGoodDelegate');
var deleteMissingGoodsDlg = require('./dlg/DeleteMissingGoodsDelegate');
var putMissingGoodDlg = require('./dlg/PutMissingGoodDelegate');

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, GoogleIdToken");
  res.header("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
  next();
});
app.use(bodyParser.json());

app.get('/', function(req, res) {res.send({status: 'running'});});
app.get('/missingGoods', function(req, res) {getMissingGoodsDlg.getMissingGoods({bought: req.params.bought}).then(function(result) {res.send(result);});});
app.delete('/missingGoods', function(req, res) {deleteMissingGoodsDlg.deleteMissingGoods({bought: req.params.bought}).then(function() {res.send();});});
app.post('/missingGoods', function(req, res) {postMissingGoodDlg.postMissingGood(req.body).then(function(result) {res.send(result);});});
app.get('/missingGoods/:id', function(req, res) {getMissingGoodDlg.getMissingGood(req.params.id).then(function(result) {res.send(result);});});
app.put('/missingGoods/:id', function(req, res) {putMissingGoodDlg.putMissingGood(req.params.id, req.body).then(function(result) {res.send(result);});});
app.delete('/missingGoods/:id', function(req, res) {deleteMissingGoodDlg.deleteMissingGood(req.params.id).then(function() {res.send()});});

app.listen(8080, function() {
  console.log('Supermarket Microservice up and running');
});
