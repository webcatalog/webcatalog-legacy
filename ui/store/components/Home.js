/* global window document shell */
import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';

import { fetchApps } from '../actions/app';
import { LOADING, FAILED } from '../constants/actions';

import Spinner from './Spinner';
import NoConnection from './NoConnection';
import Card from './Card';

class Home extends React.Component {
  componentDidMount() {
    const { requestFetchApps } = this.props;
    requestFetchApps();

    window.onscroll = () => {
      if ((window.innerHeight + window.scrollY + 300) >= document.body.offsetHeight) {
        requestFetchApps();
      }
    };
  }

  componentWillUnmount() {
    window.onscroll = null;
  }

  renderList() {
    const { apps } = this.props;

    // Show apps if available
    if (apps) {
      return (
        <div className="grid">
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
    return (
      <div>
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
};

const mapStateToProps = state => ({
  status: state.app.status,
  apps: state.app.apps,
});

const mapDispatchToProps = dispatch => ({
  requestFetchApps: () => {
    dispatch(fetchApps());
  },
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(Home);
