'use strict';

const constructErrorMessage = require('./getAll.js').constructErrorMessage;
const constructResponseMessage = require('./getAll.js').constructResponseMessage;
const db_service = require('../db_service/dynamoInvoke');


exports.handler = (event, context, callback) => {
  // console.log(event);
  const queryUid = event.pathParameters.uid;
  let obj;
  try {
    obj = JSON.parse(event.body);
  } catch (e) {
    return callback(null, constructErrorMessage(400, 'Malformed JSON', event));
  }
  if (!obj.hasOwnProperty('uid')) {
    return callback(null, constructErrorMessage(400, 'Attribute \'uid\' not found in body', event));
  }
  if (obj.uid !== queryUid) {
    return callback(null, constructErrorMessage(400, 'Attribute \'uid\' mismatch in url and body', event));
  }
  db_service.getOne(queryUid)
    .then(function(oldObj){
      if (!oldObj) {
        return callback(null, constructErrorMessage(404, 'Could not find object to replace', event));
      }
      db_service.replaceOne(obj)
        .then(function(res){
          return callback(null, constructResponseMessage(200, res));
        }, function(err) {
          // console.log(err);
          return callback(null, constructErrorMessage(500, 'Internal Server Error', event));
        })
    }, function(err){
      return callback(null, constructErrorMessage(500, 'Internal Server Error', event));
    });
};