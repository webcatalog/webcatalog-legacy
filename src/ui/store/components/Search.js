import { shell } from 'electron';
import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import { search } from '../actions/search';
import { LOADING, FAILED, DONE } from '../constants/statuses';

import Loading from './Loading';
import NoConnection from './NoConnection';
import Card from './Card';

class Search extends React.Component {
  componentDidMount() {
    const {
      query, closeSearch,
    } = this.props;

    if (query.length < 1) {
      closeSearch();
    }
  }

  renderList() {
    const {
      status, hits, query,
    } = this.props;

    if (status === DONE) {
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
                  alt="Algolia"
                  style={{ height: 32 }}
                />
              </a>
            </p>
          </div>
        </div>
      );
    }

    return null;
  }

  renderStatus() {
    const {
      status,
      requestSearch,
    } = this.props;

    if (status === LOADING) return <Loading />;
    if (status === FAILED) return <NoConnection handleClick={() => requestSearch()} />;

    return null;
  }

  render() {
    return (
      <div style={{ flex: 1, overflow: 'auto', paddingTop: 12, paddingBottom: 12 }}>
        {this.renderList()}
        {this.renderStatus()}
      </div>
    );
  }
}

Search.propTypes = {
  status: React.PropTypes.string,
  query: React.PropTypes.string,
  hits: React.PropTypes.instanceOf(Immutable.List),
  requestSearch: React.PropTypes.func,
  closeSearch: React.PropTypes.func,
};

const mapStateToProps = state => ({
  status: state.search.get('status'),
  query: state.search.get('query'),
  hits: state.search.get('hits'),
});

const mapDispatchToProps = dispatch => ({
  requestSearch: () => {
    dispatch(search());
  },
  closeSearch: () => {
    dispatch(replace('/'));
  },
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(Search);
