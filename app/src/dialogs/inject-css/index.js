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
} from '../../state/dialogs/inject-css/actions';

import {
  STRING_CANCEL,
  STRING_INJECT_CSS,
  STRING_SAVE,
  STRING_USE_AT_YOUR_OWN_RISK,
} from '../../constants/strings';

const styles = {
  content: {
    minWidth: 320,
  },
};

const DialogInjectCSS = (props) => {
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
        {STRING_INJECT_CSS}
      </DialogTitle>
      <DialogContent className={classes.content}>
        <Typography type="body1">
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

DialogInjectCSS.propTypes = {
  classes: PropTypes.object.isRequired,
  content: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onFormUpdate: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

DialogInjectCSS.defaultProps = {
  content: '',
  open: false,
};

const mapStateToProps = state => ({
  content: state.dialogs.injectCSS.form.content,
  open: state.dialogs.injectCSS.open,
});

const actionCreators = {
  close,
  formUpdate,
  save,
};

export default connectComponent(
  DialogInjectCSS,
  mapStateToProps,
  actionCreators,
  styles,
);
