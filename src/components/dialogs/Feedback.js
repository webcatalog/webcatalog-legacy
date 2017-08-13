import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from 'material-ui/Button';
import Fade from 'material-ui/transitions/Fade';
import Slide from 'material-ui/transitions/Slide';
import { LinearProgress } from 'material-ui/Progress';
import Input from 'material-ui/Input';
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
} from '../../state/dialogs/feedback/actions';

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
    minWidth: 320,
  },
  formControl: {
    width: '100%',
  },
});

const Feedback = (props) => {
  const {
    isSaving,
    classes,
    content,
    contentError,
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

      <DialogTitle>Send Feedback</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <FormControl className={classes.formControl} error={contentError}>
          <Input
            label="Feedback"
            placeholder="Leave your feedback here."
            id="content"
            value={content}
            multiline
            rows="10"
            onChange={e => onFormUpdate({ content: e.target.value })}
          />
          {contentError ? <FormHelperText>{contentError}</FormHelperText> : null}
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

Feedback.defaultProps = {
  content: '',
  contentError: null,
  open: false,
};

Feedback.propTypes = {
  classes: PropTypes.object.isRequired,
  isSaving: PropTypes.bool.isRequired,
  content: PropTypes.string,
  contentError: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onFormUpdate: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isSaving: state.dialogs.feedback.isSaving,
  content: state.dialogs.feedback.form.content,
  contentError: state.dialogs.feedback.form.contentError,
  open: state.dialogs.feedback.open,
});

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(close()),
  onFormUpdate: changes => dispatch(formUpdate(changes)),
  onSave: () => dispatch(save()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Feedback));
