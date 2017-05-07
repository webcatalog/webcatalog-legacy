import { ipcRenderer } from 'electron';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Spinner, Popover, Menu, MenuItem, MenuDivider, Position, Classes } from '@blueprintjs/core';

import { toggleSettingDialog } from '../actions/settings';
import { toggleFindInPageDialog } from '../actions/findInPage';

const NAV_HEIGHT = 32;

const Nav = ({
  isLoading,
  canGoBack,
  canGoForward,
  onHomeButtonClick,
  onBackButtonClick,
  onForwardButtonClick,
  onRefreshButtonClick,
  requestToggleSettingDialog,
  requestToggleFindInPageDialog,
}) => (
  <nav
    className="pt-navbar"
    style={{
      display: 'flex',
      WebkitUserSelect: 'none',
      WebkitAppRegion: 'drag',
      paddingLeft: process.platform === 'darwin' ? 80 : null,
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
              onClick={requestToggleSettingDialog}
            />
            <MenuItem
              iconName="search"
              text="Find In Page..."
              onClick={requestToggleFindInPageDialog}
            />
            <MenuItem
              iconName="delete"
              text="Clear Browsing Data..."
              onClick={() => ipcRenderer.send('clear-browsing-data')}
            />
            <MenuDivider />
            <MenuItem
              iconName="help"
              text="Help"
              onClick={() => ipcRenderer.send('open-in-browser', 'https://getwebcatalog.com/help')}
            />
            <MenuItem
              iconName="globe"
              text="Website"
              onClick={() => ipcRenderer.send('open-in-browser', 'https://getwebcatalog.com')}
            />
            <MenuItem
              iconName="info-sign"
              text="About"
              onClick={() => ipcRenderer.send('show-about-window')}
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
  isLoading: PropTypes.bool.isRequired,
  canGoBack: PropTypes.bool.isRequired,
  canGoForward: PropTypes.bool.isRequired,
  onHomeButtonClick: PropTypes.func.isRequired,
  onBackButtonClick: PropTypes.func.isRequired,
  onForwardButtonClick: PropTypes.func.isRequired,
  onRefreshButtonClick: PropTypes.func.isRequired,
  requestToggleSettingDialog: PropTypes.func.isRequired,
  requestToggleFindInPageDialog: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isLoading: state.nav.get('isLoading'),
  canGoBack: state.nav.get('canGoBack'),
  canGoForward: state.nav.get('canGoForward'),
});

const mapDispatchToProps = dispatch => ({
  requestToggleSettingDialog: () => dispatch(toggleSettingDialog()),
  requestToggleFindInPageDialog: () => dispatch(toggleFindInPageDialog()),
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(Nav);
