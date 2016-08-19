#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('wheel:server');
var http = require('http');
var config = require('../config/config');
var mongoose = require('mongoose');
var charities = require('../db/charities');
/**
 * Get port from environment and store in Express.
 */

/** 
* Connect to Mongodb
*/
mongoose.connect(config.db);

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

var charitieschema = mongoose.Schema({
    name: String, 
    emotion: String, 
    lastSelected: Date,
    votes: Number
  }, 
  {collection: 'charities'});
var charityModel = mongoose.model('charity', charitieschema);
charityModel.find(function(err, charities) {
  if(charities && charities.length > 0) {
    
    // =========== ============ ============ ============
    // Un-comment this section to refresh charity list!
    // =========== ============ ============ ============

    charityModel.remove({}, function(err) {
       console.log('collection removed');
       populatecharities();
    });
  }
  else {
    populatecharities();
  }
});

var populatecharities = function() {
  charities.charities.forEach(function(charity) {
    new charityModel(charity).save(function(err, savedcharity) {
      if(err) console.error(err);
    });
  });
};

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
