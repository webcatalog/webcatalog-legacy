import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';

import connectComponent from '../../helpers/connect-component';
import isUrl from '../../helpers/is-url';

import {
  close,
  create,
  getIconFromInternet,
  updateForm,
} from '../../state/dialog-create-custom-app/actions';

import defaultIcon from '../../assets/default-icon.png';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

const { dialog } = window.require('electron').remote;

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
});

const DialogCreateCustomApp = (props) => {
  const {
    classes,
    downloadingIcon,
    hideEnginePrompt,
    icon,
    internetIcon,
    name,
    nameError,
    onClose,
    onCreate,
    onGetIconFromInternet,
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
        Create Custom App
      </EnhancedDialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          id="name"
          label="Name"
          helperText={nameError}
          margin="normal"
          onChange={(e) => onUpdateForm({ name: e.target.value })}
          value={name}
          error={Boolean(nameError)}
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
                dialog.showOpenDialog({
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
            >
              Select Local Image...
            </Button>
            <Typography variant="caption" className={classes.caption}>
              PNG, JPEG, GIF, TIFF or BMP.
            </Typography>
            <Button
              variant="outlined"
              size="small"
              className={classes.buttonBot}
              disabled={Boolean(!url || urlError || downloadingIcon)}
              onClick={() => onGetIconFromInternet(true)}
            >
              {downloadingIcon ? 'Downloading Icon from the Internet...' : 'Download Icon from the Internet'}
            </Button>
            <br />
            <Button
              variant="outlined"
              size="small"
              className={classes.buttonBot}
              disabled={!(icon || internetIcon)}
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
        <Button
          color="primary"
          onClick={onCreate}
        >
          {hideEnginePrompt ? 'Install' : 'Continue'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DialogCreateCustomApp.defaultProps = {
  icon: null,
  internetIcon: null,
  name: '',
  nameError: null,
  url: '',
  urlError: null,
};

DialogCreateCustomApp.propTypes = {
  classes: PropTypes.object.isRequired,
  downloadingIcon: PropTypes.bool.isRequired,
  hideEnginePrompt: PropTypes.bool.isRequired,
  icon: PropTypes.string,
  internetIcon: PropTypes.string,
  name: PropTypes.string,
  nameError: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  onGetIconFromInternet: PropTypes.func.isRequired,
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
      icon,
      name,
      nameError,
      url,
      urlError,
      internetIcon,
    },
  } = state.dialogCreateCustomApp;

  return {
    downloadingIcon,
    hideEnginePrompt: state.preferences.hideEnginePrompt,
    icon,
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
  create,
  getIconFromInternet,
  updateForm,
};

export default connectComponent(
  DialogCreateCustomApp,
  mapStateToProps,
  actionCreators,
  styles,
);
