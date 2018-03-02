import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';

import connectComponent from '../../helpers/connect-component';

import {
  close,
  formUpdate,
  save,
} from '../../state/dialogs/proxy-rules/actions';

import {
  STRING_CANCEL,
  STRING_LEARN_MORE,
  STRING_PROXIES,
  STRING_SAVE,
} from '../../constants/strings';

import { requestOpenInBrowser } from '../../senders/generic';

const styles = theme => ({
  content: {
    minWidth: 320,
  },
  link: {
    color: theme.palette.primary[500],
    marginLeft: 6,
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

const DialogProxyRules = (props) => {
  const {
    classes,
    content,
    onClose,
    onFormUpdate,
    onSave,
    open,
  } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {STRING_PROXIES}
      </DialogTitle>
      <DialogContent className={classes.content}>
        <Typography type="body1">
          <span>
            Ex: socks5://114.215.193.156:1080;sock4://45.33.18.235:16330.
          </span>
          <span
            className={classes.link}
            role="link"
            tabIndex="0"
            onClick={() => requestOpenInBrowser('https://github.com/electron/electron/blob/master/docs/api/session.md#sessetproxyconfig-callback')}
            onKeyDown={() => requestOpenInBrowser('https://github.com/electron/electron/blob/master/docs/api/session.md#sessetproxyconfig-callback')}
          >
            {STRING_LEARN_MORE}
          </span>.
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          multiline
          onChange={e => onFormUpdate({ content: e.target.value })}
          rows="10"
          value={content}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {STRING_CANCEL}
        </Button>
        <Button
          color="primary"
          onClick={onSave}
        >
          {STRING_SAVE}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DialogProxyRules.propTypes = {
  classes: PropTypes.object.isRequired,
  content: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onFormUpdate: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

DialogProxyRules.defaultProps = {
  content: '',
  open: false,
};

const mapStateToProps = state => ({
  content: state.dialogs.proxyRules.form.content,
  open: state.dialogs.proxyRules.open,
});

const actionCreators = {
  close,
  formUpdate,
  save,
};

export default connectComponent(
  DialogProxyRules,
  mapStateToProps,
  actionCreators,
  styles,
);
