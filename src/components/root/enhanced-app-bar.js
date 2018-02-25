import React from 'react';
import PropTypes from 'prop-types';

import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import AppBar from 'material-ui/AppBar';
import HelpIcon from 'material-ui-icons/Help';
import IconButton from 'material-ui/IconButton';
import InfoIcon from 'material-ui-icons/Info';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import SettingsIcon from 'material-ui-icons/Settings';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import connectComponent from '../../helpers/connect-component';

import EnhancedMenu from '../shared/enhanced-menu';

import { open as openDialogAbout } from '../../state/dialogs/about/actions';
import { open as openDialogPreferences } from '../../state/dialogs/preferences/actions';

import {
  STRING_ABOUT,
  STRING_CREATE_AN_APP,
  STRING_HELP,
  STRING_PREFERENCES,
} from '../../constants/strings';

import { requestOpenInBrowser } from '../../senders/generic';

const styles = {
  root: {
    zIndex: 1,
  },
  title: {
    flex: 1,
  },
  appBar: {
    zIndex: 1,
  },
};

const EnhancedAppBar = (props) => {
  const {
    classes,
    onOpenDialogAbout,
    onOpenDialogPreferences,
  } = props;

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar} elevation={3}>
        <Toolbar className={classes.toolbar}>
          <Typography type="title" color="inherit" className={classes.title}>
            {STRING_CREATE_AN_APP}
          </Typography>
          <EnhancedMenu
            id="more"
            buttonElement={(
              <IconButton color="contrast">
                <MoreVertIcon />
              </IconButton>
            )}
          >
            {window.platform !== 'win32' && (
              <ListItem button onClick={onOpenDialogPreferences}>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary={STRING_PREFERENCES} />
              </ListItem>
            )}
            <ListItem button onClick={() => requestOpenInBrowser('https://github.com/quanglam2807/appifier/issues')}>
              <ListItemIcon>
                <HelpIcon />
              </ListItemIcon>
              <ListItemText primary={STRING_HELP} />
            </ListItem>
            <ListItem button onClick={onOpenDialogAbout}>
              <ListItemIcon>
                <InfoIcon />
              </ListItemIcon>
              <ListItemText primary={STRING_ABOUT} />
            </ListItem>
          </EnhancedMenu>
        </Toolbar>

      </AppBar>
    </div>
  );
};

EnhancedAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  onOpenDialogAbout: PropTypes.func.isRequired,
  onOpenDialogPreferences: PropTypes.func.isRequired,
};


const actionCreators = {
  openDialogAbout,
  openDialogPreferences,
};

export default connectComponent(
  EnhancedAppBar,
  null,
  actionCreators,
  styles,
);
