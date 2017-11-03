
import React from 'react';
import PropTypes from 'prop-types';

import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import connectComponent from '../helpers/connect-component';

import { open as openDialogSubmitApp } from '../actions/dialogs/submit-app/actions';

import {
  STRING_CANT_FIND_YOUR_FAVORITE_APP,
  STRING_LET_US_KNOW,
} from '../constants/strings';

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: theme.spacing.unit,
  },
  button: {
    marginLeft: theme.spacing.unit,
  },
});

const PromoBar = (props) => {
  const {
    classes,
    onOpenDialogSubmitApp,
  } = props;

  return (
    <div className={classes.root}>
      <Typography type="body1">
        {STRING_CANT_FIND_YOUR_FAVORITE_APP}
      </Typography>
      <Button
        className={classes.button}
        color="primary"
        onClick={onOpenDialogSubmitApp}
      >
        {STRING_LET_US_KNOW}
      </Button>
    </div>
  );
};

PromoBar.propTypes = {
  classes: PropTypes.object.isRequired,
  onOpenDialogSubmitApp: PropTypes.func.isRequired,
};


const actionCreators = {
  openDialogSubmitApp,
};

export default connectComponent(
  PromoBar,
  null,
  actionCreators,
  styles,
);
