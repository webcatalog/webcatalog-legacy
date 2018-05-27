import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import connectComponent from '../../helpers/connect-component';

import {
  close,
  formUpdate,
  save,
} from '../../state/dialogs/inject-js/actions';

import {
  STRING_CANCEL,
  STRING_INJECT_JS,
  STRING_SAVE,
  STRING_USE_AT_YOUR_OWN_RISK,
} from '../../constants/strings';

const styles = {
  content: {
    minWidth: 320,
  },
};

const DialogInjectJS = (props) => {
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
        {STRING_INJECT_JS}
      </DialogTitle>
      <DialogContent className={classes.content}>
        <Typography variant="body1">
          {STRING_USE_AT_YOUR_OWN_RISK}
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          multiline
          onChange={e => onFormUpdate({ content: e.target.value })}
          rows="10"
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

DialogInjectJS.propTypes = {
  classes: PropTypes.object.isRequired,
  content: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onFormUpdate: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

DialogInjectJS.defaultProps = {
  content: '',
  open: false,
};

const mapStateToProps = state => ({
  content: state.dialogs.injectJS.form.content,
  open: state.dialogs.injectJS.open,
});

const actionCreators = {
  close,
  formUpdate,
  save,
};

export default connectComponent(
  DialogInjectJS,
  mapStateToProps,
  actionCreators,
  styles,
);
