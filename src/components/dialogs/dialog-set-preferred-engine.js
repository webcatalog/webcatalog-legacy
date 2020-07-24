import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import connectComponent from '../../helpers/connect-component';

import {
  close,
  save,
  updateForm,
} from '../../state/dialog-set-preferred-engine/actions';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';
import EngineList from '../shared/engine-list';

const styles = (theme) => ({
  grid: {
    marginTop: theme.spacing(1),
  },
  tip: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  dialogActions: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(1),
  },
  inline: {
    display: 'inline',
  },
});

const DialogSetPreferredEngine = (props) => {
  const {
    classes,
    engine,
    onClose,
    onSave,
    onUpdateForm,
    open,
  } = props;

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      open={open}
    >
      <EnhancedDialogTitle onClose={onClose}>
        Choose Preferred Browser Engine
      </EnhancedDialogTitle>
      <DialogContent>
        <Typography component="span" className={classes.tip} color="textPrimary">
          WebCatalog lets you pick your preferrred browser engine to power your apps.
          After you install an app,
          you will have to uninstall and then reinstall to change the engine.
        </Typography>

        <EngineList
          onEngineSelected={(selectedEngine) => onUpdateForm({ engine: selectedEngine })}
          engine={engine}
        />
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={onSave}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DialogSetPreferredEngine.propTypes = {
  classes: PropTypes.object.isRequired,
  engine: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const {
    open,
    form: {
      engine,
    },
  } = state.dialogSetPreferredEngine;

  return {
    engine,
    open,
  };
};

const actionCreators = {
  close,
  save,
  updateForm,
};

export default connectComponent(
  DialogSetPreferredEngine,
  mapStateToProps,
  actionCreators,
  styles,
);
