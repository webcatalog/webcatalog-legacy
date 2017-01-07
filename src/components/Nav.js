/* global shell */

import React from 'react';
import { connect } from 'react-redux';

import { refresh } from '../actions/app';
import { search, setSearchQuery } from '../actions/search';
import { toggleSettingDialog } from '../actions/settings';
import { NONE } from '../constants/actions';

const Nav = ({
  query, searchStatus,
  requestSearch, requestSetSearchQuery, requestToggleSettingDialog, requestRefresh,
}) => (
  <nav
    className="pt-navbar pt-fixed-top"
    style={{
      display: 'flex',
      WebkitUserSelect: 'none',
      WebkitAppRegion: 'drag',
    }}
  >
    <div className="pt-navbar-group pt-align-left" style={{ flex: 1, paddingRight: 12 }}>
      {process.platform === 'darwin' ? (
        <div className="pt-navbar-heading">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      ) : null}
      <div className="pt-input-group" style={{ width: '100%' }}>
        <span className="pt-icon pt-icon-search" />
        <input
          className="pt-input"
          placeholder="Search (name, URL)..."
          type="text"
          style={{ width: '100%', WebkitUserSelect: 'text' }}
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
      <button
        className="pt-button pt-minimal pt-icon-refresh"
        onClick={() => requestRefresh()}
      />
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
  requestRefresh: React.PropTypes.func,
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
  requestRefresh: () => {
    dispatch(refresh());
  },
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(Nav);
