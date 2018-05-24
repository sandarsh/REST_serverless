'use strict';

const constructErrorMessage = require('./getAll.js').constructErrorMessage;
const constructResponseMessage = require('./getAll.js').constructResponseMessage;
const db_service = require('../db_service/dynamoInvoke');

exports.handler = (event, context, callback) => {
  db_service.getOne(event.pathParameters.uid)
    .then(function(obj){
      if(!obj) {
        return callback(null, constructErrorMessage(404, 'Could not find object to delete', event));
      }
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
