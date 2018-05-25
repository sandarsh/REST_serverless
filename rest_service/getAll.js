/**
 * @fileOverview
 * This file implements the method to get all the entries in the dynamodb table
 * and return an array of url's for the received uid's.
 * ...
 * It also implements some helper function to create response and error messages.
 * For future work, these utility functions can be moved to a section/folder of their own.
 * ...
 * Author: Sandarsh Srivastava
 * ...
 */
'use strict';

/**
 * Load our database service
 */
const db_service = require('../db_service/dynamoInvoke');

/**
 * Construct an error message as specified in the requirement
 * @param statusCode The status code to be sent back
 * @param message The message to be sennt back as string.
 * @param event The Lambda event object by AWS
 * @returns {{statusCode: *, body}} The object to pass to callback to send back a response to the requester
 */
function constructErrorMessage(statusCode, message, event){
  const errBody = {
    verb: event.httpMethod,
    message: message,
    url: 'https://' + event.headers.Host + event.requestContext.path
  };
  return {
    statusCode: statusCode,
    body: JSON.stringify(errBody)
  }
}

/**
 * Construct a message to send back to the requester
 * @param statusCode The status code to be sent back
 * @param data The data to be sent back
 * @returns {{statusCode: *, body}} The object to pass to callback to send back a response to the requester
 */
function constructResponseMessage(statusCode, data){
  return {
    statusCode: statusCode,
    body: JSON.stringify(data)
  }
}

/**
 * Helper to construct url to be returned by getAll.
 * @param event The Lambda event object by AWS
 * @returns {string} The url string.
 */
function constructUrl(event){
  console.log(event);
  const currentPath = event.requestContext.path;
  if (currentPath[currentPath.length - 1] === '/') {
    return 'https://'+ event.headers.Host + currentPath;
  }
  return 'https://'+ event.headers.Host + currentPath + '/';
}

/**
 * Returns the urls of all the objects currently in the database.
 * @param event The Lambda event object by AWS
 * @param context The Lambda context object by AWS
 * @param callback The Lambda callbacl object by AWS
 * @returns {Promise.<TResult>} Resolves to an array of urls of all objects in the db
 */
module.exports.handler = (event, context, callback) => {
  // Call to our db service getAll()
  return db_service.getAll()
    .then((data) => {
    // Map returned array and change each object to its url as specified in the requirements.
      data = data.Items.map((each) => {
        return {
          url: constructUrl(event) + each.uid
        }
      });
      const response = constructResponseMessage(200, data);
      return callback(null, response)
    }, (err) => {
      const error = constructErrorMessage(500, 'Could not get from Database', event);
      return callback(null, error);
    })
};

/**
 * Export utility functions to be used in other services.
 */
module.exports.constructUrl = constructUrl;
module.exports.constructResponseMessage = constructResponseMessage;
module.exports.constructErrorMessage = constructErrorMessage;
