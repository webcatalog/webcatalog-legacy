/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

import extractHostname from '../../helpers/extract-hostname';
import connectComponent from '../../helpers/connect-component';

import { close } from '../../state/dialog-catalog-app-details/actions';

import {
  requestOpenInBrowser,
} from '../../senders';

import AppCard from '../shared/app-card';

const styles = (theme) => ({
  dialogContent: {
    paddingBottom: theme.spacing(4),
  },
  status: {
    textAlign: 'center',
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  appDesc: {
    width: '100%',
  },
  appDescSection: {
    paddingTop: theme.spacing(2),
  },
  shareInput: {
    marginTop: theme.spacing(4),
  },
  appInfoName: {
    color: theme.palette.text.secondary,
  },
});

const DialogCatalogAppDetails = ({
  classes,
  onClose,
  open,
  details,
}) => {
  const shareUrl = details && !details.err ? `https://webcatalog.app/catalog/${details.id}` : '';

  return (
    <Dialog
      className={classes.root}
      onClose={onClose}
      open={open}
      fullWidth
    >
      <EnhancedDialogTitle onClose={onClose} />
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

                  <div className={classes.appDescSection}>
                    {details.url && (
                      <Typography variant="body2">
                        <span className={classes.appInfoName}>Website: </span>
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
                    <Typography variant="body2">
                      <span className={classes.appInfoName}>Category: </span>
                      {details.category}
                    </Typography>
                  </div>

                  <TextField
                    variant="filled"
                    label="Share this app"
                    value={shareUrl}
                    className={classes.shareInput}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <Button
                          color="primary"
                          size="large"
                          variant="contained"
                          disableElevation
                          onClick={() => {
                            window.remote.clipboard.writeText(shareUrl);
                          }}
                        >
                          Copy
                        </Button>
                      ),
                    }}
                  />
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
    </Dialog>
  );
};

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
