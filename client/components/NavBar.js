import React from 'react';

export default class NavBar extends React.Component {
  logout() {
    window.location = '/auth/logout';
  }

  render() {
    return (
      <div className="slds-page-header" role="banner">
        <div className="slds-grid">
          {/* Banner */}
          <div className="slds-col slds-has-flexi-truncate">
            <div className="slds-media slds-media--center slds-no-space slds-grow">
              <div className="slds-media__figure">
                <svg aria-hidden="true" className="slds-icon slds-icon-text-default">
                  <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#replace"></use>
                </svg>
              </div>
              <div className="slds-media__body">
                <p className="slds-page-header__title slds-truncate slds-align-middle" title="Salesforce React Integration">
                  Salesforce React Integration
                </p>
                <p className="slds-text-body--small page-header__info">A sample integration project between Salesforce Platform and a React application</p>
              </div>
            </div>
          </div>

          {
            /*  Logged user name */
            this.props.user == null ? null : <div className="slds-col--padded slds-no-flex slds-grid slds-align-middle">Hi {this.props.user.display_name}</div>
          }

          {
            /*   Logout button */
            this.props.user == null ? null : (
              <div className="slds-col slds-no-flex slds-grid">
                <button onClick={this.logout} className="slds-button slds-button--neutral">
                  <svg aria-hidden="true" className="slds-button__icon--stateful slds-button__icon--left">
                    <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#logout"></use>
                  </svg>
                  Log out
                </button>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}
