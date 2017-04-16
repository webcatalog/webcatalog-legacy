import { remote, shell, ipcRenderer } from 'electron';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Spinner, Popover, Menu, MenuItem, Position, Classes } from '@blueprintjs/core';

const NAV_HEIGHT = 32;

const Nav = ({
  isLoading,
  canGoBack,
  canGoForward,
  onHomeButtonClick,
  onBackButtonClick,
  onForwardButtonClick,
  onRefreshButtonClick,
}) => (
  <nav
    className="pt-navbar"
    style={{
      display: 'flex',
      WebkitUserSelect: 'none',
      WebkitAppRegion: 'drag',
      paddingLeft: remote.require('os').platform() === 'darwin' ? 80 : null,
      backgroundColor: '#CED9E0',
      height: NAV_HEIGHT,
    }}
  >
    <div className="pt-navbar-group pt-align-left" style={{ flex: 1, height: NAV_HEIGHT }}>
      <Button
        iconName="home"
        className={Classes.MINIMAL}
        style={{ WebkitAppRegion: 'no-drag' }}
        onClick={onHomeButtonClick}
      />
      <Button
        iconName="chevron-left"
        className={Classes.MINIMAL}
        style={{ WebkitAppRegion: 'no-drag' }}
        disabled={!canGoBack}
        onClick={onBackButtonClick}
      />
      <Button
        iconName="chevron-right"
        className={Classes.MINIMAL}
        style={{ WebkitAppRegion: 'no-drag' }}
        disabled={!canGoForward}
        onClick={onForwardButtonClick}
      />
      <Button
        iconName="repeat"
        className={Classes.MINIMAL}
        style={{ WebkitAppRegion: 'no-drag' }}
        onClick={onRefreshButtonClick}
      />
    </div>
    <div className="pt-navbar-group pt-align-right" style={{ height: NAV_HEIGHT }}>
      {isLoading ? (
        <Spinner className={Classes.SMALL} />
      ) : null}
      <Popover
        content={(
          <Menu>
            <MenuItem
              iconName="cog"
              text="Settings"
              onClick={() => {
                remote.getCurrentWindow().webContents.send('toggle-setting-dialog');
              }}
            />
            <MenuItem
              iconName="search"
              text="Find In Page..."
              onClick={() => {
                remote.getCurrentWindow().webContents.send('toggle-find-in-page-dialog');
              }}
            />
            <MenuItem
              iconName="code"
              text="Developer Tools"
              onClick={() => {
                remote.getCurrentWindow().webContents.send('toggle-dev-tools');
              }}
            />
            <MenuItem
              iconName="delete"
              text="Clear Browsing Data..."
              onClick={() => {
                ipcRenderer.send('clear-browsing-data');
              }}
            />
            <MenuItem
              iconName="help"
              text="Help"
              onClick={() => shell.openExternal('https://getwebcatalog.com/support')}
            />
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
  isLoading: PropTypes.bool,
  canGoBack: PropTypes.bool,
  canGoForward: PropTypes.bool,
  onHomeButtonClick: PropTypes.func,
  onBackButtonClick: PropTypes.func,
  onForwardButtonClick: PropTypes.func,
  onRefreshButtonClick: PropTypes.func,
};

const mapStateToProps = state => ({
  isLoading: state.nav.get('isLoading'),
  canGoBack: state.nav.get('canGoBack'),
  canGoForward: state.nav.get('canGoForward'),
});

export default connect(
  mapStateToProps,
)(Nav);
