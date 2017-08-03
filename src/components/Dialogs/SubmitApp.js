import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from 'material-ui/Button';
import Fade from 'material-ui/transitions/Fade';
import Slide from 'material-ui/transitions/Slide';
import { LinearProgress } from 'material-ui/Progress';
import Input from 'material-ui/Input';
import InputLabel from 'material-ui/Input/InputLabel';
import FormControl from 'material-ui/Form/FormControl';
import FormHelperText from 'material-ui/Form/FormHelperText';

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
  formControl: {
    width: '100%',
  },
});

const SubmitApp = (props) => {
  const {
    isSaving,
    classes,
    name,
    nameError,
    onSave,
    onClose,
    onFormUpdate,
    open,
    url,
    urlError,
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
        <FormControl className={classes.formControl} error={nameError}>
          <InputLabel htmlFor="name">Name</InputLabel>
          <Input
            placeholder="e.g. Gmail"
            id="name"
            value={name}
            onChange={e => onFormUpdate({ name: e.target.value })}
          />
          {nameError ? <FormHelperText>{nameError}</FormHelperText> : null}
        </FormControl>
        <br />
        <br />
        <FormControl className={classes.formControl} error={urlError}>
          <InputLabel htmlFor="url">URL</InputLabel>
          <Input
            placeholder="e.g. gmail.com"
            id="url"
            value={url}
            onChange={e => onFormUpdate({ url: e.target.value })}
          />
          {urlError ? <FormHelperText>{urlError}</FormHelperText> : null}
        </FormControl>
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
  nameError: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onFormUpdate: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  url: PropTypes.string,
  urlError: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  isSaving: state.ui.dialogs.submitApp.isSaving,
  name: state.ui.dialogs.submitApp.form.name,
  nameError: state.ui.dialogs.submitApp.form.nameError,
  open: state.ui.dialogs.submitApp.open,
  url: state.ui.dialogs.submitApp.form.url,
  urlError: state.ui.dialogs.submitApp.form.urlError,
});

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(close()),
  onFormUpdate: changes => dispatch(formUpdate(changes)),
  onSave: () => dispatch(save()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(SubmitApp));
