import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Button, Intent, NonIdealState } from '@blueprintjs/core';

import { INSTALLED, UPDATING } from '../constants/statuses';
import { LATEST_SSB_VERSION } from '../constants/versions';
import { updateApp } from '../actions/appManagement';

import Card from './Card';

class Installed extends React.Component {
  renderList() {
    const { installedApps, updatableApps, requestUpdateApps } = this.props;

    if (installedApps.size < 1) {
      return (
        <NonIdealState
          visual="import"
          title="No Installed Apps"
          description="Your installed apps will show up here."
        />
      );
    }

    return (
      <div>
        <div className="text-container">
          <h5>
            <span style={{ lineHeight: '30px' }}>Installed Applications</span>
            {updatableApps.size > 0 ? (
              <Button
                key="update-all"
                text="Update All"
                iconName="automatic-updates"
                intent={Intent.SUCCESS}
                style={{ marginLeft: 12 }}
                onClick={() => requestUpdateApps(updatableApps)}
              />
            ) : null}
          </h5>
        </div>
        <div className="grid" style={{ maxWidth: 960, margin: '0 auto' }}>
          {installedApps.valueSeq().map(app => <Card app={app} key={app.get('id')} />)}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div style={{ flex: 1, overflow: 'auto', paddingTop: 12, paddingBottom: 12 }}>
        {this.renderList()}
      </div>
    );
  }
}

Installed.propTypes = {
  installedApps: React.PropTypes.instanceOf(Immutable.Map).isRequired,
  updatableApps: React.PropTypes.instanceOf(Immutable.Map).isRequired,
  requestUpdateApps: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  installedApps: state.appManagement.get('managedApps').filter(app => app.get('status') === INSTALLED || app.get('status') === UPDATING),
  updatableApps: state.appManagement.get('managedApps').filter(app => app.get('status') === INSTALLED && app.get('version') < LATEST_SSB_VERSION),
});

const mapDispatchToProps = dispatch => ({
  requestUpdateApps: (apps) => {
    apps.forEach((app) => {
      dispatch(updateApp(app));
    });
  },
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(Installed);
