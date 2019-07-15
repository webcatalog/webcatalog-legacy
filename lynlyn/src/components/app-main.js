import React from 'react';
import PropTypes from 'prop-types';

import connectComponent from '../helpers/connect-component';

import WorkspaceBar from './root/workspace-bar';
import Workspace from './root/workspace';
import Directory from './root/directory';

import DialogAbout from './dialogs/about';
import DialogActivate from './dialogs/activate';
import DialogAddWorkspace from './dialogs/add-workspace';
import DialogClearBrowsingData from './dialogs/clear-browsing-data';
import DialogInjectCSS from './dialogs/inject-css';
import DialogInjectJS from './dialogs/inject-js';
import DialogLockApp from './dialogs/lock-app';
import DialogPreferences from './dialogs/preferences';
import DialogProxyRules from './dialogs/proxy-rules';
import DialogRelaunch from './dialogs/relaunch';
import DialogReset from './dialogs/reset';
import DialogUserAgent from './dialogs/user-agent';

const styles = {
  root: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
  },
};

const AppMain = (props) => {
  const {
    classes,
    activePage,
    workspaceId,
    workspaces,
  } = props;

  return (
    <div className={classes.root}>
      <DialogAbout />
      <DialogActivate />
      <DialogAddWorkspace />
      <DialogClearBrowsingData />
      <DialogInjectCSS />
      <DialogInjectJS />
      <DialogLockApp />
      <DialogPreferences />
      <DialogProxyRules />
      <DialogRelaunch />
      <DialogReset />
      <DialogUserAgent />

      <WorkspaceBar />

      {activePage === 'add-workspace' && <Directory />}

      {workspaces.map((workspace) => {
        const hidden = !(activePage === 'workspace' && workspaceId === workspace.id);
        return (
          <Workspace
            hidden={hidden}
            key={workspace.id}
            id={workspace.id}
            url={workspace.url}
          />
        );
      })}
    </div>
  );
};

AppMain.defaultProps = {
  activePage: 'add-workspace',
  workspaceId: null,
};

AppMain.propTypes = {
  classes: PropTypes.object.isRequired,
  activePage: PropTypes.string,
  workspaceId: PropTypes.string,
  workspaces: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = state => ({
  activePage: state.general.activePage,
  workspaceId: state.general.workspaceId,
  workspaces: state.workspaces,
});

export default connectComponent(
  AppMain,
  mapStateToProps,
  null,
  styles,
);
