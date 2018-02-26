import React from 'react';
import PropTypes from 'prop-types';

import CloseIcon from 'material-ui-icons/Close';
import ExpandLessIcon from 'material-ui-icons/ExpandLess';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import SearchIcon from 'material-ui-icons/Search';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/Tooltip';
import Typography from 'material-ui/Typography';

import connectComponent from '../helpers/connect-component';

import { closeFindInPageDialog, updateFindInPageText } from '../state/root/find-in-page/actions';

import {
  STRING_ACTIVE_MATCH_OVER_MATCHES,
  STRING_FIND,
  STRING_PREVIOUS,
  STRING_NEXT,
  STRING_CLOSE,
} from '../constants/strings';

const styles = theme => ({
  root: {
    background: theme.palette.background.default,
    display: 'flex',
    alignItems: 'center',
    padding: '0 4px',
    zIndex: 1,
  },
  infoContainer: {
    flex: 1,
    padding: '0 12px',
  },
});

const FindInPage = (props) => {
  const {
    classes,
    activeMatch,
    matches,
    text,
    inputRef,
    onCloseFindInPageDialog,
    onRequestFind,
    onRequestStopFind,
    onUpdateFindInPageText,
  } = props;

  return (
    <Paper elevation={2} className={classes.root}>
      <div className={classes.infoContainer}>
        <Typography type="body1">
          <span
            dangerouslySetInnerHTML={{
              __html: STRING_ACTIVE_MATCH_OVER_MATCHES
                .replace('{activeMatch}', activeMatch)
                .replace('{matches}', matches),
            }}
          />
        </Typography>
      </div>
      <div>
        <TextField
          autoFocus
          inputRef={inputRef}
          placeholder={STRING_FIND}
          value={text}
          margin="dense"
          onChange={(e) => {
            const val = e.target.value;
            onUpdateFindInPageText(val);
            if (val.length > 0) {
              onRequestFind(val, true);
            } else {
              onRequestStopFind();
            }
          }}
          onInput={(e) => {
            const val = e.target.value;
            onUpdateFindInPageText(val);
            if (val.length > 0) {
              onRequestFind(val, true);
            } else {
              onRequestStopFind();
            }
          }}
          onKeyDown={(e) => {
            if ((e.keyCode || e.which) === 13) { // Enter
              const val = e.target.value;
              if (val.length > 0) {
                onRequestFind(val, true);
              }
            }
            if ((e.keyCode || e.which) === 27) { // Escape
              onRequestStopFind();
              onCloseFindInPageDialog();
            }
          }}
        />
      </div>
      <Tooltip
        title={STRING_PREVIOUS}
        placement="bottom"
      >
        <IconButton
          aria-label={STRING_PREVIOUS}
          onClick={() => {
            if (text.length > 0) {
              onRequestFind(text, false);
            }
          }}
        >
          <ExpandLessIcon />
        </IconButton>
      </Tooltip>
      <Tooltip
        title={STRING_NEXT}
        placement="bottom"
      >
        <IconButton
          aria-label={STRING_NEXT}
          onClick={() => {
            if (text.length > 0) {
              onRequestFind(text, true);
            }
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
      </Tooltip>
      <Tooltip
        title={STRING_FIND}
        placement="bottom"
      >
        <IconButton
          aria-label={STRING_FIND}
          onClick={() => {
            if (text.length > 0) {
              onRequestFind(text, true);
            }
          }}
        >
          <SearchIcon />
        </IconButton>
      </Tooltip>
      <Tooltip
        title={STRING_CLOSE}
        placement="bottom"
      >
        <IconButton
          aria-label={STRING_CLOSE}
          onClick={() => {
            onRequestStopFind();
            onCloseFindInPageDialog();
          }}
        >
          <CloseIcon />
        </IconButton>
      </Tooltip>
    </Paper>
  );
};

FindInPage.propTypes = {
  classes: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  activeMatch: PropTypes.number.isRequired,
  matches: PropTypes.number.isRequired,
  inputRef: PropTypes.func.isRequired,
  onCloseFindInPageDialog: PropTypes.func.isRequired,
  onRequestFind: PropTypes.func.isRequired,
  onRequestStopFind: PropTypes.func.isRequired,
  onUpdateFindInPageText: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  activeMatch: state.findInPage.activeMatch,
  matches: state.findInPage.matches,
  text: state.findInPage.text,
});

const actionCreators = {
  closeFindInPageDialog,
  updateFindInPageText,
};

export default connectComponent(
  FindInPage,
  mapStateToProps,
  actionCreators,
  styles,
);
