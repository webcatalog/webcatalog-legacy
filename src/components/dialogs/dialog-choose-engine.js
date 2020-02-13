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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import braveIcon from '../../assets/brave.png';
import chromeIcon from '../../assets/chrome.png';
import chromiumIcon from '../../assets/chromium.png';
import edgeIcon from '../../assets/edge.png';
import electronIcon from '../../assets/electron.png';
import firefoxIcon from '../../assets/firefox.png';
import vivaldiIcon from '../../assets/vivaldi.png';

import connectComponent from '../../helpers/connect-component';

import {
  close,
  create,
  updateForm,
} from '../../state/dialog-choose-engine/actions';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

import { requestSetPreference } from '../../senders';

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

const DialogChooseEngine = (props) => {
  const {
    classes,
    engine,
    name,
    onClose,
    onCreate,
    onUpdateForm,
    open,
    hideEnginePrompt,
  } = props;

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      open={open}
    >
      <EnhancedDialogTitle onClose={onClose}>
        Choose an Browser Engine for
        {` ${name}`}
      </EnhancedDialogTitle>
      <DialogContent>
        <Typography component="span" className={classes.tip} color="textPrimary">
          WebCatalog lets you pick your preferrred browser engine to power&nbsp;
          {name}
          . This cannot be changed later.
          You will have to uninstall and then reinstall to change the engine of an app.
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
              secondary="This option creates Electron-based app with many exclusive features such as workspaces, notifications, badges and email handling. It takes more disk space (up to 200 MB per app), needs to be updated manually and doesn't support with DRM-protected apps such as Netflix or Spotify."
            />
          </ListItem>
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
          {window.process.platform !== 'linux' && (
            <ListItem
              alignItems="flex-start"
              button
              onClick={() => onUpdateForm({ engine: 'edge' })}
              selected={engine === 'edge'}
            >
              <ListItemAvatar>
                <Avatar alt="Microsoft Edge" src={edgeIcon} />
              </ListItemAvatar>
              <ListItemText
                primary="Microsoft Edge"
                secondary="This option creates bare-bone Microsoft Edge (Chromium)-based app with WebExtension support. It takes less disk space (less than 2 MB per app) and works with most apps, including DRM-protected apps such as Netflix or Spotify."
              />
            </ListItem>
          )}
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
          <ListItem
            alignItems="flex-start"
            button
            onClick={() => onUpdateForm({ engine: 'vivaldi' })}
            selected={engine === 'vivaldi'}
          >
            <ListItemAvatar>
              <Avatar alt="Vivaldi" src={vivaldiIcon} />
            </ListItemAvatar>
            <ListItemText
              primary="Vivaldi"
              secondary="This option creates bare-bone Vivaldi-based app with WebExtension support. It takes less disk space (less than 2 MB per app) and works with most apps, including DRM-protected apps such as Netflix or Spotify."
            />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <FormControlLabel
          control={(
            <Checkbox
              checked={hideEnginePrompt}
              onChange={(e) => requestSetPreference('hideEnginePrompt', e.target.checked)}
              color="primary"
            />
          )}
          label="Don't ask again"
        />
        <Button
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={onCreate}
        >
          Install
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DialogChooseEngine.propTypes = {
  classes: PropTypes.object.isRequired,
  engine: PropTypes.string.isRequired,
  hideEnginePrompt: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const {
    open,
    form: {
      name,
      engine,
    },
  } = state.dialogChooseEngine;

  const {
    hideEnginePrompt,
  } = state.preferences;

  return {
    engine,
    name,
    open,
    hideEnginePrompt,
  };
};

const actionCreators = {
  close,
  create,
  updateForm,
};

export default connectComponent(
  DialogChooseEngine,
  mapStateToProps,
  actionCreators,
  styles,
);
