  'use strict';
  var express = require('express');
  var expressValidator = require('express-validator');
  var mongoose = require('mongoose');
  var bodyParser = require('body-parser');
  var app = express();
  var router = require('./routes/route');

  app.use(bodyParser.json()); // parse application/json
  app.use(bodyParser.urlencoded({'extended':'false'}));
  app.use(expressValidator());
  //It's temp fix in mongodb latest version - inorder to enbale global promise.
  mongoose.Promise = global.Promise;
  //Connecting MongoDB using mongoose
  mongoose.connect('mongodb://localhost:27017/expense-tracker');
  app.use('/',router);
  //Express application will listen to port mentioned in our configuration
  app.listen(3000, function(err){
    if(err) throw err;
    console.log("App listening on port 3000");
  });
