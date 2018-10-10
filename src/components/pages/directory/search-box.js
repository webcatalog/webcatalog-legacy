import React from 'react';
import PropTypes from 'prop-types';

import CloseIcon from '@material-ui/icons/Close';
import common from '@material-ui/core/colors/common';
import IconButton from '@material-ui/core/IconButton';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';

import connectComponent from '../../../helpers/connect-component';

import {
  resetThenGetHits,
  updateQuery,
} from '../../../state/pages/directory/actions';

import {
  STRING_CLEAR,
  STRING_SEARCH_APPS,
} from '../../../constants/strings';

const {
  fullBlack,
  fullWhite,
  lightBlack,
} = common;

const styles = theme => ({
  toolbarSearchContainer: {
    flex: 1,
    backgroundColor: fullWhite,
    zIndex: 10,
    position: 'relative',
    borderRadius: 0,
  },
  toolbarSectionSearch: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    height: 56,
    margin: '0 auto',
    backgroundColor: fullWhite,
  },
  searchBarText: {
    lineHeight: 1.5,
    padding: '0 4px',
    flex: 1,
    userSelect: 'none',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    transform: 'translateY(-1px)',
    fontWeight: 'normal',
    fontSize: 18,
  },
  input: {
    font: 'inherit',
    border: 0,
    display: 'block',
    verticalAlign: 'middle',
    whiteSpace: 'normal',
    background: 'none',
    margin: 0, // Reset for Safari
    color: fullBlack,
    width: '100%',
    '&:focus': {
      outline: 0,
    },
    '&::placeholder': {
      color: lightBlack,
    },
  },
  searchIcon: {
    paddingLeft: 12,
    paddingRight: 6,
    fill: lightBlack,
  },
  searchButton: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
});

class EnhancedAppBar extends React.Component {
  render() {
    const {
      classes,
      onResetThenGetHits,
      onUpdateQuery,
      query,
    } = this.props;

    const clearSearchAction = query.length > 0 &&
      (
        <React.Fragment>
          <IconButton
            color="default"
            aria-label={STRING_CLEAR}
            onClick={() => onUpdateQuery('')}
          >
            <CloseIcon />
          </IconButton>
          <IconButton
            color="default"
            aria-label={STRING_CLEAR}
            onClick={onResetThenGetHits}
          >
            <KeyboardReturnIcon />
          </IconButton>
        </React.Fragment>
      );

    return (
      <Paper elevation={1} className={classes.toolbarSearchContainer}>
        <div className={classes.toolbarSectionSearch}>
          <SearchIcon
            className={classes.searchIcon}
          />
          <Typography
            className={classes.searchBarText}
            color="inherit"
            variant="title"
          >
            <input
              className={classes.input}
              onChange={e => onUpdateQuery(e.target.value)}
              onInput={e => onUpdateQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query.length > 0) {
                  onResetThenGetHits();
                }
              }}
              placeholder={STRING_SEARCH_APPS}
              ref={(inputBox) => { this.inputBox = inputBox; }}
              value={query}
            />
          </Typography>
          {clearSearchAction}
        </div>
      </Paper>
    );
  }
}

EnhancedAppBar.defaultProps = {
  query: '',
};

EnhancedAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  onResetThenGetHits: PropTypes.func.isRequired,
  onUpdateQuery: PropTypes.func.isRequired,
  query: PropTypes.string,
};

const mapStateToProps = state => ({
  query: state.pages.directory.query,
});

const actionCreators = {
  resetThenGetHits,
  updateQuery,
};

export default connectComponent(
  EnhancedAppBar,
  mapStateToProps,
  actionCreators,
  styles,
);
