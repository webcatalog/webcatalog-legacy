import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import Dialog, { DialogContent, DialogActions } from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';
import TextField from 'material-ui/TextField';

import connectComponent from '../../helpers/connect-component';

import {
  activate,
  close,
  updateForm,
} from '../../state/dialogs/activate/actions';

import { requestOpenInBrowser } from '../../senders/generic';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

import {
  STRING_LICENSE_KEY,
  STRING_CLOSE,
  STRING_PURCHASE,
  STRING_ACTIVATE,
  STRING_ACTIVATE_DESC_1,
  STRING_ACTIVATE_DESC_2,
  STRING_ACTIVATE_DESC_3,
} from '../../constants/strings';

const styles = {
  dialogContent: {
    minWidth: 320,
  },
};

const Transition = props => <Slide direction="left" {...props} />;

const Activate = (props) => {
  const {
    classes,
    onActivate,
    onClose,
    onUpdateForm,
    licenseKey,
    open,
  } = props;

  return (
    <Dialog
      className={classes.root}
      onClose={onClose}
      open={open}
      transition={Transition}
    >
      <EnhancedDialogTitle onCloseButtonClick={onClose}>
        {STRING_ACTIVATE}
      </EnhancedDialogTitle>
      <DialogContent className={classes.dialogContent}>
        <p>{STRING_ACTIVATE_DESC_1}</p>
        <p>{STRING_ACTIVATE_DESC_2}</p>
        <p>{STRING_ACTIVATE_DESC_3}</p>
        <TextField
          fullWidth
          id="licenseKey"
          label={STRING_LICENSE_KEY}
          margin="normal"
          onChange={e => onUpdateForm({ licenseKey: e.target.value })}
          value={licenseKey}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
        >
          {STRING_CLOSE}
        </Button>
        <Button
          color="primary"
          onClick={() => requestOpenInBrowser('https://webcatalog.onfastspring.com/webcatalog-lite')}
        >
          {STRING_PURCHASE}
        </Button>
        <Button
          color="secondary"
          onClick={onActivate}
        >
          {STRING_ACTIVATE}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

Activate.propTypes = {
  classes: PropTypes.object.isRequired,
  onActivate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  licenseKey: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  licenseKey: state.dialogs.activate.form.licenseKey,
  open: state.dialogs.activate.open,
});

const actionCreators = {
  activate,
  close,
  updateForm,
};

export default connectComponent(
  Activate,
  mapStateToProps,
  actionCreators,
  styles,
);
