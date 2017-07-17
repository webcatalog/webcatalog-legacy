/* global ipcRenderer */
import React from 'react';

import Divider from 'material-ui/Divider';
import HelpIcon from 'material-ui-icons/Help';
import IconButton from 'material-ui/IconButton';
import InfoIcon from 'material-ui-icons/Info';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import SettingsIcon from 'material-ui-icons/Settings';
import PeopleIcon from 'material-ui-icons/People';
import PowerSettingsNewIcon from 'material-ui-icons/PowerSettingsNew';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

import EnhancedMenu from '../shared/EnhancedMenu';

const MoreMenuButton = () => (
  <EnhancedMenu
    id="more-menu"
    buttonElement={(
      <IconButton
        aria-label="More"
        color="contrast"
      >
        <MoreVertIcon />
      </IconButton>
    )}
  >
    <ListItem button>
      <ListItemIcon><PeopleIcon /></ListItemIcon>
      <ListItemText primary="Account" />
    </ListItem>

    <ListItem button onClick={() => ipcRenderer.send('log-out')}>
      <ListItemIcon><PowerSettingsNewIcon /></ListItemIcon>
      <ListItemText primary="Log out" />
    </ListItem>

    <Divider light />

    <ListItem button>
      <ListItemIcon><SettingsIcon /></ListItemIcon>
      <ListItemText primary="Settings" />
    </ListItem>
    <ListItem button>
      <ListItemIcon><HelpIcon /></ListItemIcon>
      <ListItemText primary="Help" />
    </ListItem>
    <ListItem button>
      <ListItemIcon><InfoIcon /></ListItemIcon>
      <ListItemText primary="About" />
    </ListItem>
  </EnhancedMenu>
);

export default MoreMenuButton;
