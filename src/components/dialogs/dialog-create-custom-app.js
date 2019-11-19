import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import connectComponent from '../../helpers/connect-component';
import isUrl from '../../helpers/is-url';

import {
  close,
  create,
  updateForm,
} from '../../state/dialog-create-custom-app/actions';

import defaultIcon from '../../assets/default-icon.png';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

const { dialog } = window.require('electron').remote;

const styles = (theme) => ({
  grid: {
    marginTop: theme.spacing.unit,
  },
  iconContainer: {
    height: 128,
    width: 128,
    backgroundColor: theme.palette.common.minBlack,
  },
  icon: {
    height: 128,
    width: 128,
  },
  dialogActions: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit,
  },
});

const DialogCreateCustomApp = (props) => {
  const {
    classes,
    icon,
    name,
    nameError,
    onClose,
    onCreate,
    onUpdateForm,
    open,
    url,
    urlError,
    hideEnginePrompt,
  } = props;

  let iconPath = defaultIcon;
  if (icon) {
    if (isUrl(icon)) iconPath = icon;
    else iconPath = `file://${icon}`;
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
          label={nameError || 'Name'}
          margin="normal"
          onChange={(e) => onUpdateForm({ name: e.target.value })}
          value={name}
          error={Boolean(nameError)}
        />
        <TextField
          fullWidth
          id="url"
          label={urlError || 'URL'}
          margin="normal"
          onChange={(e) => onUpdateForm({ url: e.target.value })}
          value={url}
          error={Boolean(urlError)}
        />
        <Grid container spacing={16} className={classes.grid}>
          <Grid item>
            <div className={classes.iconContainer}>
              <img src={iconPath} alt={name} className={classes.icon} />
            </div>
          </Grid>
          <Grid item>
            <Button
              variant="raised"
              onClick={() => {
                dialog.showOpenDialog({
                  filters: [{ name: 'PNG (Portable Network Graphics)', extensions: ['png'] }],
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
              Change Icon
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
  name: '',
  nameError: null,
  url: '',
  urlError: null,
};

DialogCreateCustomApp.propTypes = {
  classes: PropTypes.object.isRequired,
  icon: PropTypes.string,
  name: PropTypes.string,
  nameError: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  url: PropTypes.string,
  urlError: PropTypes.string,
  hideEnginePrompt: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const {
    open,
    form: {
      icon,
      name,
      nameError,
      url,
      urlError,
    },
  } = state.dialogCreateCustomApp;

  return {
    icon,
    name,
    nameError,
    open,
    url,
    urlError,
    hideEnginePrompt: state.preferences.hideEnginePrompt,
  };
};

const actionCreators = {
  close,
  create,
  updateForm,
};

export default connectComponent(
  DialogCreateCustomApp,
  mapStateToProps,
  actionCreators,
  styles,
);
