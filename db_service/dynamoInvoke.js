/**
 * @fileOverview
 * This file contains the core db services.
 * The features implemented in this service are limited to calls to the databse
 * and resolving the objects.
 * These calls should provide all the basic wrappers over dynamodb API for higher level
 * services to use. New calls to db should be created as part of this service.
 * ...
 * Author: Sandarsh Srivastava
 * ...
 */
'use strict';

/**
 * Load AWS-SDK
 */
const AWS  = require('aws-sdk');
// Set region to us-east-1
AWS.config.region = 'us-east-1';

/**
 * Load dynamodb client to make calls to the database
 * @type {AWS.DynamoDB.DocumentClient} DynamoDB's client interface
 */
const dynamo = new AWS.DynamoDB.DocumentClient();

/**
 * Load uniqid to create unique ids for the objects.
 * Dynamo does not support automatic id creation
 */
const uniqid = require('uniqid');

/**
 * Replace the object in the database with the incoming object
 * @param obj The new object
 * @returns {Promise} Promise, resolves to the newly inserted object. Error otherwise.
 */
exports.replaceOne = function(obj) {
  return new Promise(function(resolve, reject) {
    const uid = obj.uid;
    // Create params for dynamodb API call
    const params = {
      TableName: process.env.DDB_TABLE,
      Item: {
        uid: uid,
        doc: obj
      }
    };
    // Dynamodb call to put object
    dynamo.put(params, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(obj);
      }
    })
  })
};

/**
 * Get all the object in the table
 * @returns {Promise} Resolves to an array of all items in the table
 */
exports.getAll = function () {
  return new Promise(function (resolve, reject) {
    // Create params for dynamodb API call
    const params = {
      TableName: process.env.DDB_TABLE,
    };
    // Dynamodb call to scan the table
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

/**
 * Fetch the obj with the incoming uid.
 * @param uid The uid to fetch from the database
 * @returns {Promise} Resolves to the object with matching uid.
 */
exports.getOne = function (uid) {
  return new Promise(function (resolve, reject) {
    //Create params for dynamodb API call
    const params = {
      TableName: process.env.DDB_TABLE,
      Key: {
        uid : uid
      }
    };
    // Dynamodb call to get one item with the specified uid.
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

/**
 * Create a new entry in the dynamodb table
 * @param obj The object to be inserted in the table
 * @returns {Promise} Resolves to a success message from dynamodb.
 */
exports.putOne = function(obj){
  return new Promise(function (resolve, reject) {
    // Create unique id for the object
    const objId = uniqid();
    obj.uid = objId;
    // Create params for dynamodb API call
    const params = {
      TableName: process.env.DDB_TABLE,
      Item: {
        uid: objId,
        doc: obj
      }
    };
    // Dynamodb call to put the new item in the database
    dynamo.put(params, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(obj);
      }
    })
  })
};

/**
 * Delete the object with the incoming uid from the database
 * @param uid The uid of the object to be deleted
 * @returns {Promise} Resolves to success message from dynamodb
 */
exports.deleteOne = function (uid) {
  return new Promise(function (resolve, reject) {
    // Create params for dynamodb API call
    const params = {
      TableName: process.env.DDB_TABLE,
      Key: {
        uid : uid
      }
    };
    // API call to delete the object
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

