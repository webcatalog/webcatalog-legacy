import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import Slide from 'material-ui/transitions/Slide';
import Typography from 'material-ui/Typography';
import Dialog, { DialogContent } from 'material-ui/Dialog';

import connectComponent from '../../helpers/connect-component';

import { close } from '../../state/dialogs/about/actions';

import {
  STRING_ABOUT,
  STRING_WEBSITE,
} from '../../constants/strings';

import { requestOpenInBrowser } from '../../senders/generic';

import EnhancedDialogTitle from '../../shared/enhanced-dialog-title';

const styles = theme => ({
  icon: {
    height: 128,
    width: 128,
  },
  dialogContent: {
    minWidth: 320,
    textAlign: 'center',
  },
  title: {
    marginTop: 16,
  },
  version: {
    marginBottom: 16,
  },
  versionSmallContainer: {
    marginBottom: 24,
  },
  versionSmall: {
    fontSize: 13,
  },
  updaterStatus: {
    marginTop: 32,
    marginBottom: 12,
  },
  divider: {
    marginTop: 16,
    marginBottom: 16,
  },
  madeBy: {
    marginTop: theme.spacing.unit * 2,
  },
  link: {
    fontWeight: 600,
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

const Transition = props => <Slide direction="left" {...props} />;

const About = (props) => {
  const {
    classes,
    onClose,
    open,
  } = props;

  return (
    <Dialog
      className={classes.root}
      onClose={onClose}
      open={open}
      transition={Transition}
    >
      <EnhancedDialogTitle onCloseButtonClick={onClose}>
        {STRING_ABOUT}
      </EnhancedDialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Typography type="title" className={classes.title}>{window.shellInfo.name}</Typography>
        <Typography type="body1" className={classes.version}>
          powered by Appifier
        </Typography>

        <div className={classes.versionSmallContainer}>
          <Typography type="body1" className={classes.versionSmall}>
            <strong>appifier:</strong> {window.version}
          </Typography>
          <Typography type="body1" className={classes.versionSmall}>
            <strong>electron:</strong> {window.versions.electron}
          </Typography>
          <Typography type="body1" className={classes.versionSmall}>
            <strong>chrome:</strong> {window.versions.chrome}
          </Typography>
          <Typography type="body1" className={classes.versionSmall}>
            <strong>v8:</strong> {window.versions.v8}
          </Typography>
          <Typography type="body1" className={classes.versionSmall}>
            <strong>node:</strong> {window.versions.node}
          </Typography>
        </div>

        <Button
          onClick={() => requestOpenInBrowser('https://github.com/quanglam2807/appifier')}
        >
          {STRING_WEBSITE}
        </Button>

        <Typography type="body1" className={classes.madeBy}>
          <span>Made with </span>
          <span role="img" aria-label="love">❤️</span>
          <span> by </span>
          <span
            onClick={() => requestOpenInBrowser('https://quang.im')}
            onKeyDown={() => requestOpenInBrowser('https://quang.im')}
            role="link"
            tabIndex="0"
            className={classes.link}
          >
            Quang Lam
          </span>
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

About.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  open: state.dialogs.about.open,
});

const actionCreators = {
  close,
};

export default connectComponent(
  About,
  mapStateToProps,
  actionCreators,
  styles,
);
