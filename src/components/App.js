/* global window document shell */
import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';

import { fetchApps, search } from '../actions';
import { LOADING, FAILED, DONE, NONE } from '../constants/actions';

import Nav from './Nav';
import Spinner from './Spinner';
import NoConnection from './NoConnection';
import Card from './Card';
import Settings from './Settings';

class App extends React.Component {
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
    const {
      searchStatus, apps, hits, query,
    } = this.props;

    if (searchStatus === DONE) {
      if (hits.size < 1) {
        return (
          <div className="text-container">
            <h5>Your search {`"${query}"`} did not match any apps.</h5>
          </div>
        );
      }
      return (
        <div>
          <div className="text-container">
            <h5>Search result for {`"${query}"`}</h5>
          </div>
          <div className="grid">
            {hits.map(app => <Card app={app} key={app.get('id')} />)}
          </div>
          <div className="text-container">
            <p>powered by</p>
            <p>
              <a onClick={() => shell.openExternal('https://www.algolia.com')}>
                <img
                  src="images/Algolia_logo_bg-white.svg"
                  role="presentation"
                  style={{ height: 32 }}
                />
              </a>
            </p>
          </div>
        </div>
      );
    }

    // Only show all apps if search is not running
    if (searchStatus === NONE && apps) {
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
      status, searchStatus,
      requestFetchApps, requestSearch,
    } = this.props;

    if (searchStatus === LOADING) return <Spinner />;
    else if (searchStatus === FAILED) return <NoConnection handleClick={() => requestSearch()} />;
    else if (status === LOADING) return <Spinner />;
    else if (status === FAILED) return <NoConnection handleClick={() => requestFetchApps()} />;

    return null;
  }

  render() {
    return (
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <Nav />
        <div style={{ height: 48 }} />
        {this.renderList()}
        {this.renderStatus()}
        <Settings />
      </div>
    );
  }
}

App.propTypes = {
  status: React.PropTypes.string,
  apps: React.PropTypes.instanceOf(Immutable.List),
  searchStatus: React.PropTypes.string,
  query: React.PropTypes.string,
  hits: React.PropTypes.instanceOf(Immutable.List),
  requestFetchApps: React.PropTypes.func,
  requestSearch: React.PropTypes.func,
};

const mapStateToProps = state => ({
  status: state.app.status,
  apps: state.app.apps,
  searchStatus: state.search.status,
  query: state.search.query,
  hits: state.search.hits,
});

const mapDispatchToProps = dispatch => ({
  requestFetchApps: () => {
    dispatch(fetchApps());
  },
  requestSearch: () => {
    dispatch(search());
  },
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(App);
