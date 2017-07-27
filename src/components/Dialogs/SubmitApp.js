import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from 'material-ui/Button';
import Fade from 'material-ui/transitions/Fade';
import Slide from 'material-ui/transitions/Slide';
import TextField from 'material-ui/TextField';
import { LinearProgress } from 'material-ui/Progress';
import {
  createStyleSheet,
  withStyles,
} from 'material-ui/styles';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';

import {
  close,
  formUpdate,
  save,
} from '../../state/ui/dialogs/submit-app/actions';

const styleSheet = createStyleSheet('SubmitApp', {
  linearProgress: {
    opacity: 0,
  },
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  dialogContent: {
    minWidth: 240,
  },
  textField: {
    width: '100%',
  },
});

const SubmitApp = (props) => {
  const {
    isSaving,
    classes,
    name,
    onSave,
    onClose,
    onFormUpdate,
    open,
    url,
  } = props;

  const saveButtonText = isSaving ? 'Submitting...' : 'Submit';

  return (
    <Dialog
      ignoreBackdropClick={isSaving}
      className={classes.root}
      onRequestClose={onClose}
      open={open}
      transition={<Slide direction="left" />}
    >
      <Fade in={isSaving}>
        <LinearProgress className={classes.linearProgress} />
      </Fade>

      <DialogTitle>Submit app</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <TextField
          className={classes.textField}
          disabled={isSaving}
          id="name"
          label="Name"
          marginForm
          onChange={e => onFormUpdate({ name: e.target.value })}
          placeholder="e.g. Gmail"
          value={name}
        />
        <br />
        <TextField
          className={classes.textField}
          disabled={isSaving}
          id="url"
          label="URL"
          marginForm
          onChange={e => onFormUpdate({ url: e.target.value })}
          placeholder="e.g. gmail.com"
          value={url}
        />
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          disabled={isSaving}
          color="primary"
          onClick={onSave}
        >
          {saveButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

SubmitApp.defaultProps = {
  name: '',
  open: false,
  url: '',
};

SubmitApp.propTypes = {
  classes: PropTypes.object.isRequired,
  isSaving: PropTypes.bool.isRequired,
  name: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onFormUpdate: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  url: PropTypes.string,
};

const mapStateToProps = state => ({
  isSaving: state.ui.dialogs.submitApp.isSaving,
  name: state.ui.dialogs.submitApp.form.name,
  open: state.ui.dialogs.submitApp.open,
  url: state.ui.dialogs.submitApp.form.url,
});

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(close()),
  onFormUpdate: changes => dispatch(formUpdate(changes)),
  onSave: () => dispatch(save()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(SubmitApp));
