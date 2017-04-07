/* global window document shell */
import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { NonIdealState } from '@blueprintjs/core';

import { INSTALLED } from '../constants/statuses';

import Card from './Card';

class Installed extends React.Component {
  renderList() {
    const { installedApps } = this.props;

    if (installedApps.size < 1) {
      return (
        <NonIdealState
          visual="import"
          title="No installed apps"
          description="Your installed apps will show up here."
        />
      );
    }

    return (
      <div>
        <div className="text-container">
          <h5>Installed applications</h5>
        </div>
        <div className="grid" style={{ maxWidth: 960, margin: '0 auto' }}>
          {installedApps.map(app => <Card app={app} key={app.get('id')} />)}
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
  installedApps: React.PropTypes.instanceOf(Immutable.Map).isRequired,
};

const mapStateToProps = state => ({
  installedApps: state.appManagement.get('managedApps').filter(app => app.get('status') === INSTALLED),
});

export default connect(
  mapStateToProps,
)(Installed);
