import { ipcRenderer } from 'electron';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Menu, MenuItem, MenuDivider, Popover, Button, Position, Classes } from '@blueprintjs/core';
import classNames from 'classnames';

import { refresh } from '../actions/refresh';
import { search, setSearchQuery } from '../actions/search';
import { setRoute, goBack } from '../actions/route';
import { logOut } from '../actions/auth';

const Nav = ({
  query, routeId,
  requestSearch, requestSetSearchQuery, requestRefresh,
  goTo, onLogOut,
}) => (
  <nav
    className="pt-navbar"
    style={{
      display: 'flex',
      WebkitUserSelect: 'none',
      WebkitAppRegion: 'drag',
      flexBasis: 50,
      paddingLeft: (process.platform === 'darwin') ? 80 : null,
      zIndex: 1000,
    }}
  >
    <div className="pt-navbar-group pt-align-left" style={{ flex: 1, paddingRight: 12 }}>
      <div className="pt-input-group" style={{ width: '100%' }}>
        <span className="pt-icon pt-icon-search" />
        <input
          className="pt-input"
          placeholder="Search..."
          type="text"
          style={{ width: '100%', WebkitUserSelect: 'text', WebkitAppRegion: 'no-drag' }}
          value={query}
          onKeyDown={(e) => {
            if ((e.keyCode || e.which) === 13) {
              requestSearch();
              e.target.blur();
            }
          }}
          onChange={e => requestSetSearchQuery(e.target.value, routeId)}
        />
        {query.length > 0 ? (
          <Button
            iconName="cross"
            className={Classes.MINIMAL}
            style={{ WebkitAppRegion: 'no-drag' }}
            onClick={() => requestSetSearchQuery('', routeId)}
          />
        ) : null}
      </div>
    </div>
    <div className="pt-navbar-group pt-align-right">
      <Button
        iconName="home"
        className={classNames(
          { [Classes.ACTIVE]: (routeId === 'home') },
          Classes.MINIMAL,
        )}
        style={{ WebkitAppRegion: 'no-drag' }}
        text="Home"
        onClick={() => goTo('home')}
      />
      <Button
        iconName="tag"
        className={classNames(
          { [Classes.ACTIVE]: (routeId === 'installed') },
          Classes.MINIMAL,
        )}
        style={{ WebkitAppRegion: 'no-drag' }}
        text="My Apps"
        onClick={() => goTo('installed')}
      />
      <Button
        iconName="refresh"
        className={Classes.MINIMAL}
        style={{ WebkitAppRegion: 'no-drag' }}
        onClick={() => requestRefresh(routeId)}
      />
      <Popover
        content={(
          <Menu>
            <MenuItem
              iconName="log-out"
              text="Log out"
              onClick={onLogOut}
            />
            <MenuDivider />
            <MenuItem
              iconName="info-sign"
              text="About"
              onClick={() => {
                ipcRenderer.send('show-about-window');
              }}
            />
          </Menu>
        )}
        position={Position.BOTTOM_RIGHT}
      >
        <Button
          iconName="more"
          className={Classes.MINIMAL}
          style={{ WebkitAppRegion: 'no-drag' }}
        />
      </Popover>
    </div>
  </nav>
);

Nav.propTypes = {
  query: PropTypes.string.isRequired,
  routeId: PropTypes.string.isRequired,
  requestSearch: PropTypes.func.isRequired,
  requestSetSearchQuery: PropTypes.func.isRequired,
  requestRefresh: PropTypes.func.isRequired,
  goTo: PropTypes.func.isRequired,
  onLogOut: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  query: state.search.get('query'),
  routeId: state.route.get('routeId'),
});

const mapDispatchToProps = dispatch => ({
  requestSearch: () => {
    dispatch(search());
    dispatch(setRoute('search'));
  },
  requestSetSearchQuery: (query, routeId) => {
    if (query.length < 1 && routeId === 'search') {
      dispatch(goBack());
    }
    dispatch(setSearchQuery(query));
  },
  requestRefresh: routeId => dispatch(refresh(routeId)),
  goTo: routeId => dispatch(setRoute(routeId)),
  onLogOut: () => dispatch(logOut()),
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(Nav);
