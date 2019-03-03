import React from 'react';
import PropTypes from 'prop-types';

import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';

import SettingsIcon from '@material-ui/icons/SettingsSharp';

import connectComponent from '../../helpers/connect-component';

import WorkspaceSelector from './workspace-selector';
import FindInPage from './find-in-page';

import {
  requestShowPreferencesWindow,
  requestCreateWorkspace,
  requestSetActiveWorkspace,
  requestRemoveWorkspace,
  requestShowEditWorkspaceWindow,
} from '../../senders';

const { remote } = window.require('electron');

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
    width: '100vw',
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
    padding: theme.spacing.unit,
    boxSizing: 'border-box',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  sidebarTop: {
    flex: 1,
    paddingTop: theme.spacing.unit * 2,
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
  },
});

const getWorkspacesAsList = workspaces => Object.values(workspaces)
  .sort((a, b) => a.order - b.order);

const Sidebar = ({
  classes,
  didFailLoad,
  isLoading,
  sidebar,
  workspaces,
}) => (
  <div className={classes.root}>
    {sidebar && (
      <div className={classes.sidebarRoot}>
        <div className={classes.sidebarTop}>
          {getWorkspacesAsList(workspaces).map(workspace => (
            <WorkspaceSelector
              active={workspace.active}
              id={workspace.id}
              key={workspace.id}
              name={workspace.name}
              order={workspace.order}
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
        <div className={classes.end}>
          <IconButton aria-label="Preferences" onClick={requestShowPreferencesWindow}>
            <SettingsIcon />
          </IconButton>
        </div>
      </div>
    )}
    <div className={classes.contentRoot}>
      <FindInPage />
      <div className={classes.innerContentRoot}>
        {didFailLoad && 'Failed'}
        {isLoading && <CircularProgress />}
      </div>
    </div>
  </div>
);

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  didFailLoad: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  sidebar: PropTypes.bool.isRequired,
  workspaces: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  didFailLoad: state.general.didFailLoad,
  isLoading: state.general.isLoading,
  sidebar: state.preferences.sidebar,
  workspaces: state.workspaces,
});

export default connectComponent(
  Sidebar,
  mapStateToProps,
  null,
  styles,
);
