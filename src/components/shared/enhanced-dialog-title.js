import React from 'react';
import PropTypes from 'prop-types';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

import connectComponent from '../../helpers/connect-component';

const styles = (theme) => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: 6,
    color: theme.palette.grey[500],
    padding: theme.spacing.unit,
  },
});

const EnhancedDialogTitle = ({ children, classes, onClose }) => (
  <MuiDialogTitle disableTypography className={classes.root}>
    <Typography variant="h6">{children}</Typography>
    {onClose ? (
      <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
        <CloseIcon />
      </IconButton>
    ) : null}
  </MuiDialogTitle>
);

EnhancedDialogTitle.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
  ]).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default connectComponent(
  EnhancedDialogTitle,
  null,
  null,
  styles,
);
