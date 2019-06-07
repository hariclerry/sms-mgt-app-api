[![Build Status](https://travis-ci.org/hariclerry/sms-mgt-app-api.svg?branch=master)](https://travis-ci.org/hariclerry/sms-mgt-app-api)

# SMS Management APP

 SMS Management APP is a system that stores and manages contacts records and sends SMS.


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
|POST/api/v1/contact|Creates a new contact|
|PUT/api/v1/contact/:contactId|Updates a contact|
|DELETE/api/v1/busicontactnesses/:contactId|Removes a contact|
|GET/api/v1/contact|Retrieves all contacts|
|GET/api/v1/contact/:contactId|Gets a contact|
|POST/api/v1/contactId/sub|Creates a new sub contact|
|PUT/api/v1/contact/:contactId/sub/:id|Updates a contact|
|DELETE/api/v1/contact/:contactId/sub/:id|Removes a contact|
|GET/api/v1/contact/:contactId/sub|Retrieves all sub contacts|
|GET/api/v1/contact/:contactId/sub/:id|Gets a sub contact|

### Checkout the live app on heroku
Heroku link: https://population-mgt-sys.herokuapp.com/

### API Documentation with POSTMAN
Test the API with Postman here https://documenter.getpostman.com/view/7685370/S1TVXHpW

The API is written in Node.Js using the Express framework and mongoDB as the database dialect.
