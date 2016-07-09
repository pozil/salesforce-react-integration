var $ = require('jquery'),
  React = require('react');

var NavBar = require('./NavBarComponent.js'),
  LoginPanel = require('./LoginPanelComponent.js'),
  QueryForm = require('./QueryFormComponent.js'),
  QueryResults = require('./QueryResultsComponent.js');


var App = module.exports = React.createClass({
  getInitialState: function() {
    return {user: null};
  },

  componentDidMount: function() {
    // Get logged in user
    $.ajax({
      url: '/auth/whoami',
      dataType: 'json',
      success: function(data) {
        this.setState({user: data});
      }.bind(this),
      error: function(xhr, status, err) {
        if (xhr.status != 401) // Ignore 'unauthorized' responses before logging in
          console.error('Failed to retrieve logged user.');
      }.bind(this)
    });
  },

  handleQueryExecution: function(data) {
    // Send SOQL query to server
    $.ajax({
      url: '/query',
      dataType: 'json',
      cache: false,
      data: {q: data.query},
      success: function(data) {
        this.setState({result: JSON.stringify(data, null, 2)});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({result: 'Failed to retrieve query result.'});
      }.bind(this)
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
