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

import electronIcon from '../../assets/electron.png';
import chromeIcon from '../../assets/chrome.png';
import chromiumIcon from '../../assets/chromium.png';
import firefoxIcon from '../../assets/firefox.png';

import connectComponent from '../../helpers/connect-component';

import {
  close,
  create,
  updateForm,
} from '../../state/dialog-choose-engine/actions';

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

const DialogChooseEngine = (props) => {
  const {
    classes,
    engine,
    name,
    onClose,
    onCreate,
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
        Choose an Engine for
        {name}
      </EnhancedDialogTitle>
      <DialogContent>
        <Typography component="span" className={classes.tip} color="textPrimary">
          WebCatalog lets you pick your preferrred browser engine to power the app.
          You will have to uninstall and then reinstall thechange the engine of an app.
        </Typography>
        <List>
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
              primary="Google Chrome (recommend)"
              secondary={(
                <>
                  <Typography component="span" className={classes.inline} color="textPrimary">
                    Lightweight
                  </Typography>
                  {' — Takes up to 1 MB of disk space.'}
                  <br />
                  <Typography component="span" className={classes.inline} color="textPrimary">
                    Less Feature-rich
                  </Typography>
                  {' — Offers less features but supports extensions.'}
                  <br />
                  <Typography component="span" className={classes.inline} color="textPrimary">
                    Compatible
                  </Typography>
                  {' — Works with all sites.'}
                  <br />
                  <Typography component="span" className={classes.inline} color="textPrimary">
                    No updates needed
                  </Typography>
                  {' — Automatically updates with the browser.'}
                </>
              )}
            />
          </ListItem>
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
              secondary={(
                <>
                  <Typography component="span" className={classes.inline} color="textPrimary">
                    Lightweight
                  </Typography>
                  {' — Takes up to 1 MB of disk space.'}
                  <br />
                  <Typography component="span" className={classes.inline} color="textPrimary">
                    Less Feature-rich
                  </Typography>
                  {' — Offers less features but supports extensions.'}
                  <br />
                  <Typography component="span" className={classes.inline} color="textPrimary">
                    Compatible
                  </Typography>
                  {' — Works with all sites.'}
                  <br />
                  <Typography component="span" className={classes.inline} color="textPrimary">
                    No updates needed
                  </Typography>
                  {' — Automatically updates with the browser.'}
                </>
              )}
            />
          </ListItem>
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
              primary="Electron"
              secondary={(
                <>
                  <Typography component="span" className={classes.inline} color="textPrimary">
                    Heavy
                  </Typography>
                  {' — Takes up to 300 MB of disk space.'}
                  <br />
                  <Typography component="span" className={classes.inline} color="textPrimary">
                    Feature-rich
                  </Typography>
                  {' — Supports workspaces, menubar, code injection, etc.'}
                  <br />
                  <Typography component="span" className={classes.inline} color="textPrimary">
                    Less compatible
                  </Typography>
                  {' — Works with most sites.'}
                  <br />
                  <Typography component="span" className={classes.inline} color="textPrimary">
                    Updates needed
                  </Typography>
                  {' — Needs to be manually updated regularly.'}
                </>
              )}
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
              secondary={(
                <>
                  <Typography component="span" className={classes.inline} color="textPrimary">
                    Lightweight
                  </Typography>
                  {' — Takes up to 1 MB of disk space.'}
                  <br />
                  <Typography component="span" className={classes.inline} color="textPrimary">
                    Less Feature-rich
                  </Typography>
                  {' — Offers less features but supports extensions.'}
                  <br />
                  <Typography component="span" className={classes.inline} color="textPrimary">
                    Compatible
                  </Typography>
                  {' — Works with all sites.'}
                  <br />
                  <Typography component="span" className={classes.inline} color="textPrimary">
                    No updates needed
                  </Typography>
                  {' — Automatically updates with the browser.'}
                </>
              )}
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
          onClick={onCreate}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DialogChooseEngine.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  engine: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  const {
    open,
    form: {
      name,
      engine,
    },
  } = state.dialogChooseEngine;

  return {
    engine,
    name,
    open,
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
