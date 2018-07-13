import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import connectComponent from '../../../helpers/connect-component';

import {
  close,
  modeUpdate,
  turnPasswordOff,
} from '../../../state/dialogs/lock-app/actions';

import {
  STRING_CANCEL,
  STRING_CHANGE_PASSWORD,
  STRING_TURN_PASSWORD_OFF,
} from '../../../constants/strings';

const styles = theme => ({
  content: {
    minWidth: 320,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

const PickAnOption = (props) => {
  const {
    classes,
    onClose,
    onModeUpdate,
    onTurnPasswordOff,
  } = props;

  return (
    <React.Fragment>
      <DialogContent className={classes.content}>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() => onModeUpdate(1)}
        >
          {STRING_CHANGE_PASSWORD}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          onClick={onTurnPasswordOff}
        >
          {STRING_TURN_PASSWORD_OFF}
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {STRING_CANCEL}
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};

PickAnOption.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onModeUpdate: PropTypes.func.isRequired,
  onTurnPasswordOff: PropTypes.func.isRequired,
};

const actionCreators = {
  close,
  modeUpdate,
  turnPasswordOff,
};

export default connectComponent(
  PickAnOption,
  null,
  actionCreators,
  styles,
);
