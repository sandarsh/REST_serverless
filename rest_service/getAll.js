'use strict';
const db_service = require('../db_service/dynamoInvoke');

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

function constructResponseMessage(statusCode, data){
  return {
    statusCode: statusCode,
    body: JSON.stringify(data)
  }
}

function constructUrl(event){
  console.log(event);
  const currentPath = event.requestContext.path;
  if (currentPath[currentPath.length - 1] === '/') {
    return 'https://'+ event.headers.Host + currentPath;
  }
  return 'https://'+ event.headers.Host + currentPath + '/';
}

module.exports.handler = (event, context, callback) => {
  return db_service.getAll()
    .then((data) => {
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

module.exports.constructUrl = constructUrl;
module.exports.constructResponseMessage = constructResponseMessage;
module.exports.constructErrorMessage = constructErrorMessage;
