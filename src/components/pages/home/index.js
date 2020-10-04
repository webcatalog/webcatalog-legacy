/* eslint-disable no-constant-condition */
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import AppSearchAPIConnector from '@elastic/search-ui-app-search-connector';
import { SearchProvider, WithSearch, Paging } from '@elastic/react-search-ui';
import '@elastic/react-search-ui-views/lib/styles/styles.css';

import Grid from '@material-ui/core/Grid';

import connectComponent from '../../../helpers/connect-component';

import { getHits, updateScrollOffset } from '../../../state/home/actions';

import AppCard from '../../shared/app-card';

import DefinedAppBar from './defined-app-bar';

const connector = new AppSearchAPIConnector({
  searchKey: process.env.REACT_APP_SWIFTYPE_SEARCH_KEY,
  engineName: process.env.REACT_APP_SWIFTYPE_ENGINE_NAME,
  hostIdentifier: process.env.REACT_APP_SWIFTYPE_HOST_ID,
});

const styles = (theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  scrollContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'auto',
    padding: theme.spacing(1),
  },
});

const Home = ({
  classes,
  onUpdateScrollOffset,
}) => {
  const gridRef = useRef(null);

  useEffect(() => () => {
    if (gridRef.current) {
      onUpdateScrollOffset(gridRef.current.scrollTop);
    }
  }, [gridRef, onUpdateScrollOffset]);

  return (
    <SearchProvider
      config={{
        apiConnector: connector,
        initialState: { resultsPerPage: 56 },
        alwaysSearchOnInitialLoad: true,
      }}
    >
      <div className={classes.root}>
        <DefinedAppBar />
        <div className={classes.scrollContainer}>
          <Grid container spacing={1} justify="space-evenly">
            <WithSearch
              mapContextToProps={({ results }) => ({ results })}
            >
              {({ results }) => (
                <>
                  {results.map((app) => (
                    <AppCard
                      key={app.id.raw}
                      id={app.id.raw}
                      name={app.name.raw}
                      url={app.url.raw}
                      icon={window.process.platform === 'win32' // use unplated icon for Windows
                        ? app.icon_unplated.raw : app.icon.raw}
                      icon128={window.process.platform === 'win32' // use unplated icon for Windows
                        ? app.icon_unplated_128.raw : app.icon_128.raw}
                    />
                  ))}
                </>
              )}
            </WithSearch>
            <Grid item xs={12} container justify="center">
              <Paging />
            </Grid>
          </Grid>
        </div>
      </div>
    </SearchProvider>
  );
};

Home.defaultProps = {};

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  onUpdateScrollOffset: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  // scrollOffset: state.home.scrollOffset,
});

const actionCreators = {
  getHits,
  updateScrollOffset,
};

export default connectComponent(
  Home,
  mapStateToProps,
  actionCreators,
  styles,
);
