/* global shell os */
import React from 'react';
import { connect } from 'react-redux';
import { Menu, MenuItem, Popover, Button, Position, Classes } from '@blueprintjs/core';
import classNames from 'classnames';
import { replace, push, goBack } from 'react-router-redux';

import { refresh } from '../actions/app';
import { search, setSearchQuery } from '../actions/search';

const Nav = ({
  query, pathname,
  requestSearch, requestSetSearchQuery, requestRefresh, goTo,
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
      {(os.platform() === 'darwin') ? (
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
          onInput={e => requestSetSearchQuery(e.target.value, pathname)}
          onKeyUp={e => requestSetSearchQuery(e.target.value, pathname)}
          onChange={e => requestSetSearchQuery(e.target.value, pathname)}
        />
        {query.length > 0 ? (
          <button
            className="pt-button pt-minimal pt-intent-primary pt-icon-arrow-right"
            onClick={() => requestSearch()}
          />
        ) : (
          <button
            className="pt-button pt-minimal pt-intent-primary pt-icon-cross"
            onClick={() => requestSetSearchQuery('', pathname)}
          />
        )}
      </div>
    </div>
    <div className="pt-navbar-group pt-align-right">
      <Button
        iconName="home"
        className={classNames(
          { [Classes.ACTIVE]: (pathname === '/') },
          Classes.MINIMAL,
        )}
        text="Home"
        onClick={() => goTo('/')}
      />
      <Button
        iconName="import"
        className={classNames(
          { [Classes.ACTIVE]: (pathname === '/installed') },
          Classes.MINIMAL,
        )}
        text="Installed"
        onClick={() => goTo('/installed')}
      />
      <button
        className="pt-button pt-minimal pt-icon-refresh"
        onClick={() => requestRefresh(pathname)}
      />
      <Popover
        content={(
          <Menu>
            <MenuItem iconName="add" text="Submit new app" onClick={() => shell.openExternal('https://goo.gl/forms/QIFncw8dauDn61Mw1')} />
            <MenuItem iconName="help" text="Help" onClick={() => shell.openExternal('https://getwebcatalog.com/support')} />
          </Menu>
        )}
        position={Position.BOTTOM_RIGHT}
      >
        <button className="pt-button pt-minimal pt-icon-more" />
      </Popover>
    </div>
  </nav>
);

Nav.propTypes = {
  query: React.PropTypes.string,
  pathname: React.PropTypes.string,
  requestSearch: React.PropTypes.func,
  requestSetSearchQuery: React.PropTypes.func,
  requestRefresh: React.PropTypes.func,
  goTo: React.PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  query: state.search.query,
  searchStatus: state.search.status,
  pathname: ownProps.pathname,
});

const mapDispatchToProps = dispatch => ({
  requestSearch: () => {
    dispatch(search());
    dispatch(push('/search'));
  },
  requestSetSearchQuery: (query, pathname) => {
    if (pathname === '/search') {
      dispatch(goBack());
    }
    dispatch(setSearchQuery(query));
  },
  requestRefresh: (pathname) => {
    dispatch(refresh(pathname));
  },
  goTo: (pathname) => {
    dispatch(replace(pathname));
  },
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(Nav);
