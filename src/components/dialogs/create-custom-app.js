import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

import connectComponent from '../../helpers/connect-component';
import isUrl from '../../helpers/is-url';

import {
  close,
  create,
  updateForm,
} from '../../state/dialogs/create-custom-app/actions';
import {
  STRING_CHANGE_ICON,
  STRING_CREATE_CUSTOM_APP,
  STRING_CREATE,
  STRING_NAME,
  STRING_URL,
  STRING_CATEGORY,
  STRING_OTHER,
} from '../../constants/strings';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

import electronIcon from '../../assets/default-icon.png';

import linuxCategories from '../../constants/linux-categories';

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

const CreateCustomAppDialog = (props) => {
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
    category,
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
        {STRING_CREATE_CUSTOM_APP}
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
        {window.platform === 'linux' && (
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="category">{STRING_CATEGORY}</InputLabel>
            <Select
              value={category}
              onChange={e => onUpdateForm({ category: e.target.value })}
              inputProps={{
                name: 'category',
                id: 'category',
              }}
            >
              <MenuItem value="Other">
                <em>{STRING_OTHER}</em>
              </MenuItem>
              {linuxCategories.map(c => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
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
          onClick={onCreate}
        >
          {STRING_CREATE}
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
  category: '',
};

CreateCustomAppDialog.propTypes = {
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
  category: PropTypes.string,
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
      category,
    },
  } = state.dialogs.createCustomApp;

  return {
    icon,
    name,
    nameError,
    open,
    url,
    urlError,
    category,
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
