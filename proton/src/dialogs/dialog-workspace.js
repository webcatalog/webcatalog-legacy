import React from 'react';
import PropTypes from 'prop-types';

import FormControl from 'material-ui/Form/FormControl';
import FormHelperText from 'material-ui/Form/FormHelperText';
import Input from 'material-ui/Input';
import InputLabel from 'material-ui/Input/InputLabel';
import Slide from 'material-ui/transitions/Slide';
import Dialog from 'material-ui/Dialog';

import connectComponent from '../../helpers/connect-component';

import {
  close,
  formUpdate,
} from '../../state/ui/workspaces-bar/dialog-workspace/actions';

/*
import {
  STRING_SEND,
  STRING_SENDING,
} from '../../constants/strings';
*/

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

const DialogWorkspace = (props) => {
  const {
    classes,
    workspaceName,
    workspaceNameError,
    isSaving,
    onClose,
    onFormUpdate,
    // onSave,
    open,
  } = props;

  // const saveButtonText = isSaving ? STRING_SENDING : STRING_SEND;

  return (
    <Dialog
      className={classes.root}
      ignoreBackdropClick={isSaving}
      onRequestClose={onClose}
      open={open}
      transition={<Slide direction="left" />}
    >
      <FormControl className={classes.formControl} error={workspaceNameError}>
        <InputLabel htmlFor="workspaceName">Workspace Name</InputLabel>
        <Input
          id="workspaceName"
          onChange={e => onFormUpdate({ workspaceName: e.target.value })}
          placeholder="Enter a name"
          type="text"
          value={workspaceName}
        />
        {workspaceNameError ? <FormHelperText>{workspaceNameError}</FormHelperText> : null}
      </FormControl>
    </Dialog>
  );
};

DialogWorkspace.defaultProps = {
  isSaving: false,
  open: false,
  workspaceName: '',
  workspaceNameError: null,
};

DialogWorkspace.propTypes = {
  classes: PropTypes.object.isRequired,
  isSaving: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onFormUpdate: PropTypes.func.isRequired,
  open: PropTypes.bool,
  workspaceName: PropTypes.string,
  workspaceNameError: PropTypes.string,
};

const mapStateToProps = state => ({
  open: state.workspacesBar.dialogWorkspace.open,
  workspaceName: state.workspacesBar.dialogWorkspace.form.workspaceName,
  workspaceNameError: state.workspacesBar.dialogWorkspace.form.workspaceNameError,
});

const actionCreators = {
  close,
  formUpdate,
};

export default connectComponent(
  DialogWorkspace,
  mapStateToProps,
  actionCreators,
  styles,
);
