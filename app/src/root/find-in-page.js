import React from 'react';
import PropTypes from 'prop-types';

import CloseIcon from 'material-ui-icons/Close';
import ExpandLessIcon from 'material-ui-icons/ExpandLess';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui-icons/Search';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/Tooltip';
import Typography from 'material-ui/Typography';

import connectComponent from '../helpers/connect-component';

import { toggleFindInPageDialog, updateFindInPageText } from '../state/root/find-in-page/actions';

import {
  STRING_ACTIVE_MATCH_OVER_MATCHES,
  STRING_FIND,
  STRING_PREVIOUS,
  STRING_NEXT,
  STRING_CLOSE,
} from '../constants/strings';

const styles = {
  root: {
    display: 'flex',
    alignItems: 'center',
    padding: 4,
  },
  infoContainer: {
    flex: 1,
    padding: '0 12px',
  },
};

class FindInPage extends React.Component {
  render() {
    const {
      classes,
      activeMatch,
      matches,
      text,
      onRequestFind,
      onRequestStopFind,
      onToggleFindInPageDialog,
      onUpdateFindInPageText,
    } = this.props;

    return (
      <div className={classes.root}>
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
            ref={(input) => { this.input = input; }}
            placeholder={STRING_FIND}
            value={text}
            margin="normal"
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
              if ((e.keyCode || e.which) === 13) {
                const val = e.target.value;
                if (val.length > 0) {
                  onRequestFind(val, true);
                }
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
              onToggleFindInPageDialog();
            }}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </div>
    );
  }
}

FindInPage.propTypes = {
  classes: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  activeMatch: PropTypes.number.isRequired,
  matches: PropTypes.number.isRequired,
  onRequestFind: PropTypes.func.isRequired,
  onRequestStopFind: PropTypes.func.isRequired,
  onToggleFindInPageDialog: PropTypes.func.isRequired,
  onUpdateFindInPageText: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  activeMatch: state.findInPage.activeMatch,
  matches: state.findInPage.matches,
  text: state.findInPage.text,
});

const actionCreators = {
  toggleFindInPageDialog,
  updateFindInPageText,
};

export default connectComponent(
  FindInPage,
  mapStateToProps,
  actionCreators,
  styles,
);
