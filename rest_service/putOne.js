/**
 * @fileOverview
 * Implements the handler for posting a new object to the database
 * ...
 * Author: Sandarsh Srivastava
 * ...
 */
'use strict';

/**
 * Import helper function to construct an error message.
 * @type {constructErrorMessage}
 */
const constructErrorMessage = require('./getAll.js').constructErrorMessage;

/**
 * Import helper function to construct a response message.
 * @type {constructResponseMessage}
 */
const constructResponseMessage = require('./getAll.js').constructResponseMessage;

/**
 * Import our dynamodb service
 */
const db_service = require('../db_service/dynamoInvoke');

/**
 * Create a new object which is passed in the request body
 * @param event
 * @param context
 * @param callback
 * @returns {*}
 */
exports.handler = (event, context, callback) => {
  let obj;
  // Parsing the incoming object to check for valid JSON
  try {
    obj = JSON.parse(event.body);
  } catch (e) {
    // Return error if malformed JSON
    return callback(null, constructErrorMessage(400, 'Malformed JSON', event));
  }
  // Check if object already has a uid field. Cannot create such objects.
  if (obj.hasOwnProperty('uid')) {
    return callback(null, constructErrorMessage(400, 'Attribute \'uid\' not allowed', event));
  }
  // Call to out db service
  db_service.putOne(obj)
    .then(function(res){
      return callback(null, constructResponseMessage(201, res));
    }, function(err) {
      return callback(null, constructErrorMessage(500, 'Could not put Item', event));
    })
};
