/* global window document shell */
import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';

import { fetchApps } from '../actions/app';
import { toggleCustomDialog } from '../actions/custom';
import { LOADING, FAILED } from '../constants/actions';

import Spinner from './Spinner';
import NoConnection from './NoConnection';
import Card from './Card';

class Home extends React.Component {
  componentDidMount() {
    const { requestFetchApps } = this.props;
    requestFetchApps();
  }

  renderList() {
    const { apps } = this.props;

    // Show apps if available
    if (apps) {
      return (
        <div className="grid" style={{ maxWidth: 960, margin: '0 auto' }}>
          {apps.map(app => <Card app={app} key={app.get('id')} />)}
        </div>
      );
    }

    return null;
  }

  renderStatus() {
    const {
      status, requestFetchApps,
    } = this.props;

    if (status === LOADING) return <Spinner />;
    if (status === FAILED) return <NoConnection handleClick={() => requestFetchApps()} />;

    return null;
  }

  render() {
    const { requestToggleCustomDialog } = this.props;

    return (
      <div>
        <div className="pt-card" style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
          <span>Can{'\''}t find your favorite apps? Don{'\''}t worry! </span>
          <a onClick={() => shell.openExternal('https://goo.gl/forms/QIFncw8dauDn61Mw1')}>
            <span className="pt-icon-standard pt-icon-add" />
            <span> Submit new app</span>
          </a>
          <span> or </span>
          <a onClick={() => requestToggleCustomDialog()}>
            <span className="pt-icon-standard pt-icon-wrench" />
            <span> Install custom app</span>
          </a>.
        </div>
        {this.renderList()}
        {this.renderStatus()}
      </div>
    );
  }
}

Home.propTypes = {
  status: React.PropTypes.string,
  apps: React.PropTypes.instanceOf(Immutable.List),
  requestFetchApps: React.PropTypes.func,
  requestToggleCustomDialog: React.PropTypes.func,
};

const mapStateToProps = state => ({
  status: state.app.status,
  apps: state.app.apps,
});

const mapDispatchToProps = dispatch => ({
  requestFetchApps: () => {
    dispatch(fetchApps());
  },
  requestToggleCustomDialog: () => {
    dispatch(toggleCustomDialog());
  },
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(Home);
