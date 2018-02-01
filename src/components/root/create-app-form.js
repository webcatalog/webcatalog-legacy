import React from 'react';
import PropTypes from 'prop-types';
import isUrl from 'is-url';

import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';
import { CircularProgress } from 'material-ui/Progress';

import connectComponent from '../../helpers/connect-component';

import {
  create,
  updateForm,
} from '../../state/root/create-app-form/actions';
import {
  STRING_CHANGE_ICON,
  STRING_CHANGE_LOCATION,
  STRING_CREATE,
  STRING_LOCATION,
  STRING_NAME,
  STRING_URL,
} from '../../constants/strings';

import electronIcon from '../../assets/electron-icon.png';

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
});

const FormCreateApp = (props) => {
  const {
    classes,
    icon,
    isCreating,
    location,
    locationError,
    name,
    nameError,
    onCreate,
    onUpdateForm,
    url,
    urlError,
  } = props;

  let iconPath = electronIcon;
  if (icon) {
    if (isUrl(icon)) iconPath = icon;
    else iconPath = `file://${icon}`;
  }

  return (
    <div
      className={classes.root}
    >
      <TextField
        fullWidth
        id="name"
        label={nameError || STRING_NAME}
        margin="normal"
        onChange={e => onUpdateForm({ name: e.target.value })}
        value={name}
        error={Boolean(nameError)}
        disabled={isCreating}
      />
      <TextField
        fullWidth
        id="url"
        label={urlError || STRING_URL}
        margin="normal"
        onChange={e => onUpdateForm({ url: e.target.value })}
        value={url}
        error={Boolean(urlError)}
        disabled={isCreating}
      />
      <div style={{ display: 'flex' }}>
        <TextField
          fullWidth
          id="location"
          label={locationError || STRING_LOCATION}
          margin="normal"
          value={location}
          error={Boolean(locationError)}
          disabled
        />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            raised
            disabled={isCreating}
            onClick={() => {
              window.dialog.showOpenDialog({
                properties: ['openDirectory', 'createDirectory'],
              }, (filePaths) => {
                if (filePaths && filePaths.length > 0) {
                  onUpdateForm({ location: filePaths[0] });
                }
              });
            }}
          >
            {STRING_CHANGE_LOCATION}
          </Button>
        </div>
      </div>
      <Grid container className={classes.grid}>
        <Grid item>
          <div className={classes.iconContainer}>
            <img src={iconPath} alt={name} className={classes.icon} />
          </div>
        </Grid>
        <Grid item>
          <Button
            raised
            disabled={isCreating}
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

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 32 }}>
        {isCreating ? <CircularProgress size={50} /> : (
          <Button
            color="primary"
            raised
            onClick={onCreate}
          >
            {STRING_CREATE}
          </Button>
        )}
      </div>
    </div>
  );
};

FormCreateApp.defaultProps = {
  icon: null,
  isCreating: false,
  name: '',
  nameError: null,
  url: '',
  urlError: null,
  location: '',
  locationError: null,
};

FormCreateApp.propTypes = {
  classes: PropTypes.object.isRequired,
  icon: PropTypes.string,
  isCreating: PropTypes.bool,
  location: PropTypes.string,
  locationError: PropTypes.string,
  name: PropTypes.string,
  nameError: PropTypes.string,
  onCreate: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  url: PropTypes.string,
  urlError: PropTypes.string,
};

const mapStateToProps = (state) => {
  const {
    isCreating,
    form: {
      icon,
      name,
      nameError,
      url,
      urlError,
      location,
      locationError,
    },
  } = state.createAppForm;

  return {
    icon,
    isCreating,
    location,
    locationError,
    name,
    nameError,
    url,
    urlError,
  };
};

const actionCreators = {
  create,
  updateForm,
};

export default connectComponent(
  FormCreateApp,
  mapStateToProps,
  actionCreators,
  styles,
);
