import React from 'react';
import PropTypes from 'prop-types';

import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SortIcon from '@material-ui/icons/Sort';

import connectComponent from '../../../helpers/connect-component';

import StatedMenu from '../../shared/stated-menu';

import { updateQuery } from '../../../state/installed/actions';
import { fetchLatestTemplateVersionAsync } from '../../../state/general/actions';

import {
  requestGetInstalledApps,
  requestSetPreference,
} from '../../../senders';


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

    this.inputBox.focus();
  }

  componentWillUnmount() {
    const { ipcRenderer } = window.require('electron');
    ipcRenderer.removeListener('focus-search', this.handleFocusSearch);
  }

  handleFocusSearch() {
    this.inputBox.focus();
    this.inputBox.select();
  }

  render() {
    const {
      classes,
      onUpdateQuery,
      query,
      onFetchLatestTemplateVersionAsync,
      fetchingLatestTemplateVersion,
      sortInstalledAppBy,
    } = this.props;

    const sortOptions = [
      { val: 'name', name: 'Sort by Name (A-Z)' },
      { val: 'name-desc', name: 'Sort by Name (Z-A)' },
      { val: 'last-updated', name: 'Sort by Last Updated' },
    ];

    const clearSearchAction = (
      <>
        <StatedMenu
          id="sort-options"
          buttonElement={(
            <IconButton size="small" aria-label="Sort by...">
              <SortIcon fontSize="small" />
            </IconButton>
          )}
        >
          {sortOptions.map((sortOption) => (
            <MenuItem
              key={sortOption.val}
              dense
              onClick={() => requestSetPreference('sortInstalledAppBy', sortOption.val)}
              selected={sortOption.val === sortInstalledAppBy}
            >
              {sortOption.name}
            </MenuItem>
          ))}
        </StatedMenu>
        <StatedMenu
          id="more-options"
          buttonElement={(
            <IconButton size="small" aria-label="More Options">
              <MoreVertIcon fontSize="small" />
            </IconButton>
          )}
        >
          <MenuItem
            dense
            disabled={fetchingLatestTemplateVersion}
            onClick={onFetchLatestTemplateVersionAsync}
          >
            {fetchingLatestTemplateVersion ? 'Checking for Updates...' : 'Check for Updates'}
          </MenuItem>
          <Divider />
          <MenuItem
            dense
            onClick={requestGetInstalledApps}
          >
            Rescan for Installed Apps
          </MenuItem>
        </StatedMenu>
        {query.length > 0 && (
          <IconButton
            color="default"
            size="small"
            aria-label="Clear"
            onClick={() => onUpdateQuery('')}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
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
              }}
              placeholder="Search installed apps..."
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
  fetchingLatestTemplateVersion: PropTypes.bool.isRequired,
  onFetchLatestTemplateVersionAsync: PropTypes.func.isRequired,
  onUpdateQuery: PropTypes.func.isRequired,
  query: PropTypes.string,
  sortInstalledAppBy: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  query: state.installed.query,
  fetchingLatestTemplateVersion: state.general.fetchingLatestTemplateVersion,
  sortInstalledAppBy: state.preferences.sortInstalledAppBy,
});

const actionCreators = {
  fetchLatestTemplateVersionAsync,
  updateQuery,
};

export default connectComponent(
  SearchBox,
  mapStateToProps,
  actionCreators,
  styles,
);
