/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import connectComponent from '../../helpers/connect-component';

import { close } from '../../state/dialog-context-app-help/actions';

import { requestOpenInBrowser } from '../../senders';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

const styles = (theme) => ({
  icon: {
    height: 96,
    width: 96,
  },
  dialogContent: {
    minWidth: 320,
    paddingBottom: theme.spacing(2),
  },
  title: {
    marginTop: theme.spacing(1),
  },
  link: {
    fontWeight: 600,
    cursor: 'pointer',
    outline: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

const DialogContextAppHelp = ({
  classes,
  onClose,
  open,
}) => (
  <Dialog
    className={classes.root}
    onClose={onClose}
    open={open}
  >
    <EnhancedDialogTitle onClose={onClose}>
      What is Context App?
    </EnhancedDialogTitle>
    <DialogContent className={classes.dialogContent}>
      <Typography variant="body1">
        Context apps, such as Work, School, and Life, are special apps that are not tied to any specific web apps/websites. They let you run multiple web apps in a single well-organized window as independent workspaces which you can switch between easily using keyboard shortcuts. Each workspace is sandboxed, protecting you from cross-website trackers and preserving your privacy.
      </Typography>
      <br />
      <Typography variant="body1">
        <span>If you are familiar with </span>
        <span
          className={classes.link}
          onClick={() => requestOpenInBrowser('https://atomery.com/singlebox?utm_source=webcatalog_app')}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return;
            requestOpenInBrowser('https://atomery.com/singlebox?utm_source=webcatalog_app');
          }}
          role="link"
          tabIndex="0"
        >
          Singlebox
        </span>
        <span> app, another product from </span>
        <span
          className={classes.link}
          onClick={() => requestOpenInBrowser('https://atomery.com?utm_source=webcatalog_app')}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return;
            requestOpenInBrowser('https://atomery.com?utm_source=webcatalog_app');
          }}
          role="link"
          tabIndex="0"
        >
          Atomery
        </span>
        <span>, in fact, each context app works similarly to an independent Singlebox instance.</span>
      </Typography>
      <br />
      <Typography variant="body1">
        <b>Is it possible to create custom context apps?</b>
        <span>&nbsp;Yes, it is possible. When creating custom apps, just check the box &quot;Don&apos;t specify an URL&quot;.</span>
      </Typography>
      <br />
      <Typography variant="body2">
        Context apps always use Electron browser engine regardless of your preference.
      </Typography>
    </DialogContent>
  </Dialog>
);

DialogContextAppHelp.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  open: state.dialogContextAppHelp.open,
});

const actionCreators = {
  close,
};

export default connectComponent(
  DialogContextAppHelp,
  mapStateToProps,
  actionCreators,
  styles,
);
