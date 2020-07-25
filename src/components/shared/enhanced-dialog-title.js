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
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: 4,
    color: theme.palette.grey[500],
    padding: theme.spacing(1),
  },
});

const EnhancedDialogTitle = ({
  children,
  classes,
  disableTypography,
  onClose,
}) => (
  <MuiDialogTitle disableTypography className={classes.root}>
    {disableTypography ? children : (
      <Typography variant="subtitle1">{children}</Typography>
    )}
    {onClose ? (
      <IconButton size="small" aria-label="Close" className={classes.closeButton} onClick={onClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    ) : null}
  </MuiDialogTitle>
);

EnhancedDialogTitle.defaultProps = {
  disableTypography: false,
};

EnhancedDialogTitle.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
  disableTypography: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

export default connectComponent(
  EnhancedDialogTitle,
  null,
  null,
  styles,
);
