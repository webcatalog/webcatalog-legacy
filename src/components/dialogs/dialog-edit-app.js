import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

import connectComponent from '../../helpers/connect-component';
import isUrl from '../../helpers/is-url';

import {
  close,
  save,
  getIconFromInternet,
  updateForm,
} from '../../state/dialog-edit-app/actions';

import defaultIcon from '../../assets/default-icon.png';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

const styles = (theme) => ({
  grid: {
    marginTop: theme.spacing(1),
  },
  iconContainer: {
    height: 96,
    width: 96,
    backgroundColor: theme.palette.common.minBlack,
  },
  icon: {
    height: 96,
    width: 96,
  },
  dialogActions: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(1),
  },
  buttonBot: {
    marginTop: theme.spacing(1),
  },
  caption: {
    display: 'block',
  },
  captionDisabled: {
    color: theme.palette.text.disabled,
  },
});

const DialogEditApp = (props) => {
  const {
    classes,
    downloadingIcon,
    icon,
    id,
    internetIcon,
    name,
    onClose,
    onGetIconFromInternet,
    onSave,
    onUpdateForm,
    open,
    url,
    urlError,
  } = props;

  let iconPath = defaultIcon;
  if (icon) {
    if (isUrl(icon)) iconPath = icon;
    else iconPath = `file://${icon}`;
  } else if (internetIcon) {
    iconPath = internetIcon;
  }

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      open={open}
    >
      <EnhancedDialogTitle onClose={onClose}>
        {`Edit "${name}"`}
      </EnhancedDialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          id="name"
          label="Name"
          helperText="This cannot be changed."
          margin="normal"
          onChange={(e) => onUpdateForm({ name: e.target.value })}
          value={name}
          disabled
        />
        <TextField
          fullWidth
          id="url"
          label="URL"
          helperText={urlError}
          margin="normal"
          onChange={(e) => onUpdateForm({ url: e.target.value })}
          value={url}
          error={Boolean(urlError)}
        />
        <Grid container spacing={1} className={classes.grid}>
          <Grid item xs={12} sm="auto">
            <div className={classes.iconContainer}>
              <img src={iconPath} alt={name} className={classes.icon} />
            </div>
          </Grid>
          <Grid item xs={12} sm="auto">
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                window.require('electron').remote.dialog.showOpenDialog({
                  filters: [
                    { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'tiff', 'tif', 'bmp', 'dib'] },
                  ],
                  properties: ['openFile'],
                })
                  .then(({ canceled, filePaths }) => {
                    if (!canceled && filePaths && filePaths.length > 0) {
                      onUpdateForm({ icon: filePaths[0] });
                    }
                  })
                  .catch(console.log); // eslint-disable-line
              }}
              disabled={!id.startsWith('custom-')}
            >
              Select Local Image...
            </Button>
            <Typography
              variant="caption"
              className={classNames(classes.caption, !id.startsWith('custom-') && classes.captionDisabled)}
            >
              PNG, JPEG, GIF, TIFF or BMP.
            </Typography>
            <Button
              variant="outlined"
              size="small"
              className={classes.buttonBot}
              disabled={Boolean(!id.startsWith('custom-') || !url || urlError || downloadingIcon)}
              onClick={() => onGetIconFromInternet(true)}
            >
              {downloadingIcon ? 'Downloading Icon from the Internet...' : 'Download Icon from the Internet'}
            </Button>
            <br />
            <Button
              variant="outlined"
              size="small"
              className={classes.buttonBot}
              disabled={!id.startsWith('custom-') || !(icon || internetIcon)}
              onClick={() => onUpdateForm({ icon: null, internetIcon: null })}
            >
              Reset to Default
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button
          onClick={onClose}
        >
          Cancel
        </Button>
        <Tooltip title="This action'll also update this app to the latest version">
          <Button
            color="primary"
            onClick={onSave}
          >
            Save
          </Button>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
};

DialogEditApp.defaultProps = {
  icon: null,
  id: '',
  internetIcon: null,
  name: '',
  url: '',
  urlError: null,
};

DialogEditApp.propTypes = {
  classes: PropTypes.object.isRequired,
  downloadingIcon: PropTypes.bool.isRequired,
  icon: PropTypes.string,
  id: PropTypes.string,
  internetIcon: PropTypes.string,
  name: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onGetIconFromInternet: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  url: PropTypes.string,
  urlError: PropTypes.string,
};

const mapStateToProps = (state) => {
  const {
    downloadingIcon,
    open,
    form: {
      id,
      icon,
      name,
      nameError,
      url,
      urlError,
      internetIcon,
    },
  } = state.dialogEditApp;

  return {
    downloadingIcon,
    hideEnginePrompt: state.preferences.hideEnginePrompt,
    icon,
    id,
    internetIcon,
    name,
    nameError,
    open,
    url,
    urlError,
  };
};

const actionCreators = {
  close,
  save,
  getIconFromInternet,
  updateForm,
};

export default connectComponent(
  DialogEditApp,
  mapStateToProps,
  actionCreators,
  styles,
);
