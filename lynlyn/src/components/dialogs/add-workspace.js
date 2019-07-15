import React from 'react';
import PropTypes from 'prop-types';
import isUrl from 'is-url';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import connectComponent from '../../helpers/connect-component';

import {
  close,
  add,
  updateForm,
} from '../../state/dialogs/add-workspace/actions';
import {
  STRING_CHANGE_ICON,
  STRING_ADD_WORKSPACE,
  STRING_ADD,
  STRING_NAME,
  STRING_URL,
} from '../../constants/strings';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

import electronIcon from '../../assets/default-icon.png';

const styles = theme => ({
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
  formControl: {
    marginTop: theme.spacing.unit * 2,
    width: '100%',
  },
});

const AddWorkspaceDialog = (props) => {
  const {
    classes,
    icon,
    name,
    nameError,
    onClose,
    onAdd,
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
      maxWidth="xs"
      onClose={onClose}
      open={open}
    >
      <EnhancedDialogTitle onCloseButtonClick={onClose}>
        {STRING_ADD_WORKSPACE}
      </EnhancedDialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          id="name"
          label={nameError || STRING_NAME}
          margin="normal"
          onChange={e => onUpdateForm({ name: e.target.value })}
          value={name}
          error={Boolean(nameError)}
        />
        <TextField
          fullWidth
          id="url"
          label={urlError || STRING_URL}
          margin="normal"
          onChange={e => onUpdateForm({ url: e.target.value })}
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
        <Button
          color="primary"
          onClick={onAdd}
        >
          {STRING_ADD}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AddWorkspaceDialog.defaultProps = {
  icon: null,
  name: '',
  nameError: null,
  url: '',
  urlError: null,
};

AddWorkspaceDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  icon: PropTypes.string,
  name: PropTypes.string,
  nameError: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  url: PropTypes.string,
  urlError: PropTypes.string,
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
  } = state.dialogs.addWorkspace;

  return {
    icon,
    name,
    nameError,
    open,
    url,
    urlError,
  };
};

const actionCreators = {
  close,
  add,
  updateForm,
};

export default connectComponent(
  AddWorkspaceDialog,
  mapStateToProps,
  actionCreators,
  styles,
);
