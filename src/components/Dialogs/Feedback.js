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
} from '../../state/ui/dialogs/feedback/actions';

const styleSheet = createStyleSheet('Feedback', {
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

const Feedback = (props) => {
  const {
    isSaving,
    classes,
    content,
    onSave,
    onClose,
    onFormUpdate,
    open,
  } = props;

  const saveButtonText = isSaving ? 'Sending...' : 'Send';

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

      <DialogTitle>Send feedback</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <TextField
          className={classes.textField}
          disabled={isSaving}
          id="content"
          label="Feedback"
          marginForm
          onChange={e => onFormUpdate({ content: e.target.value })}
          value={content}
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

Feedback.defaultProps = {
  content: '',
  open: false,
};

Feedback.propTypes = {
  classes: PropTypes.object.isRequired,
  isSaving: PropTypes.bool.isRequired,
  content: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onFormUpdate: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isSaving: state.ui.dialogs.feedback.isSaving,
  content: state.ui.dialogs.feedback.form.content,
  open: state.ui.dialogs.feedback.open,
});

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(close()),
  onFormUpdate: changes => dispatch(formUpdate(changes)),
  onSave: () => dispatch(save()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Feedback));
