import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';

import connectComponent from '../../helpers/connect-component';

import {
  close,
  formUpdate,
  save,
} from '../../state/dialogs/user-agent/actions';

import {
  STRING_CANCEL,
  STRING_LEAVE_IT_BLANK_FOR_DEFAULT,
  STRING_SAVE,
  STRING_USE_AT_YOUR_OWN_RISK,
  STRING_USER_AGENT,
} from '../../constants/strings';

const styles = {
  content: {
    minWidth: 320,
  },
};

const DialogUserAgent = (props) => {
  const {
    classes,
    content,
    onClose,
    onFormUpdate,
    onSave,
    open,
  } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {STRING_USER_AGENT}
      </DialogTitle>
      <DialogContent className={classes.content}>
        <Typography type="body1">
          {STRING_USE_AT_YOUR_OWN_RISK}
        </Typography>
        <Typography type="body1">
          {STRING_LEAVE_IT_BLANK_FOR_DEFAULT}
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          onChange={e => onFormUpdate({ content: e.target.value })}
          value={content}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {STRING_CANCEL}
        </Button>
        <Button
          color="primary"
          onClick={onSave}
        >
          {STRING_SAVE}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DialogUserAgent.propTypes = {
  classes: PropTypes.object.isRequired,
  content: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onFormUpdate: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

DialogUserAgent.defaultProps = {
  content: '',
  open: false,
};

const mapStateToProps = state => ({
  content: state.dialogs.userAgent.form.content,
  open: state.dialogs.userAgent.open,
});

const actionCreators = {
  close,
  formUpdate,
  save,
};

export default connectComponent(
  DialogUserAgent,
  mapStateToProps,
  actionCreators,
  styles,
);
