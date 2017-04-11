import { remote, shell, ipcRenderer } from 'electron';
import React from 'react';
import { connect } from 'react-redux';
import { Button, Spinner, Popover, Menu, MenuItem, Position, Classes } from '@blueprintjs/core';

const Nav = ({
  isLoading,
  canGoBack,
  canGoForward,
  isMaximized,
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
      height: 32,
    }}
  >
    <div className="pt-navbar-group pt-align-left" style={{ flex: 1, height: 32 }}>
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
    <div className="pt-navbar-group pt-align-right" style={{ height: 32 }}>
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
      {remote.require('os').platform() !== 'darwin' ? [
        <span className="pt-navbar-divider" key="divider" />,
        <Button
          iconName="minus"
          className={Classes.MINIMAL}
          style={{ WebkitAppRegion: 'no-drag' }}
          onClick={() => {
            const window = remote.getCurrentWindow();
            window.minimize();
          }}
          key="minimize"
        />,
        <Button
          iconName={isMaximized ? 'applications' : 'application'}
          className={Classes.MINIMAL}
          style={{ WebkitAppRegion: 'no-drag' }}
          onClick={() => {
            const window = remote.getCurrentWindow();
            if (!window.isMaximized()) {
              window.maximize();
            } else {
              window.unmaximize();
            }
          }}
          key="maximize"
        />,
        <Button
          iconName="cross"
          className={Classes.MINIMAL}
          style={{ WebkitAppRegion: 'no-drag' }}
          onClick={() => {
            const window = remote.getCurrentWindow();
            window.close();
          }}
          key="close"
        />,
      ] : null}
    </div>
  </nav>
);

Nav.propTypes = {
  isLoading: React.PropTypes.bool,
  canGoBack: React.PropTypes.bool,
  canGoForward: React.PropTypes.bool,
  isMaximized: React.PropTypes.bool,
  onHomeButtonClick: React.PropTypes.func,
  onBackButtonClick: React.PropTypes.func,
  onForwardButtonClick: React.PropTypes.func,
  onRefreshButtonClick: React.PropTypes.func,
};

const mapStateToProps = state => ({
  isLoading: state.nav.get('isLoading'),
  canGoBack: state.nav.get('canGoBack'),
  canGoForward: state.nav.get('canGoForward'),
  isMaximized: state.screen.get('isMaximized'),
});

export default connect(
  mapStateToProps,
)(Nav);
