var React = require('react');

var NavBar = require('./NavBarComponent.js'),
  LoginPanel = require('./LoginPanelComponent.js'),
  QueryForm = require('./QueryFormComponent.js'),
  QueryResults = require('./QueryResultsComponent.js');


var App = module.exports = React.createClass({
  getInitialState: function() {
    return {user: null};
  },

  componentDidMount: function() {
	const that = this;
	// Get logged in user
	fetch('/auth/whoami', {
        method: 'get',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(function(response) {
		if (response.ok) {
			response.json().then(function(json) {
				that.setState({user: json});
			});
		} else if (response.status !== 401) { // Ignore 'unauthorized' responses before logging in
			console.error('Failed to retrieve logged user.', JSON.stringify(response));
		}
	});
  },

  handleQueryExecution: function(data) {
	const that = this;
	// Send SOQL query to server
	const queryUrl = '/query?q='+ encodeURI(data.query);
	fetch(queryUrl, {
        headers: {
            Accept: 'application/json'
		},
		cache: 'no-store'
    }).then(function(response) {
		response.json().then(function(json) {
			if (response.ok) {
				that.setState({result: JSON.stringify(json, null, 2)});
			} else {
				that.setState({result: 'Failed to retrieve query result.'});
			}
		});
	});
  },

  render: function() {
    return (
      <div>
        <NavBar user={this.state.user} />
        { this.state.user == null ?
          <LoginPanel />
          :
          <div className="slds-m-around--xx-large">
            <QueryForm onExecuteQuery={this.handleQueryExecution} />
            { this.state.result ?
              <QueryResults result={this.state.result} />
              :
              null
            }
          </div>
        }
      </div>
    );
  }
});
