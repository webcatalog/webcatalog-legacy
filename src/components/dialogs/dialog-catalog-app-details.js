/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import connectComponent from '../../helpers/connect-component';

import { close } from '../../state/dialog-catalog-app-details/actions';

import AppCard from '../shared/app-card';

const styles = (theme) => ({
  dialogContent: {
    padding: '0 !important',
  },
  link: {
    fontWeight: 600,
    cursor: 'pointer',
    outline: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  status: {
    textAlign: 'center',
    padding: theme.spacing(4),
  },
});

const DialogCatalogAppDetails = ({
  classes,
  onClose,
  open,
  details,
}) => (
  <Dialog
    className={classes.root}
    onClose={onClose}
    open={open}
  >
    <DialogContent className={classes.dialogContent}>
      {details ? (
        <>
          {details.err ? (
            <Typography variant="body2" className={classes.status}>
              Failed to Load App Information.
            </Typography>
          ) : (
            <AppCard
              id={details.id}
              name={details.name}
              url={details.url}
              icon={details.icon}
              icon128={details.icon128}
            />
          )}
        </>
      ) : (
        <Typography variant="body2" className={classes.status}>
          Loading...
        </Typography>
      )}
    </DialogContent>
  </Dialog>
);

DialogCatalogAppDetails.defaultProps = {
  details: null,
};

DialogCatalogAppDetails.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  details: PropTypes.object,
};

const mapStateToProps = (state) => ({
  open: state.dialogCatalogAppDetails.open,
  details: state.dialogCatalogAppDetails.details,
});

const actionCreators = {
  close,
};

export default connectComponent(
  DialogCatalogAppDetails,
  mapStateToProps,
  actionCreators,
  styles,
);
