/* global window document shell */
import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import { search } from '../actions/search';
import { LOADING, FAILED, DONE } from '../constants/actions';

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
      searchStatus, hits, query,
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
      searchStatus,
      requestSearch,
    } = this.props;

    if (searchStatus === LOADING) return <Loading />;
    if (searchStatus === FAILED) return <NoConnection handleClick={() => requestSearch()} />;

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

Search.propTypes = {
  searchStatus: React.PropTypes.string,
  query: React.PropTypes.string,
  hits: React.PropTypes.instanceOf(Immutable.List),
  requestSearch: React.PropTypes.func,
  closeSearch: React.PropTypes.func,
};

const mapStateToProps = state => ({
  searchStatus: state.search.status,
  query: state.search.query,
  hits: state.search.hits,
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
