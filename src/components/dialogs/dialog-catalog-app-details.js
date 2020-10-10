/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';

import extractHostname from '../../helpers/extract-hostname';
import connectComponent from '../../helpers/connect-component';

import { close } from '../../state/dialog-catalog-app-details/actions';

import {
  requestOpenInBrowser,
} from '../../senders';

import AppCard from '../shared/app-card';

const styles = (theme) => ({
  dialogContent: {
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  status: {
    textAlign: 'center',
  },
  appDesc: {
    width: '100%',
  },
  appDescSection: {
    paddingTop: theme.spacing(2),
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
            <>
              <AppCard
                id={details.id}
                name={details.name}
                url={details.url}
                icon={details.icon}
                iconThumbnail={details.icon256}
                inDetailsDialog
              />
              <div className={classes.appDesc}>
                <Typography variant="body2" className={classes.appDescSection}>
                  {details.description}
                </Typography>

                {details.url && (
                  <Typography variant="body2" className={classes.appDescSection}>
                    <span>Website: </span>
                    <Link
                      component="button"
                      variant="body2"
                      onClick={() => {
                        requestOpenInBrowser(details.url);
                      }}
                    >
                      {extractHostname(details.url)}
                    </Link>
                  </Typography>
                )}
              </div>
            </>
          )}
        </>
      ) : (
        <Typography variant="body2" className={classes.status}>
          Loading...
        </Typography>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>
        Close
      </Button>
    </DialogActions>
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
