// app.js
var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.set('debug', true);
var async = require('async');
var fs = require('fs');
var path = require('path');
var Item = require('./models/Item');
var bodyParser = require('body-parser');
var dbConfig = require('./config/db');

mongoose.connect(dbConfig.url, function(err) {
  if(err) {
    mongoose.connection.close();
    throw err;
  }

  var itemStr = fs.readFileSync(path.join(__dirname, 'data', 'items.json'), 'utf8');
  var isoRegex = /ISODate\((".+?")\)/g;
  itemStr = itemStr.replace(isoRegex, function (match, parenGroup) {
      return parenGroup;
  });

  var itemData = JSON.parse(itemStr);

  Item.remove(function() {
    async.each(itemData, function(item, callback) {
      Item.create(item, callback);
    }, function(err) {
      if(err) {
        throw err;
      }

      mongoose.connection.close();
    });
  });
});

// Use bodyParser()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

//  The entire list sorted by creation date (Ascending and Descending)
// * The entire listed sorted by the item’s price (Ascending and Descending)
// * A route to request for items within 50 miles of their location coordinates

// * Any single item by its id
app.get('/items/:id', function(req, res) {
  var itemId = req.params.id;
  var db = mongoose.connect(dbConfig.url);
  Item.findOne({ id: itemId }, function(err, result) {
    db.disconnect();
    res.json(result);
  });
});

app.get('/items', function(req, res) {
  var db = mongoose.connect(dbConfig.url);

  Item.findItems(req.query, function(err, result) {
    db.disconnect();

    console.log('result',result, err)
    res.json(result);
  });
});

app.listen(port);
console.log('server start');