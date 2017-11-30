import React from 'react';
import PropTypes from 'prop-types';
import isUrl from 'is-url';

import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Fade from 'material-ui/transitions/Fade';
import Grid from 'material-ui/Grid';
import { LinearProgress } from 'material-ui/Progress';
import Dialog, {
  DialogContent,
  DialogActions,
} from 'material-ui/Dialog';

import connectComponent from '../../helpers/connect-component';

import {
  close,
  create,
  updateForm,
} from '../../state/dialogs/create-custom-app/actions';
import {
  STRING_CHANGE_ICON,
  STRING_CLOSE,
  STRING_CREATE_CUSTOM_APP,
  STRING_CREATE,
  STRING_CREATING,
  STRING_NAME,
  STRING_URL,
} from '../../constants/strings';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

import electronIcon from '../../assets/electron-icon.png';

const styles = theme => ({
  linearProgress: {
    opacity: 0,
  },
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
});

const CreateCustomAppDialog = (props) => {
  const {
    classes,
    icon,
    isCreating,
    name,
    nameError,
    onClose,
    onCreate,
    onUpdateForm,
    open,
    url,
    urlError,
  } = props;

  let iconPath = electronIcon;
  if (icon) {
    if (isUrl(icon)) iconPath = icon;
    else iconPath = `file://${icon}`;
  }

  return (
    <Dialog
      className={classes.root}
      onRequestClose={onClose}
      open={open}
    >
      <Fade in={isCreating}>
        <LinearProgress className={classes.linearProgress} />
      </Fade>
      <EnhancedDialogTitle onCloseButtonClick={onClose}>
        {STRING_CREATE_CUSTOM_APP}
      </EnhancedDialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          disabled={isCreating}
          id="name"
          label={nameError || STRING_NAME}
          margin="normal"
          onChange={e => onUpdateForm({ name: e.target.value })}
          value={name}
          error={Boolean(nameError)}
        />
        <TextField
          fullWidth
          disabled={isCreating}
          id="url"
          label={urlError || STRING_URL}
          margin="normal"
          onChange={e => onUpdateForm({ url: e.target.value })}
          value={url}
          error={Boolean(urlError)}
        />
        <Grid container className={classes.grid}>
          <Grid item>
            <div className={classes.iconContainer}>
              <img src={iconPath} alt={name} className={classes.icon} />
            </div>
          </Grid>
          <Grid item>
            <Button
              raised
              onClick={() => {
                window.dialog.showOpenDialog({
                  filters: [{ name: 'PNG (Portable Network Graphics)', extensions: ['png'] }],
                  properties: ['openFile'],
                }, (filePaths) => {
                  if (filePaths && filePaths.length > 0) {
                    onUpdateForm({ icon: filePaths[0] });
                  }
                });
              }}
            >
              {STRING_CHANGE_ICON}
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {STRING_CLOSE}
        </Button>
        <Button
          color="primary"
          disabled={isCreating}
          onClick={onCreate}
        >
          {isCreating ? STRING_CREATING : STRING_CREATE}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CreateCustomAppDialog.defaultProps = {
  icon: null,
  name: '',
  nameError: null,
  url: '',
  urlError: null,
};

CreateCustomAppDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  icon: PropTypes.string,
  isCreating: PropTypes.bool.isRequired,
  name: PropTypes.string,
  nameError: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  url: PropTypes.string,
  urlError: PropTypes.string,
};

const mapStateToProps = (state) => {
  const {
    open,
    isCreating,
    form: {
      icon,
      name,
      nameError,
      url,
      urlError,
    },
  } = state.dialogs.createCustomApp;

  return {
    icon,
    isCreating,
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
  updateForm,
};

export default connectComponent(
  CreateCustomAppDialog,
  mapStateToProps,
  actionCreators,
  styles,
);
