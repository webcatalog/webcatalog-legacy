import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

import braveIcon from '../../assets/brave.png';
import chromeIcon from '../../assets/chrome.png';
import chromiumIcon from '../../assets/chromium.png';
import electronIcon from '../../assets/electron.png';
import firefoxIcon from '../../assets/firefox.png';
import vivaldiIcon from '../../assets/vivaldi.png';

import connectComponent from '../../helpers/connect-component';

import {
  close,
  save,
  updateForm,
} from '../../state/dialog-set-preferred-engine/actions';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

const styles = (theme) => ({
  grid: {
    marginTop: theme.spacing.unit,
  },
  tip: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  dialogActions: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit,
  },
  inline: {
    display: 'inline',
  },
});

const DialogSetPreferredEngine = (props) => {
  const {
    classes,
    engine,
    onClose,
    onSave,
    onUpdateForm,
    open,
  } = props;

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      open={open}
    >
      <EnhancedDialogTitle onClose={onClose}>
        Choose Preferred Browser Engine
      </EnhancedDialogTitle>
      <DialogContent>
        <Typography component="span" className={classes.tip} color="textPrimary">
          WebCatalog lets you pick your preferrred browser engine to power your apps.
          After you install an app,
          you will have to uninstall and then reinstall to change the engine.
        </Typography>
        <List>
          <ListItem
            alignItems="flex-start"
            button
            onClick={() => onUpdateForm({ engine: 'electron' })}
            selected={engine === 'electron'}
          >
            <ListItemAvatar>
              <Avatar alt="Electron" src={electronIcon} />
            </ListItemAvatar>
            <ListItemText
              primary="Electron (highly recommended)"
              secondary="This option creates Electron-based app with many exclusive features such as workspaces, notifications, badges and email handling. It takes more disk space (up to 300 MB per app), needs to be updated manually and doesn't support with DRM-protected apps such as Netflix or Spotify."
            />
          </ListItem>
          <ListItem
            alignItems="flex-start"
            button
            onClick={() => onUpdateForm({ engine: 'chrome' })}
            selected={engine === 'chrome'}
          >
            <ListItemAvatar>
              <Avatar alt="Google Chrome" src={chromeIcon} />
            </ListItemAvatar>
            <ListItemText
              primary="Google Chrome"
              secondary="This option creates bare-bone Google Chrome-based app with WebExtension support. It takes less disk space (less than 2 MB per app) and works with most apps, including DRM-protected apps such as Netflix or Spotify."
            />
          </ListItem>
          {window.process.platform !== 'win32' && (
            <ListItem
              alignItems="flex-start"
              button
              onClick={() => onUpdateForm({ engine: 'chromium' })}
              selected={engine === 'chromium'}
            >
              <ListItemAvatar>
                <Avatar alt="Chromium" src={chromiumIcon} />
              </ListItemAvatar>
              <ListItemText
                primary="Chromium"
                secondary="This option creates bare-bone Chromium-based app with WebExtension support. It takes less disk space (less than 2 MB per app) and works with most apps, including DRM-protected apps such as Netflix or Spotify."
              />
            </ListItem>
          )}
          <ListItem
            alignItems="flex-start"
            button
            onClick={() => onUpdateForm({ engine: 'brave' })}
            selected={engine === 'brave'}
          >
            <ListItemAvatar>
              <Avatar alt="Brave" src={braveIcon} />
            </ListItemAvatar>
            <ListItemText
              primary="Brave"
              secondary="This option creates bare-bone Brave-based app with WebExtension support. It takes less disk space (less than 2 MB per app) and works with most apps, including DRM-protected apps such as Netflix or Spotify."
            />
          </ListItem>
          <ListItem
            alignItems="flex-start"
            button
            onClick={() => onUpdateForm({ engine: 'vivaldi' })}
            selected={engine === 'vivaldi'}
          >
            <ListItemAvatar>
              <Avatar alt="Brave" src={vivaldiIcon} />
            </ListItemAvatar>
            <ListItemText
              primary="Vivaldi"
              secondary="This option creates bare-bone Vivaldi-based app with WebExtension support. It takes less disk space (less than 2 MB per app) and works with most apps, including DRM-protected apps such as Netflix or Spotify."
            />
          </ListItem>
          <ListItem
            alignItems="flex-start"
            button
            onClick={() => onUpdateForm({ engine: 'firefox' })}
            selected={engine === 'firefox'}
          >
            <ListItemAvatar>
              <Avatar alt="Mozilla Firefox" src={firefoxIcon} />
            </ListItemAvatar>
            <ListItemText
              primary="Mozilla Firefox"
              secondary="This option creates Firefox-based app with normal browser user interface and WebExtension support. It takes less disk space (less than 2 MB per app) and works with most apps, including DRM-protected apps such as Netflix or Spotify but requires advanced configurations."
            />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={onSave}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DialogSetPreferredEngine.propTypes = {
  classes: PropTypes.object.isRequired,
  engine: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const {
    open,
    form: {
      engine,
    },
  } = state.dialogSetPreferredEngine;

  return {
    engine,
    open,
  };
};

const actionCreators = {
  close,
  save,
  updateForm,
};

export default connectComponent(
  DialogSetPreferredEngine,
  mapStateToProps,
  actionCreators,
  styles,
);
