import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import connectComponent from '../../helpers/connect-component';
import getAvatarText from '../../helpers/get-avatar-text';

import { updateForm, save } from '../../state/edit-workspace/actions';

const styles = (theme) => ({
  root: {
    background: theme.palette.background.paper,
    height: '100vh',
    width: '100vw',
    padding: theme.spacing.unit * 3,
    display: 'flex',
    flexDirection: 'column',
  },
  flexGrow: {
    flex: 1,
  },
  button: {
    float: 'right',
  },
  textField: {
    marginBottom: theme.spacing.unit * 3,
  },
  avatarFlex: {
    display: 'flex',
  },
  avatarLeft: {
    padding: theme.spacing.unit,
  },
  avatarRight: {
    flex: 1,
    padding: theme.spacing.unit,
  },
  avatar: {
    fontFamily: theme.typography.fontFamily,
    height: 64,
    width: 64,
    background: theme.palette.type === 'dark' ? theme.palette.common.white : theme.palette.common.black,
    borderRadius: 4,
    color: theme.palette.getContrastText(theme.palette.type === 'dark' ? theme.palette.common.white : theme.palette.common.black),
    fontSize: '32px',
    lineHeight: '64px',
    textAlign: 'center',
    fontWeight: 500,
    textTransform: 'uppercase',
    userSelect: 'none',
  },
  avatarPicture: {
    height: 64,
    width: 64,
    borderRadius: 4,
  },
  buttonBot: {
    marginTop: theme.spacing.unit,
  },
});

const EditWorkspace = ({
  classes,
  homeUrl,
  id,
  name,
  onSave,
  onUpdateForm,
  order,
  picturePath,
}) => (
  <div className={classes.root}>
    <div className={classes.flexGrow}>
      <TextField
        id="outlined-full-width"
        label="Name"
        placeholder="Optional"
        fullWidth
        margin="dense"
        variant="outlined"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        value={name}
        onChange={(e) => onUpdateForm({ name: e.target.value })}
      />
      <TextField
        id="outlined-full-width"
        label="Home URL"
        placeholder="Optional"
        fullWidth
        margin="dense"
        variant="outlined"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        value={homeUrl}
        onChange={(e) => onUpdateForm({ homeUrl: e.target.value })}
      />
      <div className={classes.avatarFlex}>
        <div className={classes.avatarLeft}>
          <div className={classes.avatar}>
            {picturePath ? (
              <img alt="Icon" className={classes.avatarPicture} src={`file://${picturePath}`} />
            ) : getAvatarText(id, name, order)}
          </div>
        </div>
        <div className={classes.avatarRight}>
          <Button
            variant="contained"
            onClick={() => {
              const { remote } = window.require('electron');
              const opts = {
                properties: ['openFile'],
                filters: [
                  { name: 'Images', extensions: ['jpg', 'jpeg', 'png'] },
                ],
              };
              remote.dialog.showOpenDialog(remote.getCurrentWindow(), opts)
                .then(({ canceled, filePaths }) => {
                  if (!canceled && filePaths && filePaths.length > 0) {
                    onUpdateForm({ picturePath: filePaths[0] });
                  }
                })
                .catch(console.log); // eslint-disable-line
            }}
          >
            Change Icon
          </Button>
          <br />
          <Button
            variant="contained"
            className={classes.buttonBot}
            onClick={() => onUpdateForm({ picturePath: null })}
          >
            Remove Icon
          </Button>
        </div>
      </div>
    </div>
    <div>
      <Button color="primary" variant="contained" className={classes.button} onClick={onSave}>
        Save
      </Button>
    </div>
  </div>
);

EditWorkspace.defaultProps = {
  picturePath: null,
};

EditWorkspace.propTypes = {
  classes: PropTypes.object.isRequired,
  homeUrl: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  order: PropTypes.number.isRequired,
  picturePath: PropTypes.string,
};

const mapStateToProps = (state) => ({
  homeUrl: state.editWorkspace.form.homeUrl,
  id: state.editWorkspace.form.id,
  name: state.editWorkspace.form.name,
  order: state.editWorkspace.form.order,
  picturePath: state.editWorkspace.form.picturePath,
});

const actionCreators = {
  updateForm,
  save,
};

export default connectComponent(
  EditWorkspace,
  mapStateToProps,
  actionCreators,
  styles,
);
