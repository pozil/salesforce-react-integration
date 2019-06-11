# Salesforce React.js integration

## About
Sample integration project between Salesforce and a React.js application.

This application demonstrates the following concepts:
- use of the [Salesforce Node client](https://github.com/pozil/salesforce-node-client) library for Force.com OAuth 2.0 authentication and data interaction
- use of the [Salesforce Lightning Design System](https://www.lightningdesignsystem.com) (SLDS) in a web application (all the CSS is provided by SLDS)

## Configuration

Create a `.env` file in the root directory with this content (make sure to replace the values):
```
domain='https://login.salesforce.com'
callbackUrl='http://localhost:8080/auth/callback'
consumerKey='YOUR_CLIENT_KEY'
consumerSecret='YOUR_CLIENT_SECRET'
apiVersion='v45.0'

isHttps='false'
sessionSecretKey='A_SECRET_STRING'
```


## Screenshots
<div style="text-align:center;">
	<img src="/screenshots/login.png?raw=true" width="45%" alt="Login screen"/>
	<img src="/screenshots/main.png?raw=true" width="45%" alt="Main screen"/>
</div>
