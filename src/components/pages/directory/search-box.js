import React from 'react';
import PropTypes from 'prop-types';

import CloseIcon from 'material-ui-icons/Close';
import common from 'material-ui/colors/common';
import IconButton from 'material-ui/IconButton';
import KeyboardReturnIcon from 'material-ui-icons/KeyboardReturn';
import Paper from 'material-ui/Paper';
import SearchIcon from 'material-ui-icons/Search';
import Typography from 'material-ui/Typography';

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
  toolbarSectionContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  toolbarSection: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    flexBasis: '20%',
  },
  toolbarSectionRight: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row-reverse',
    flexBasis: '20%',
  },
  toolbarSearchContainer: {
    flex: 1,
  },
  toolbarSectionSearch: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 2,
    height: 40,
    maxWidth: 480,
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
      <div className={classes.toolbarSearchContainer}>
        <Paper
          className={classes.toolbarSectionSearch}
          elevation={1}
        >
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
        </Paper>
      </div>
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
