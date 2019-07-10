import React from 'react';
import PropTypes from 'prop-types';
import isURL from 'is-url';
import isDomain from 'is-domain';

import Paper from 'material-ui/Paper';
import SearchIcon from 'material-ui-icons/Search';

import connectComponent from '../helpers/connect-component';

import {
  setFocused,
  updateQuery,
} from '../state/root/search-box/actions';

import {
  STRING_SEARCH_OR_ENTER_ADDRESS,
  STRING_SEARCH_FOR,
} from '../constants/strings';

const styles = theme => ({
  toolbarSearchContainer: {
    flex: 1,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
  toolbarSectionSearch: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 2,
    height: 32,
    margin: '0 auto',
    backgroundColor: theme.palette.primary[400],
  },
  searchBarText: {
    flex: 1,
    userSelect: 'none',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    transform: 'translateY(-1px)',
    fontWeight: 'normal',
    fontSize: 16,
  },
  input: {
    font: 'inherit',
    border: 0,
    display: 'block',
    verticalAlign: 'middle',
    whiteSpace: 'normal',
    background: 'none',
    margin: 0, // Reset for Safari
    color: theme.palette.common.lightWhite,
    width: '100%',
    '&:focus': {
      outline: 0,
    },
    '&::placeholder': {
      color: theme.palette.common.lightWhite,
    },
  },
  searchIcon: {
    paddingLeft: 12,
    paddingRight: 6,
    width: 20,
    height: 20,
    fill: theme.palette.common.lightWhite,
  },
  overlay: {
    position: 'absolute',
    top: 36,
    left: 0,
    height: 'calc(100vh - 36px)',
    width: '100vw',
    zIndex: 1000,
    backgroundColor: theme.palette.common.lightBlack,
    paddingLeft: 64 + (32 * 3) + theme.spacing.unit,
    paddingRight: theme.spacing.unit * 3,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
  },
  suggestion: {
    outline: 'none',
    borderBottom: '1px solid #eee',
    paddingLeft: theme.spacing.unit,
    paddingTop: theme.spacing.unit * 1.5,
    paddingBottom: theme.spacing.unit * 1.5,
    cursor: 'pointer',
  },
  overlayBottom: {
    outline: 'none',
    flex: 1,
  },
});

class EnhancedAppBar extends React.Component {
  render() {
    const {
      classes,
      focused,
      onLoadURL,
      onSetFocused,
      onUpdateQuery,
      query,
    } = this.props;

    const sendQuery = () => {
      if (isURL(query)) {
        onLoadURL(query);
      } else if (isDomain(query)) {
        onLoadURL(`http://${query}`);
      } else {
        onLoadURL(encodeURI(`https://duckduckgo.com/?q=${query}`));
      }

      this.inputBox.blur();
    };

    return (
      <React.Fragment>
        <div className={classes.toolbarSearchContainer}>
          <Paper
            className={classes.toolbarSectionSearch}
            elevation={1}
          >
            <SearchIcon
              className={classes.searchIcon}
            />
            <input
              name="query"
              className={classes.input}
              onChange={e => onUpdateQuery(e.target.value)}
              onInput={e => onUpdateQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query.length > 0) {
                  sendQuery();
                }
              }}
              onClick={() => this.inputBox.select()}
              onFocus={() => onSetFocused(true)}
              onBlur={() => onSetFocused(false)}
              placeholder={STRING_SEARCH_OR_ENTER_ADDRESS}
              ref={(inputBox) => { this.inputBox = inputBox; }}
              value={query}
            />
          </Paper>
        </div>
        {focused && query.length > 0 && (
          <div className={classes.overlay}>
            <div
              className={classes.suggestion}
              onMouseDown={sendQuery}
              role="button"
              tabIndex="0"
            >
              {STRING_SEARCH_FOR} <b>{query}</b>
            </div>
            <div
              className={classes.overlayBottom}
            />
          </div>
        )}
      </React.Fragment>
    );
  }
}

EnhancedAppBar.defaultProps = {
  query: '',
};

EnhancedAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  focused: PropTypes.bool.isRequired,
  onLoadURL: PropTypes.func.isRequired,
  onSetFocused: PropTypes.func.isRequired,
  onUpdateQuery: PropTypes.func.isRequired,
  query: PropTypes.string,
};

const mapStateToProps = state => ({
  query: state.searchBox.query,
  focused: state.searchBox.focused,
});

const actionCreators = {
  setFocused,
  updateQuery,
};

export default connectComponent(
  EnhancedAppBar,
  mapStateToProps,
  actionCreators,
  styles,
);
