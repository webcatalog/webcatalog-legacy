import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';

import connectComponent from '../../helpers/connect-component';

import {
  close,
  formUpdate,
  resetToDefault,
  save,
} from '../../state/dialogs/home-page/actions';

import {
  STRING_CANCEL,
  STRING_HOME_PAGE,
  STRING_RESET_TO_DEFAULT,
  STRING_SAVE,
} from '../../constants/strings';

const styles = {
  content: {
    minWidth: 320,
  },
};

const DialogHomePage = (props) => {
  const {
    classes,
    content,
    onClose,
    onFormUpdate,
    onResetToDefault,
    onSave,
    open,
  } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {STRING_HOME_PAGE}
      </DialogTitle>
      <DialogContent className={classes.content}>
        <TextField
          type="url"
          fullWidth
          margin="normal"
          onChange={e => onFormUpdate({ content: e.target.value })}
          value={content}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {STRING_CANCEL}
        </Button>
        <Button onClick={onResetToDefault} color="secondary">
          {STRING_RESET_TO_DEFAULT}
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

DialogHomePage.propTypes = {
  classes: PropTypes.object.isRequired,
  content: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onFormUpdate: PropTypes.func.isRequired,
  onResetToDefault: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

DialogHomePage.defaultProps = {
  content: '',
  open: false,
};

const mapStateToProps = state => ({
  content: state.dialogs.homePage.form.content,
  open: state.dialogs.homePage.open,
});

const actionCreators = {
  close,
  formUpdate,
  resetToDefault,
  save,
};

export default connectComponent(
  DialogHomePage,
  mapStateToProps,
  actionCreators,
  styles,
);
