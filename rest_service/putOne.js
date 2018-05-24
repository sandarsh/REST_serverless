'use strict';

const constructErrorMessage = require('./getAll.js').constructErrorMessage;
const constructResponseMessage = require('./getAll.js').constructResponseMessage;
const db_service = require('../db_service/dynamoInvoke');


exports.handler = (event, context, callback) => {
  // console.log(event);
  let obj;
  try {
    obj = JSON.parse(event.body);
  } catch (e) {
    return callback(null, constructErrorMessage(400, 'Malformed JSON', event));
  }
  if (obj.hasOwnProperty('uid')) {
    return callback(null, constructErrorMessage(400, 'Attribute \'uid\' not allowed', event));
  }
  db_service.putOne(obj)
    .then(function(res){
      // console.log(res);
      return callback(null, constructResponseMessage(201, res));
    }, function(err) {
      // console.log(err);
      return callback(null, constructErrorMessage(500, 'Could not put Item', event));
    })
};
