import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import Fade from 'material-ui/transitions/Fade';
import FormControl from 'material-ui/Form/FormControl';
import FormHelperText from 'material-ui/Form/FormHelperText';
import Input from 'material-ui/Input';
import Slide from 'material-ui/transitions/Slide';
import { LinearProgress } from 'material-ui/Progress';
import Dialog, {
  DialogActions,
  DialogContent,
} from 'material-ui/Dialog';

import connectComponent from '../helpers/connect-component';

import {
  close,
  formUpdate,
  save,
} from '../state/dialogs/feedback/actions';

import {
  STRING_CANCEL,
  STRING_LEAVE_FEEDBACK,
  STRING_SEND,
  STRING_SEND_FEEDBACK,
  STRING_SENDING,
} from '../constants/strings';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

const styles = {
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
};

const Feedback = (props) => {
  const {
    classes,
    content,
    contentError,
    isSaving,
    onClose,
    onFormUpdate,
    onSave,
    open,
  } = props;

  const saveButtonText = isSaving ? STRING_SENDING : STRING_SEND;

  return (
    <Dialog
      className={classes.root}
      ignoreBackdropClick={isSaving}
      onRequestClose={onClose}
      open={open}
      transition={<Slide direction="left" />}
    >
      <Fade in={isSaving}>
        <LinearProgress className={classes.linearProgress} />
      </Fade>

      <EnhancedDialogTitle onCloseButtonClick={onClose}>
        {STRING_SEND_FEEDBACK}
      </EnhancedDialogTitle>
      <DialogContent className={classes.dialogContent}>
        <FormControl className={classes.formControl} error={contentError}>
          <Input
            id="content"
            multiline
            onChange={e => onFormUpdate({ content: e.target.value })}
            placeholder={STRING_LEAVE_FEEDBACK}
            rows="10"
            value={content}
          />
          {contentError ? <FormHelperText>{contentError}</FormHelperText> : null}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={onClose}
        >
          {STRING_CANCEL}
        </Button>
        <Button
          color="primary"
          disabled={isSaving}
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
  content: PropTypes.string,
  contentError: PropTypes.string,
  isSaving: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onFormUpdate: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

const mapStateToProps = state => ({
  content: state.dialogs.feedback.form.content,
  contentError: state.dialogs.feedback.form.contentError,
  isSaving: state.dialogs.feedback.isSaving,
  open: state.dialogs.feedback.open,
});

const actionCreators = {
  close,
  formUpdate,
  save,
};

export default connectComponent(
  Feedback,
  mapStateToProps,
  actionCreators,
  styles,
);
