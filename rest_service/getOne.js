/**
 * @fileOverview
 * This file implements the handler to get a single object from the db given its uid
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
 * Get the object for which the uid is passed as a query parameter
 * @param event The Lambda event object by AWS
 * @param context The Lambda context object by AWS
 * @param callback The Lambda callback object by AWS
 */
exports.handler = (event, context, callback) => {
  // Call to our dynamodb service
  db_service.getOne(event.pathParameters.uid)
    .then(function(obj){
      // Handle null return when object is not found.
        if (!obj) {
          return callback(null, constructErrorMessage(404, 'Object not found', event));
        }
        return callback(null, constructResponseMessage(200, obj));
      }, function(err){
        return callback(null, constructErrorMessage(500, 'Internal Server Error', event));
    });
};
