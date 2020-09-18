/* eslint-disable no-constant-condition */
import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import SearchIcon from '@material-ui/icons/Search';

import InfiniteLoader from 'react-window-infinite-loader';
import { FixedSizeGrid } from 'react-window';

import connectComponent from '../../../helpers/connect-component';

import { requestOpenInBrowser } from '../../../senders';

import { getHits, updateScrollOffset } from '../../../state/home/actions';

import AppCard from '../../shared/app-card';
import NoConnection from '../../shared/no-connection';
import EmptyState from '../../shared/empty-state';

import SearchBox from './search-box';
import Toolbar from './toolbar';
import SubmitAppCard from './submit-app-card';

import searchByAlgoliaLightSvg from '../../../assets/search-by-algolia-light.svg';
import searchByAlgoliaDarkSvg from '../../../assets/search-by-algolia-dark.svg';

import CONTEXT_APPS from '../../../constants/context-apps';

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
  },
  searchByAlgoliaContainer: {
    outline: 'none',
  },
  searchByAlgolia: {
    height: 20,
    cursor: 'pointer',
  },
  noMatchingResultOpts: {
    marginTop: theme.spacing(4),
  },
  cardContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noConnectionContainer: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2),
  },
  centeringCircularProgress: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fixedSizeGrid: {
    overflowX: 'hidden !important',
  },
});

const Home = ({
  classes,
  currentQuery,
  hasFailed,
  hits,
  initiated,
  isGetting,
  onGetHits,
  onUpdateScrollOffset,
  page,
  scrollOffset,
  shouldUseDarkColors,
  totalPage,
}) => {
  const [innerHeight, updateInnerHeight] = useState(window.innerHeight);
  const [innerWidth, updateInnerWidth] = useState(window.innerWidth);
  const gridRef = useRef(null);

  useEffect(() => {
    const updateWindowSize = () => {
      updateInnerHeight(window.innerHeight);
      updateInnerWidth(window.innerWidth);
    };
    window.addEventListener('resize', updateWindowSize);
    return () => {
      window.removeEventListener('resize', updateWindowSize);
    };
  }, []);

  useEffect(() => {
    if (!initiated) {
      onGetHits();
    }
  }, [initiated, onGetHits]);

  useEffect(() => () => {
    if (gridRef.current) {
      onUpdateScrollOffset(gridRef.current.scrollTop);
    }
  }, [gridRef, onUpdateScrollOffset]);

  const renderContent = () => {
    if (hasFailed) {
      return (
        <div className={classes.noConnectionContainer}>
          <NoConnection
            onTryAgainButtonClick={onGetHits}
          />
        </div>
      );
    }

    if (isGetting && hits.length < 1) {
      return (
        <div className={classes.centeringCircularProgress}>
          <CircularProgress size={28} />
        </div>
      );
    }

    if (!isGetting && currentQuery.length > 0 && hits.length < 1) {
      return (
        <EmptyState icon={SearchIcon} title="No Matching Results">
          <Typography
            variant="subtitle1"
            align="center"
          >
            Your search -&nbsp;
            <b>{currentQuery}</b>
            &nbsp;- did not match any apps in the catalog.
          </Typography>
          <Grid container justify="center" spacing={1} className={classes.noMatchingResultOpts}>
            <SubmitAppCard />
          </Grid>
        </EmptyState>
      );
    }

    const hasNextPage = page + 1 < totalPage;
    // 3 additional special items (Work, School, Life) when not searching
    const additionalItemCount = currentQuery.length === 0 ? CONTEXT_APPS.length : 0;
    const itemCount = hits.length + additionalItemCount + 2;
    // Every row is loaded except for our loading indicator row.
    const isItemLoaded = (index) => !hasNextPage || index < hits.length;
    const rowHeight = 158 + 16;
    const innerWidthMinurScrollbar = window.process.platform === 'darwin' ? innerWidth : innerWidth - 20;
    const columnCount = Math.floor(innerWidthMinurScrollbar / 184); // leave 30px for scrollbar
    const rowCount = Math.ceil(itemCount / columnCount);
    const columnWidth = Math.floor(innerWidthMinurScrollbar / columnCount);
    // total window height - (titlebar: 22, searchbox: 40, toolbar: 36, bottom nav: 40)
    const scrollHeight = innerHeight - 116 - (window.process.platform === 'darwin' && window.mode !== 'menubar' ? 22 : 0);
    const Cell = ({ columnIndex, rowIndex, style }) => {
      const index = rowIndex * columnCount + columnIndex - additionalItemCount;

      if (index < 0) {
        const contextAppIndex = index + additionalItemCount;
        const contextApp = CONTEXT_APPS[contextAppIndex];
        return (
          <div className={classes.cardContainer} style={style}>
            <AppCard
              key={contextApp.id}
              id={contextApp.id}
              name={contextApp.name}
              url={null}
              icon={window.process.platform === 'win32' // use unplated icon for Windows
                ? `https://storage.atomery.com/webcatalog/catalog/${contextApp.id}/${contextApp.id}-icon-unplated.png`
                : `https://storage.atomery.com/webcatalog/catalog/${contextApp.id}/${contextApp.id}-icon.png`}
              icon128={window.process.platform === 'win32' // use unplated icon for Windows
                ? `https://storage.atomery.com/webcatalog/catalog/${contextApp.id}/${contextApp.id}-icon-unplated-128.webp`
                : `https://storage.atomery.com/webcatalog/catalog/${contextApp.id}/${contextApp.id}-icon-128.webp`}
            />
          </div>
        );
      }

      if (index === hits.length) {
        if (isGetting) {
          return (
            <div className={classes.cardContainer} style={style}>
              <CircularProgress size={28} />
            </div>
          );
        }

        return (
          <div className={classes.cardContainer} style={style}>
            <SubmitAppCard />
          </div>
        );
      }

      if (index === hits.length + 1) {
        if (isGetting) {
          return <div style={style} />;
        }
        return (
          <div className={classes.cardContainer} style={style}>
            <div
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return;
                requestOpenInBrowser('https://algolia.com');
              }}
              onClick={() => requestOpenInBrowser('https://algolia.com')}
              role="link"
              tabIndex="0"
              className={classes.searchByAlgoliaContainer}
            >
              <img
                src={shouldUseDarkColors ? searchByAlgoliaDarkSvg : searchByAlgoliaLightSvg}
                alt="Search by Algolia"
                className={classes.searchByAlgolia}
              />
            </div>
          </div>
        );
      }

      if (index >= hits.length) return <div style={style} />;

      const app = hits[index];
      return (
        <div className={classes.cardContainer} style={style}>
          <AppCard
            key={app.id}
            id={app.id}
            name={app.name}
            url={app.url}
            icon={window.process.platform === 'win32' // use unplated icon for Windows
              ? app.iconUnplated : app.icon}
            icon128={window.process.platform === 'win32' // use unplated icon for Windows
              ? app.iconUnplated128 : app.icon128}
          />
        </div>
      );
    };
    Cell.propTypes = {
      columnIndex: PropTypes.number.isRequired,
      rowIndex: PropTypes.number.isRequired,
      style: PropTypes.object.isRequired,
    };

    return (
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={itemCount}
        loadMoreItems={() => onGetHits()}
      >
        {({ onItemsRendered, ref }) => {
          // https://stackoverflow.com/questions/57370902/react-window-fixedsizegrid-with-react-window-infinite-loader
          const newItemsRendered = (gridData) => {
            const useOverscanForLoading = true;
            const {
              visibleRowStartIndex,
              visibleRowStopIndex,
              visibleColumnStopIndex,
              overscanRowStartIndex,
              overscanRowStopIndex,
              overscanColumnStopIndex,
            } = gridData;

            const endCol = (useOverscanForLoading || true
              ? overscanColumnStopIndex
              : visibleColumnStopIndex) + 1;

            const startRow = useOverscanForLoading || true
              ? overscanRowStartIndex
              : visibleRowStartIndex;
            const endRow = useOverscanForLoading || true
              ? overscanRowStopIndex
              : visibleRowStopIndex;

            const visibleStartIndex = startRow * endCol;
            const visibleStopIndex = endRow * endCol;

            onItemsRendered({
              // call onItemsRendered from InfiniteLoader so it can load more if needed
              visibleStartIndex,
              visibleStopIndex,
            });
          };

          return (
            <FixedSizeGrid
              columnCount={columnCount}
              columnWidth={columnWidth}
              height={scrollHeight}
              rowCount={rowCount}
              rowHeight={rowHeight}
              width={innerWidth}
              initialScrollTop={scrollOffset}
              onItemsRendered={newItemsRendered}
              ref={ref}
              outerRef={gridRef}
              className={classes.fixedSizeGrid}
            >
              {Cell}
            </FixedSizeGrid>
          );
        }}
      </InfiniteLoader>
    );
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <SearchBox />
        </Grid>
      </Grid>
      <div
        className={classes.scrollContainer}
      >
        <Toolbar />
        <Divider />
        {renderContent()}
      </div>
    </div>
  );
};

Home.defaultProps = {
  currentQuery: '',
};

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  currentQuery: PropTypes.string,
  hasFailed: PropTypes.bool.isRequired,
  hits: PropTypes.arrayOf(PropTypes.object).isRequired,
  initiated: PropTypes.bool.isRequired,
  isGetting: PropTypes.bool.isRequired,
  onGetHits: PropTypes.func.isRequired,
  onUpdateScrollOffset: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  scrollOffset: PropTypes.number.isRequired,
  shouldUseDarkColors: PropTypes.bool.isRequired,
  totalPage: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  currentQuery: state.home.currentQuery,
  hasFailed: state.home.hasFailed,
  hits: state.home.hits,
  initiated: state.home.initiated,
  isGetting: state.home.isGetting,
  page: state.home.page,
  scrollOffset: state.home.scrollOffset,
  shouldUseDarkColors: state.general.shouldUseDarkColors,
  totalPage: state.home.totalPage,
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
