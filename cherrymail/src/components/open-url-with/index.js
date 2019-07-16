import React from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import connectComponent from '../../helpers/connect-component';

import { requestLoadURL } from '../../senders';

import emailServices from '../../constants/services';

const { remote } = window.require('electron');

const getWorkspacesAsList = workspaces => Object.values(workspaces)
  .sort((a, b) => a.order - b.order);

const OpenUrlWith = ({ workspaces }) => (
  <List dense>
    {getWorkspacesAsList(workspaces).map(workspace => workspace.id !== 'home' && (
      <ListItem
        button
        onClick={() => {
          const incomingUrl = remote.getGlobal('incomingUrl');

          const { mailtoHandler } = emailServices[workspace.serviceId];

          let u = incomingUrl.startsWith('mailto:') ? mailtoHandler.replace('%s', incomingUrl) : incomingUrl;
          // special case for icloud
          if (workspace.serviceId === 'icloud') {
            u = u.replace('mailto:', '');
          }

          requestLoadURL(u, workspace.id);
          remote.getCurrentWindow().close();
        }}
      >
        <ListItemText
          primary={workspace.name || `Account ${workspace.order + 1}`}
          secondary={`#${workspace.order + 1} | ${emailServices[workspace.serviceId].name}`}
        />
        <ChevronRightIcon color="action" />
      </ListItem>
    ))}
  </List>
);

OpenUrlWith.propTypes = {
  workspaces: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  workspaces: state.workspaces,
});

export default connectComponent(
  OpenUrlWith,
  mapStateToProps,
  null,
  null,
);
