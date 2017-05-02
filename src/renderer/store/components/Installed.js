import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { NonIdealState } from '@blueprintjs/core';

import Card from './Card';

class Installed extends React.Component {
  renderList() {
    const { installedApps } = this.props;

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
          </h5>
        </div>
        <div className="grid" style={{ maxWidth: 960, margin: '0 auto' }}>
          {installedApps.valueSeq().map(o => <Card app={o.get('app')} key={o.get('id')} />)}
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
  installedApps: PropTypes.instanceOf(Immutable.Map).isRequired,
};

const mapStateToProps = state => ({
  installedApps: state.appManagement.get('managedApps')
    .filter(app => app.get('status') === 'INSTALLED' || app.get('status') === 'UPDATING'),
});

export default connect(
  mapStateToProps,
)(Installed);
