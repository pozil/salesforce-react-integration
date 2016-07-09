var React = require('react');


var QueryResults = module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <p className="slds-form-element__label  slds-text-heading--medium">Results</p>
        <div className="slds-box slds-theme--shade">
          <pre>{this.props.result}</pre>
        </div>
      </div>
    );
  }
});
