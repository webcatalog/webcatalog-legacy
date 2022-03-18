/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';

import { updateQuery } from '../../../state/installed/actions';

const useStyles = makeStyles((theme) => ({
  toolbarSearchContainer: {
    zIndex: 10,
    position: 'relative',
    borderRadius: 6,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    flex: 1,
    WebkitAppRegion: 'no-drag',
    border: theme.palette.type === 'dark' ? 'none' : `${theme.palette.divider} 1px solid`,
  },
  toolbarSectionSearch: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    height: 28,
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
    color: 'inherit',
    width: '100%',
    '&:focus': {
      outline: 0,
      border: 0,
      boxShadow: 'none',
    },
    '&::placeholder': {
      color: theme.palette.text.disabled,
    },
  },
  searchIcon: {
    fill: theme.palette.text.disabled,
  },
  searchButton: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

const SearchBox = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const query = useSelector((state) => state.installed.query);

  const inputBoxRef = useRef();

  useEffect(() => {
    const handleFocusSearch = () => {
      if (inputBoxRef.current) {
        inputBoxRef.current.focus();
        inputBoxRef.current.select();
      }
    };
    window.ipcRenderer.on('focus-search', handleFocusSearch);
    if (inputBoxRef.current) {
      inputBoxRef.current.focus();
    }

    return () => {
      window.ipcRenderer.removeListener('focus-search', handleFocusSearch);
    };
  }, [inputBoxRef]);

  const clearSearchAction = (
    <>
      {query.length > 0 && (
        <Tooltip title="Clear search" placement="left">
          <IconButton
            color="inherit"
            size="small"
            aria-label="Clear"
            onClick={() => dispatch(updateQuery(''))}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </>
  );

  return (
    <Paper elevation={0} className={classes.toolbarSearchContainer}>
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
            onChange={(e) => dispatch(updateQuery(e.target.value))}
            onInput={(e) => dispatch(updateQuery(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.target.blur();
                dispatch(updateQuery(''));
              }
            }}
            placeholder="Search installed apps & spaces..."
            ref={inputBoxRef}
            value={query}
          />
        </Typography>
        {clearSearchAction}
      </div>
    </Paper>
  );
};

export default SearchBox;
