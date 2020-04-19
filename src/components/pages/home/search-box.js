import React from 'react';
import PropTypes from 'prop-types';

import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';

import connectComponent from '../../../helpers/connect-component';

import {
  resetThenGetHits,
  updateQuery,
} from '../../../state/home/actions';

const styles = (theme) => ({
  toolbarSearchContainer: {
    flex: 1,
    zIndex: 10,
    position: 'relative',
    borderRadius: 0,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  toolbarSectionSearch: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    height: 40,
    margin: '0 auto',
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
  },
  input: {
    font: 'inherit',
    border: 0,
    display: 'block',
    verticalAlign: 'middle',
    whiteSpace: 'normal',
    background: 'none',
    margin: 0,
    color: theme.palette.text.primary,
    width: '100%',
    '&:focus': {
      outline: 0,
    },
    '&::placeholder': {
      color: theme.palette.text.secondary,
    },
  },
  searchIcon: {
    paddingRight: 6,
    fill: theme.palette.text.primary,
    WebkitAppRegion: 'drag',
    WebkitUserSelect: 'none',
  },
  searchButton: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
});

class SearchBox extends React.Component {
  constructor(props) {
    super(props);

    this.handleFocusSearch = this.handleFocusSearch.bind(this);
  }

  componentDidMount() {
    const { ipcRenderer } = window.require('electron');
    ipcRenderer.on('focus-search', this.handleFocusSearch);
  }

  componentWillUnmount() {
    const { ipcRenderer } = window.require('electron');
    ipcRenderer.removeListener('focus-search', this.handleFocusSearch);
  }

  handleFocusSearch() {
    this.inputBox.focus();
  }

  render() {
    const {
      classes,
      onResetThenGetHits,
      onUpdateQuery,
      query,
    } = this.props;

    const clearSearchAction = query.length > 0 && (
      <>
        <IconButton
          color="default"
          size="small"
          aria-label="Clear"
          onClick={() => onUpdateQuery('')}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        <IconButton
          color="default"
          size="small"
          aria-label="Search"
          onClick={onResetThenGetHits}
        >
          <KeyboardReturnIcon fontSize="small" />
        </IconButton>
      </>
    );

    return (
      <Paper elevation={1} className={classes.toolbarSearchContainer}>
        <div className={classes.toolbarSectionSearch}>
          <SearchIcon
            className={classes.searchIcon}
            fontSize="small"
          />
          <Typography
            className={classes.searchBarText}
            color="inherit"
            variant="subtitle1"
          >
            <input
              className={classes.input}
              onChange={(e) => onUpdateQuery(e.target.value)}
              onInput={(e) => onUpdateQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.target.blur();
                  onUpdateQuery('');
                }
                if (e.key === 'Enter' && query.length > 0) {
                  onResetThenGetHits();
                }
              }}
              placeholder="Search apps..."
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

SearchBox.defaultProps = {
  query: '',
};

SearchBox.propTypes = {
  classes: PropTypes.object.isRequired,
  onResetThenGetHits: PropTypes.func.isRequired,
  onUpdateQuery: PropTypes.func.isRequired,
  query: PropTypes.string,
};

const mapStateToProps = (state) => ({
  query: state.home.query,
});

const actionCreators = {
  resetThenGetHits,
  updateQuery,
};

export default connectComponent(
  SearchBox,
  mapStateToProps,
  actionCreators,
  styles,
);
