import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import SettingsIcon from '@material-ui/icons/SettingsSharp';

import connectComponent from '../../helpers/connect-component';

import WorkspaceSelector from './workspace-selector';
import FindInPage from './find-in-page';
import NavigationBar from './navigation-bar';
import FakeTitleBar from './fake-title-bar';

import {
  requestShowPreferencesWindow,
  requestCreateWorkspace,
  requestSetActiveWorkspace,
  requestRemoveWorkspace,
  requestShowEditWorkspaceWindow,
} from '../../senders';

const { remote } = window.require('electron');

const styles = theme => ({
  outerRoot: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
  },
  root: {
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
    width: '100vw',
    flex: 1,
  },
  sidebarRoot: {
    height: '100vh',
    width: 68,
    borderRight: '1px solid rgba(0, 0, 0, 0.2)',
    backgroundColor: theme.palette.background.paper,
    WebkitAppRegion: 'drag',
    WebkitUserSelect: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: theme.spacing.unit,
    boxSizing: 'border-box',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  sidebarTop: {
    flex: 1,
    paddingTop: theme.spacing.unit * 3,
  },
  sidebarTopFullScreen: {
    paddingTop: 0,
  },
  innerContentRoot: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRoot: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
});

const getWorkspacesAsList = workspaces => Object.values(workspaces)
  .sort((a, b) => a.order - b.order);

const Main = ({
  classes,
  didFailLoad,
  isFullScreen,
  isLoading,
  navigationBar,
  sidebar,
  workspaces,
}) => (
  <div className={classes.outerRoot}>
    {!sidebar && (<FakeTitleBar />)}
    <div className={classes.root}>
      {sidebar && (
        <div className={classes.sidebarRoot}>
          <div className={classNames(classes.sidebarTop,
            isFullScreen && classes.sidebarTopFullScreen)}
          >
            {getWorkspacesAsList(workspaces).map((workspace, i) => (
              <WorkspaceSelector
                active={workspace.active}
                id={workspace.id}
                key={workspace.id}
                name={workspace.name}
                order={i}
                onClick={() => requestSetActiveWorkspace(workspace.id)}
                onContextMenu={(e) => {
                  e.preventDefault();

                  const template = [
                    {
                      label: 'Edit Workspace',
                      click: () => requestShowEditWorkspaceWindow(workspace.id),
                    },
                    {
                      label: 'Remove Workspace',
                      click: () => requestRemoveWorkspace(workspace.id),
                    },
                  ];
                  const menu = remote.Menu.buildFromTemplate(template);

                  menu.popup(remote.getCurrentWindow());
                }}
              />
            ))}
            {Object.keys(workspaces).length < 9 && (
              <WorkspaceSelector id="add" onClick={requestCreateWorkspace} />
            )}
          </div>
          {!navigationBar && (
          <div className={classes.end}>
            <IconButton aria-label="Preferences" onClick={requestShowPreferencesWindow}>
              <SettingsIcon />
            </IconButton>
          </div>
          )}
        </div>
      )}
      <div className={classes.contentRoot}>
        {navigationBar && <NavigationBar />}
        <FindInPage />
        <div className={classes.innerContentRoot}>
          {didFailLoad && !isLoading && (
            <div>
              <Typography align="center" variant="h6">
                No internet
              </Typography>

              <Typography align="center" variant="body1">
                Try: - Checking the network cables, modem, and router. - Reconnecting to Wi-Fi.
              </Typography>

              <Typography align="center" variant="body1">
                Press ⌘ + R to reload.
              </Typography>
            </div>
          )}
          {isLoading && <CircularProgress />}
        </div>
      </div>
    </div>
  </div>
);

Main.propTypes = {
  classes: PropTypes.object.isRequired,
  didFailLoad: PropTypes.bool.isRequired,
  isFullScreen: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  navigationBar: PropTypes.bool.isRequired,
  sidebar: PropTypes.bool.isRequired,
  workspaces: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  didFailLoad: state.general.didFailLoad,
  isFullScreen: state.general.isFullScreen,
  isLoading: state.general.isLoading,
  navigationBar: state.preferences.navigationBar,
  sidebar: state.preferences.sidebar,
  workspaces: state.workspaces,
});

export default connectComponent(
  Main,
  mapStateToProps,
  null,
  styles,
);
