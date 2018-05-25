/**
 * @fileOverview
 * Implements the handler to replace an existing object
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
 * Replace the object for which the uid is passed as a query parameter and in the object body
 * @param event The Lambda event object by AWS
 * @param context The Lambda context object by AWS
 * @param callback The Lambda callback object by AWS
 */
exports.handler = (event, context, callback) => {
  // Extract uid from path parameters
  const queryUid = event.pathParameters.uid;
  let obj;
  // Parsing the incoming object to check for valid JSON
  try {
    obj = JSON.parse(event.body);
  } catch (e) {
    // Return error if malformed JSON
    return callback(null, constructErrorMessage(400, 'Malformed JSON', event));
  }
  // Check if uid present in incoming object body. Return error if not.
  if (!obj.hasOwnProperty('uid')) {
    return callback(null, constructErrorMessage(400, 'Attribute \'uid\' not found in body', event));
  }
  // Check if the path parameter and uid in the body are the same, return error if not.
  if (obj.uid !== queryUid) {
    return callback(null, constructErrorMessage(400, 'Attribute \'uid\' mismatch in url and body', event));
  }
  // Call to our db service to check if object exists
  db_service.getOne(queryUid)
    .then(function(oldObj){
      // Return 404 if object was not found.
      if (!oldObj) {
        return callback(null, constructErrorMessage(404, 'Could not find object to replace', event));
      }
      // Call to our db service to replace object
      db_service.replaceOne(obj)
        .then(function(res){
          return callback(null, constructResponseMessage(200, res));
        }, function(err) {
          return callback(null, constructErrorMessage(500, 'Internal Server Error', event));
        })
    }, function(err){
      return callback(null, constructErrorMessage(500, 'Internal Server Error', event));
    });
};
