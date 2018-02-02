import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import Switch from 'material-ui/Switch';
import Dialog, {
  DialogContent,
} from 'material-ui/Dialog';
import List, {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from 'material-ui/List';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Slide from 'material-ui/transitions/Slide';


import connectComponent from '../../helpers/connect-component';
import { requestSetPreference } from '../../senders/preferences';

import { close } from '../../state/dialogs/preferences/actions';
import {
  STRING_PREFERENCES,
  STRING_SHARE_RESOURCES,
  STRING_SHARE_RESOURCES_DESC,
  STRING_CLOSE,
} from '../../constants/strings';

const styles = {
  appBar: {
    position: 'relative',
    zIndex: 1,
  },
  flex: {
    flex: 1,
  },
};

const Transition = props => <Slide direction="up" {...props} />;

const DialogPreferences = (props) => {
  const {
    classes,
    onClose,
    open,
    shareResources,
  } = props;

  return (
    <Dialog
      className={classes.root}
      onClose={onClose}
      open={open}
      fullScreen
      transition={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography type="title" color="inherit" className={classes.flex}>
            {STRING_PREFERENCES}
          </Typography>
          <Button color="contrast" onClick={onClose}>
            {STRING_CLOSE}
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <List dense>
          <ListItem
            button
            onClick={() => {
              requestSetPreference('shareResources', !shareResources);
            }}
          >
            <ListItemText
              primary={STRING_SHARE_RESOURCES}
              secondary={STRING_SHARE_RESOURCES_DESC}
            />
            <ListItemSecondaryAction>
              <Switch
                checked={shareResources}
                onChange={(e, checked) => {
                  requestSetPreference('shareResources', checked);
                }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  );
};

DialogPreferences.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  shareResources: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  open: state.dialogs.preferences.open,
  shareResources: state.preferences.shareResources,
});

const actionCreators = {
  close,
};

export default connectComponent(
  DialogPreferences,
  mapStateToProps,
  actionCreators,
  styles,
);
