# Serverless REST API using AWS Lambda and Serverless

#### Visit https://9bsys64zh0.execute-api.us-east-1.amazonaws.com/api/objects to see the app deployed
#### Serverless framework deploys the app directly to AWS lambda

### Tools Used:
* Serverless Framework - Framework for serverless development
* NodeJS - Javascript runtime
* DynamoDB - Database

### Design
This application follows a Service Oriented Architecture.
The db_service folder consists of minimal database operations with the only function of fetching the data from DynamoDB while making sure:
* The dynamodb API is called appropriately while providing and abstraction for other services.  

The rest_service folder has the implementation for the assignment. The folder consists of various lambda handlers for various routes as described in the requirements.  
* These services are only concerned with API level validation and error handling.
* Once the above is done, it makes a call to the 'db_service' service to fetch the object(s) required, translates into required API response and responds back to the requester. 

### Future Enhancements
This section mentions further enhancement that can be made to improve this service:
* User management
    * Generate API keys for users.
    * Authentication, authorization and session management.

* API enhancement
    * Rate Limiting, throttling, timeouts and other security features.
    * Integrate API management to get statistics on the number of requests made and from which account.
    * Some form of schema definition.
    * More querying options:
        * Implement attribute level fetching - given the 'uid', fetch only specific attributes and not the entire object.
        * Conditional fetching - Fetch all entries '>' or '<' or equal to a given value for an attribute.
        * Bulk Operations - create, replace or delete multiple documents in a single request.

### Serverless Framework
The serverless framework provides an easy to work with framework to deploy to AWS Lambda and create services quickly.  
The only requirement is for the keys to be configured. Set up your AWS account and get the keys from the IAM section under your username.
To configure your keys simply type the below in the terminal:
> aws configure
  
and follow the prompts.  
For more information visit https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html


### Running on Local Environment
#### Requirements:
* Node.js
* Serverless Framework
* AWS CLI
#### Instructions
* Configure your AWS keys for the account you want the app to be deployed on. This could be a test, dev or prod account.
* Clone this repo.
* Run 'npm install' to install all dependencies.
* Run `npm install serverless -g` which installs serverless framework globally.
* Run `sls deploy` to deploy to AWS using default keys or `sls deploy --profile <profile_name>` to deploy to another account.
>Note: The first deployment takes longer because it creates all the required resources.
* Your lambda functions are now deployed. You should see the framework spit out the URLs your app is available on.
* Serverless Framework provides various features including deploying single functions, fetching logs, invoking specific functions etc.  
For more information on various possibilities visit https://serverless.com/
  

