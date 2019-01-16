import React from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import connectComponent from '../../helpers/connect-component';

import { requestLoadURL } from '../../senders';

const { remote } = window.require('electron');

const getWorkspacesAsList = workspaces => Object.values(workspaces)
  .sort((a, b) => a.order - b.order);

const OpenEmailLinkWith = ({ workspaces }) => (
  <List dense>
    {getWorkspacesAsList(workspaces).map(workspace => (
      <ListItem
        button
        onClick={() => {
          const appJson = remote.getGlobal('appJson');
          const u = appJson.mailtoHandler.replace('%s', remote.getGlobal('mailtoUrl'));

          requestLoadURL(u, workspace.id);
          remote.getCurrentWindow().close();
        }}
      >
        <ListItemText
          primary={workspace.name || `Workspace ${workspace.order + 1}`}
          secondary={`#${workspace.order + 1}`}
        />
        <ChevronRightIcon color="action" />
      </ListItem>
    ))}
  </List>
);

OpenEmailLinkWith.propTypes = {
  workspaces: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  workspaces: state.workspaces,
});

export default connectComponent(
  OpenEmailLinkWith,
  mapStateToProps,
  null,
  null,
);
