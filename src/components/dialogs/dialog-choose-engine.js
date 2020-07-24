import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import connectComponent from '../../helpers/connect-component';

import {
  close,
  create,
  updateForm,
} from '../../state/dialog-choose-engine/actions';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';
import EngineList from '../shared/engine-list';

import { requestSetPreference } from '../../senders';

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

const DialogChooseEngine = (props) => {
  const {
    classes,
    engine,
    name,
    onClose,
    onCreate,
    onUpdateForm,
    open,
    hideEnginePrompt,
  } = props;

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      open={open}
    >
      <EnhancedDialogTitle onClose={onClose}>
        Choose an Browser Engine for
        {` ${name}`}
      </EnhancedDialogTitle>
      <DialogContent>
        <Typography component="span" className={classes.tip} color="textPrimary">
          WebCatalog lets you pick your preferrred browser engine to power&nbsp;
          {name}
          . This cannot be changed later.
          You will have to uninstall and then reinstall to change the engine of an app.
        </Typography>
        <EngineList
          onEngineSelected={(selectedEngine) => onUpdateForm({ engine: selectedEngine })}
          engine={engine}
        />
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <FormControlLabel
          control={(
            <Checkbox
              checked={hideEnginePrompt}
              onChange={(e) => requestSetPreference('hideEnginePrompt', e.target.checked)}
              color="primary"
            />
          )}
          label="Don't ask again"
        />
        <Button
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={onCreate}
        >
          Install
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DialogChooseEngine.propTypes = {
  classes: PropTypes.object.isRequired,
  engine: PropTypes.string.isRequired,
  hideEnginePrompt: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const {
    open,
    form: {
      name,
      engine,
    },
  } = state.dialogChooseEngine;

  const {
    hideEnginePrompt,
  } = state.preferences;

  return {
    engine,
    name,
    open,
    hideEnginePrompt,
  };
};

const actionCreators = {
  close,
  create,
  updateForm,
};

export default connectComponent(
  DialogChooseEngine,
  mapStateToProps,
  actionCreators,
  styles,
);
