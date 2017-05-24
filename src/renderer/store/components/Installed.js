import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { NonIdealState, Button, Classes } from '@blueprintjs/core';
import classNames from 'classnames';

import Card from './Card';

import { fetchInstalledApps } from '../actions/installed';
import { setRoute } from '../actions/route';

class Installed extends React.Component {
  componentDidMount() {
    const { requestFetchInstalledApps } = this.props;

    requestFetchInstalledApps();
  }

  renderList() {
    const { installedApps, goTo } = this.props;

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
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            className={classNames(
              Classes.ACTIVE,
              Classes.MINIMAL,
            )}
            text="Installed Apps"
          />
          <Button
            className={classNames(
              Classes.MINIMAL,
            )}
            text="My Apps"
            onClick={() => goTo('my-apps')}
          />
        </div>
        <div className="grid" style={{ maxWidth: 960, margin: '0 auto' }}>
          {installedApps.map(o => <Card app={o} key={o.get('id')} />)}
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
  installedApps: PropTypes.instanceOf(Immutable.List).isRequired,
  requestFetchInstalledApps: PropTypes.func.isRequired,
  goTo: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  installedApps: state.installed.get('installedApps')
    .filter(x => state.appManagement.get('managedApps').has(x.get('id')))
    .sort((a, b) => a.get('name').localeCompare(b.get('name'))),
});

const mapDispatchToProps = dispatch => ({
  requestFetchInstalledApps: () => dispatch(fetchInstalledApps()),
  goTo: routeId => dispatch(setRoute(routeId)),
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(Installed);
