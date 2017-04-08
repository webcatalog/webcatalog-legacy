import { shell } from 'electron';
import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';

import { fetchApps } from '../actions/home';
import { LOADING, FAILED } from '../constants/statuses';

import Loading from './Loading';
import NoConnection from './NoConnection';
import Card from './Card';

class Home extends React.Component {
  componentDidMount() {
    const { requestFetchApps } = this.props;
    requestFetchApps();

    const el = this.scrollContainer;

    el.onscroll = () => {
      // Plus 300 to run ahead.
      if (el.scrollTop + 300 >= el.scrollHeight - el.offsetHeight) {
        requestFetchApps();
      }
    };
  }

  componentWillUnmount() {
    this.scrollContainer.onscroll = null;
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

    if (status === LOADING) return <Loading />;
    if (status === FAILED) return <NoConnection handleClick={() => requestFetchApps()} />;

    return null;
  }

  render() {
    return (
      <div
        style={{ flex: 1, overflow: 'auto', paddingTop: 12, paddingBottom: 12 }}
        ref={(container) => { this.scrollContainer = container; }}
      >
        <div className="pt-card" style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
          <span>Cannot find your favorite app?&#32;</span>
          <a onClick={() => shell.openExternal('https://goo.gl/forms/QIFncw8dauDn61Mw1')}>
            <span className="pt-icon-standard pt-icon-add" />
            <span>&#32;Submit new app</span>
          </a>.
        </div>
        {this.renderList()}
        {this.renderStatus()}
      </div>
    );
  }
}

Home.propTypes = {
  status: React.PropTypes.string.isRequired,
  apps: React.PropTypes.instanceOf(Immutable.List).isRequired,
  requestFetchApps: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  status: state.home.get('status'),
  apps: state.home.get('apps'),
});

const mapDispatchToProps = dispatch => ({
  requestFetchApps: () => {
    dispatch(fetchApps());
  },
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(Home);
