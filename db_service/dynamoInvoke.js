'use strict';

const AWS  = require('aws-sdk');
AWS.config.region = 'us-east-1';

const dynamo = new AWS.DynamoDB.DocumentClient();
const uniqid = require('uniqid');

exports.replaceOne = function(obj) {
  return new Promise(function(resolve, reject) {
    const uid = obj.uid;
    const params = {
      TableName: process.env.DDB_TABLE,
      Item: {
        uid: uid,
        doc: obj
      }
    };
    dynamo.put(params, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(obj);
      }
    })
  })
};

exports.getAll = function () {
  return new Promise(function (resolve, reject) {
    const params = {
      TableName: process.env.DDB_TABLE,
    };
    dynamo.scan(params, function(err, data) {
      if (err) {
        return reject(err);
      }
      else {
        return resolve(data);
      }
    });
  });
};

exports.getOne = function (uid) {
  return new Promise(function (resolve, reject) {
    const params = {
      TableName: process.env.DDB_TABLE,
      Key: {
        uid : uid
      }
    };
    dynamo.get(params, function(err, data) {
      if (err) {
        return reject(err);
      }
      else {
        if (data.Item) {
          return resolve(data.Item.doc);
        } else {
          return resolve(null);
        }
      }
    });
  });
};

exports.putOne = function(obj){
  return new Promise(function (resolve, reject) {
    const objId = uniqid();
    obj.uid = objId;
    const params = {
      TableName: process.env.DDB_TABLE,
      Item: {
        uid: objId,
        doc: obj
      }
    };
    dynamo.put(params, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(obj);
      }
    })
  })
};

exports.deleteOne = function (uid) {
  return new Promise(function (resolve, reject) {
    const params = {
      TableName: process.env.DDB_TABLE,
      Key: {
        uid : uid
      }
    };
    dynamo.delete(params, function(err, data) {
      if (err) {
        return reject(err);
      }
      else {
        return resolve(data);
      }
    });
  });
};

