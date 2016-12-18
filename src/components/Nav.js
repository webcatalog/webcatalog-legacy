/* global shell */

import React from 'react';
import { connect } from 'react-redux';

import { search, setSearchQuery } from '../actions';
import { toggleSettingDialog } from '../actions/settings';
import { NONE } from '../constants/actions';

const Nav = ({
  query, searchStatus,
  requestSearch, requestSetSearchQuery, requestToggleSettingDialog,
}) => (
  <nav className="pt-navbar pt-fixed-top" style={{ display: 'flex' }}>
    <div className="pt-navbar-group pt-align-left" style={{ flex: 1, paddingRight: 12 }}>
      <div className="pt-navbar-heading">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </div>
      <div className="pt-input-group" style={{ width: '100%' }}>
        <span className="pt-icon pt-icon-search" />
        <input
          className="pt-input"
          placeholder="Search (name, URL)..."
          type="text"
          style={{ width: '100%' }}
          value={query}
          onKeyDown={(e) => {
            if ((e.keyCode || e.which) === 13) {
              requestSearch();
              e.target.blur();
            }
          }}
          onInput={e => requestSetSearchQuery(e.target.value)}
          onKeyUp={e => requestSetSearchQuery(e.target.value)}
          onChange={e => requestSetSearchQuery(e.target.value)}
        />
        {searchStatus === NONE ? (
          <button
            className="pt-button pt-minimal pt-intent-primary pt-icon-arrow-right"
            onClick={() => requestSearch()}
          />
        ) : (
          <button
            className="pt-button pt-minimal pt-intent-primary pt-icon-cross"
            onClick={() => requestSetSearchQuery('')}
          />
        )}
      </div>
    </div>
    <div className="pt-navbar-group pt-align-right">
      <button
        className="pt-button pt-minimal pt-icon-edit"
        onClick={() => shell.openExternal('https://goo.gl/forms/QIFncw8dauDn61Mw1')}
      >
        Submit new app
      </button>
      <span className="pt-navbar-divider" />
      <button
        className="pt-button pt-minimal pt-icon-cog"
        onClick={() => requestToggleSettingDialog()}
      />
    </div>
  </nav>
);

Nav.propTypes = {
  query: React.PropTypes.string,
  searchStatus: React.PropTypes.string,
  requestSearch: React.PropTypes.func,
  requestSetSearchQuery: React.PropTypes.func,
  requestToggleSettingDialog: React.PropTypes.func,
};

const mapStateToProps = state => ({
  query: state.search.query,
  searchStatus: state.search.status,
});

const mapDispatchToProps = dispatch => ({
  requestSearch: () => {
    dispatch(search());
  },
  requestSetSearchQuery: (query) => {
    dispatch(setSearchQuery(query));
  },
  requestToggleSettingDialog: () => {
    dispatch(toggleSettingDialog());
  },
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(Nav);
