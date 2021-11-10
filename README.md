# Salesforce React integration

## About

Sample integration project between Salesforce and a React application.

This app demonstrates the following concepts:

- using [JSforce](https://jsforce.github.io) as a Salesforce client
  - authenticating with OAuth 2.0 (login, logout, retrieving session info)
  - using the REST API to run a SOQL query
- using the [Lightning Design System](https://www.lightningdesignsystem.com) (LDS) in a React application (all the CSS and icons of this app are provided by LDS)

The source code of this app is structured in the following way:

- the `client` directory holds the React app
- the `server` directory holds the node.js app that acts as a middleware with the Salesforce Platform

If you are building a React app with LDS, consider using the [React LDS base components](https://react.lightningdesignsystem.com/).

## Installation

1. Create a [Connected App](https://help.salesforce.com/articleView?id=connected_app_create.htm) in Salesforce.

1. Create a `.env` file in the root directory of this project and add this content (make sure to replace the values):

   ```
   loginUrl='https://login.salesforce.com'
   callbackUrl='http://localhost:8080/auth/callback'
   consumerKey='YOUR_CLIENT_KEY'
   consumerSecret='YOUR_CLIENT_SECRET'
   apiVersion='53.0'

   isHttps='false'
   sessionSecretKey='A_SECRET_STRING'
   ```

1. Run `npm run build` to build the app.

1. Run `npm start` to start the app.

## Screenshots

<div align="center">
	<img src="screenshots/login.png" width="45%" alt="Login screen"/>
	<img src="screenshots/main.png" width="45%" alt="Main screen"/>
</div>
