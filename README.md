[![Build Status](https://travis-ci.org/hariclerry/sms-mgt-app-api.svg?branch=master)](https://travis-ci.org/hariclerry/sms-mgt-app-api)
[![Coverage Status](https://coveralls.io/repos/github/hariclerry/sms-mgt-app-api/badge.svg)](https://coveralls.io/github/hariclerry/sms-mgt-app-api)

# SMS Management APP

 SMS Management APP is a system that creates and stores contacts, it is used to send SMS to available cotacts.

### FEATURES

With SMS Management APP you can:
* Create a user account
* Login into the user account
* Add a new contact
* view a list of all contacts
* Update a contact
* View a contact
* Delete a contact
* Send sms to a contacts
* View an sms
* Delete an sms

### Requirements
* Node v10.0.0
* Express framework
* MongoDB and Mongoose

### Installation

1. Clone the repository

2. Install dependencies
  ```npm install```

3. Run app
 ```npm start```

4. To build the app
 ```npm run build```

5. Testing

* In order to test the application you can the command
```npm run test``` 

VERSIONS

The API runs with one version, Version 1 

Input `http:127.0.0.1:3000/` followed by any of the following endpoints to demo version 1.

|EndPoint|Functionality|
|---------|------------|
|POST/api/v1/user|Creates a new user account|
|POST/api/v1/user/login|Logs in a user|
|POST/api/v1/contacts|Creates a new contact|
|PUT/api/v1/contacts/:contactId|Updates a contact|
|DELETE/api/v1/contacts/:contactId|Removes a contact|
|GET/api/v1/contacts|Retrieves all contacts|
|GET/api/v1/contacts/:contactId|Gets a contact|
|POST/api/v1/contactId/sms|Sends sms to a contact|
|DELETE/api/v1/contactS/:contactId/sms/:smsId|Removes a contact|
|GET/api/v1/contactS/:contactId/sms/:smsId|Gets a sms|

### Checkout the live app on heroku
Heroku link: TODO

### API Documentation with POSTMAN
Test the API with Postman here: TODO

The API is written in Node.Js using the Express framework and mongoDB as the database dialect.
