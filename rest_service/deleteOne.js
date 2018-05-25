/**
 * @fileOverview
 * This file implements the handler to delete an entry from the database given a uid.
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
 * Delete the object for which the uid is passed as a query parameter
 * @param event The Lambda event object by AWS
 * @param context The Lambda context object by AWS
 * @param callback The Lambda callback object by AWS
 */
exports.handler = (event, context, callback) => {
  // Call to our database service with uid received to check if object exists
  db_service.getOne(event.pathParameters.uid)
    .then(function(obj){
      // If object does not exist, send 404
      if(!obj) {
        return callback(null, constructErrorMessage(404, 'Could not find object to delete', event));
      }
      // Call to delete object from dynamodb
      db_service.deleteOne(event.pathParameters.uid)
        .then(function(obj){
          return callback(null, constructResponseMessage(200, {}));
        }, function(err){
          return callback(null, constructErrorMessage(500, 'Internal Server Error', event));
        });
    }, function(err) {
      return callback(null, constructErrorMessage(500, 'Internal Server Error', event));
    });
};
