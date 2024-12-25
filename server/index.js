// 3rd party dependencies
const path = require('path'),
  express = require('express'),
  session = require('express-session'),
  jsforce = require('jsforce');

// Load and check config
require('dotenv').config();
if (!(process.env.loginUrl && process.env.consumerKey && process.env.consumerSecret && process.env.callbackUrl && process.env.apiVersion && process.env.sessionSecretKey)) {
  console.error('Cannot start app: missing mandatory configuration. Check your .env file.');
  process.exit(-1);
}

// Instantiate Salesforce client with .env configuration
const oauth2 = new jsforce.OAuth2({
  loginUrl: process.env.loginUrl,
  clientId: process.env.consumerKey,
  clientSecret: process.env.consumerSecret,
  redirectUri: process.env.callbackUrl
});

// Setup HTTP server
const app = express();
const port = process.env.PORT || 8080;
app.set('port', port);

// Enable server-side sessions
app.use(
  session({
    secret: process.env.sessionSecretKey,
    cookie: { secure: process.env.isHttps === 'true' },
    resave: false,
    saveUninitialized: false
  })
);

// Serve HTML pages under root directory
app.use('/', express.static(path.join(__dirname, '../public')));

/**
 *  Attemps to retrieves the server session.
 *  If there is no session, redirects with HTTP 401 and an error message
 */
function getSession(request, response) {
  const session = request.session;
  if (!session.sfdcAuth) {
    response.status(401).send('No active session');
    return null;
  }
  return session;
}

function resumeSalesforceConnection(session) {
  return new jsforce.Connection({
    oauth2: oauth2,
    instanceUrl: session.sfdcAuth.instanceUrl,
    accessToken: session.sfdcAuth.accessToken,
    version: process.env.apiVersion
  });
}

/**
 * Login endpoint
 */
app.get('/auth/login', (request, response) => {
  // Redirect to Salesforce login/authorization page
  response.redirect(oauth2.getAuthorizationUrl({ scope: 'api' }));
});

/**
 * Login callback endpoint (only called by Salesforce)
 */
app.get('/auth/callback', async (request, response) => {
  if (!request.query.code) {
    response.status(500).send('Failed to get authorization code from server callback.');
    return;
  }

  // Authenticate with OAuth
  const conn = new jsforce.Connection({
    oauth2: oauth2,
    version: process.env.apiVersion
  });
  try {
    await conn.authorize(request.query.code);
    // Store oauth session data in server (never expose it directly to client)
    request.session.sfdcAuth = {
      instanceUrl: conn.instanceUrl,
      accessToken: conn.accessToken
    };
    // Redirect to app main page
    return response.redirect('/index.html');
  } catch (error) {
    console.log('Salesforce authorization error: ' + JSON.stringify(error));
    response.status(500).json(error);
    return;
  }
});

/**
 * Logout endpoint
 */
app.get('/auth/logout', async (request, response) => {
  const session = getSession(request, response);
  if (session == null) return;

  // Revoke OAuth token
  const conn = resumeSalesforceConnection(session);
  try {
    await conn.logout();
    // Destroy server-side session
    session.destroy((error) => {
      if (error) {
        console.error('Salesforce session destruction error: ' + JSON.stringify(error));
      }
    });
    // Redirect to app main page
    return response.redirect('/index.html');
  } catch (error) {
    console.error('Salesforce OAuth revoke error: ' + JSON.stringify(error));
    response.status(500).json(error);
    return;
  }
});

/**
 * Endpoint for retrieving currently connected user
 */
app.get('/auth/whoami', async (request, response) => {
  const session = getSession(request, response);
  if (session == null) {
    return;
  }

  // Request session info from Salesforce
  const conn = resumeSalesforceConnection(session);
  try {
    const identity = await conn.identity();
    response.send(identity);
  } catch (error) {
    console.error('Salesforce identity error: ' + JSON.stringify(error));
    response.status(500).json(error);
    return;
  }
});

/**
 * Endpoint for performing a SOQL query on Salesforce
 */
app.get('/query', async (request, response) => {
  const session = getSession(request, response);
  if (session == null) {
    return;
  }

  const query = request.query.q;
  if (!query) {
    response.status(400).send('Missing query parameter.');
    return;
  }

  const conn = resumeSalesforceConnection(session);
  try {
    const result = await conn.query(query);
    response.send(result);
  } catch (error) {
    console.error('Salesforce query error: ' + JSON.stringify(error));
    response.status(500).json(error);
    return;
  }
});

app.listen(app.get('port'), () => {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
