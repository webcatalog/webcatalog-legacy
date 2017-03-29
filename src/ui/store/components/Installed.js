/* global window document shell */
import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { NonIdealState } from '@blueprintjs/core';

import { INSTALLED } from '../constants/statuses';

import Card from './Card';

class Installed extends React.Component {
  renderList() {
    const { managedApps } = this.props;

    const installedApps = managedApps.filter(app => app.get('status') === INSTALLED);

    if (installedApps.size < 1) {
      return (
        <NonIdealState
          visual="import"
          title="No installed apps"
          description="Your installed apps will show up here."
        />
      );
    }

    const officialApps = installedApps.filter(app => !app.get('id').startsWith('custom-'));
    const customApps = installedApps.filter(app => app.get('id').startsWith('custom-'));

    return (
      <div>
        <div className="text-container">
          <h5>Installed applications</h5>
        </div>
        <div className="grid" style={{ maxWidth: 960, margin: '0 auto' }}>
          {officialApps.map(app => <Card app={app} key={app.get('id')} />)}
        </div>
        {customApps.size > 0 ? (
          <div className="text-container">
            <h5>Custom applications</h5>
          </div>
        ) : null}
        <div className="grid" style={{ maxWidth: 960, margin: '0 auto' }}>
          {customApps.map(app => <Card app={app} key={app.get('id')} />)}
        </div>
        <div className="text-container">
          <p>powered by</p>
          <p>
            <a onClick={() => shell.openExternal('https://www.algolia.com')}>
              <img
                src="images/Algolia_logo_bg-white.svg"
                alt="Algolia"
                style={{ height: 32 }}
              />
            </a>
          </p>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderList()}
      </div>
    );
  }
}

Installed.propTypes = {
  managedApps: React.PropTypes.instanceOf(Immutable.Map).isRequired,
};

const mapStateToProps = state => ({
  managedApps: state.appManagement.get('managedApps'),
});

export default connect(
  mapStateToProps,
)(Installed);
