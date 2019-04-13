import React from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

import connectComponent from '../../helpers/connect-component';

const styles = theme => ({
  dialogContentText: {
    marginTop: theme.spacing.unit * 2,
  },
  dialogActions: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit,
  },
});

const DialogMovingAllApps = (props) => {
  const { open } = props;

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      onClose={null}
      open={open}
    >
      <DialogContent>
        <Typography align="center" variant="h6">
          Moving Apps to New Location...
        </Typography>

        <Typography align="center" variant="body1">
          Do not quit the app. If this process fails, you&apos;ll need to move the apps manually.
        </Typography>

        <br />

        <LinearProgress color="secondary" />
      </DialogContent>
    </Dialog>
  );
};

DialogMovingAllApps.propTypes = {
  open: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  open: state.general.movingAllApps,
});

export default connectComponent(
  DialogMovingAllApps,
  mapStateToProps,
  null,
  styles,
);
