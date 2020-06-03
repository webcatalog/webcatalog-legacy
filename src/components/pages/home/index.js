/* eslint-disable no-constant-condition */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import SearchIcon from '@material-ui/icons/Search';

import InfiniteLoader from 'react-window-infinite-loader';
import { FixedSizeGrid } from 'react-window';

import connectComponent from '../../../helpers/connect-component';

import { requestOpenInBrowser } from '../../../senders';

import { getHits, updateScrollOffset } from '../../../state/home/actions';

import AppCard from '../../shared/app-card';
import NoConnection from '../../shared/no-connection';
import EmptyState from '../../shared/empty-state';
import CreateCustomAppCard from './create-custom-app-card';
import SubmitAppCard from './submit-app-card';

import SearchBox from './search-box';

import searchByAlgoliaLightSvg from '../../../assets/search-by-algolia-light.svg';
import searchByAlgoliaDarkSvg from '../../../assets/search-by-algolia-dark.svg';


const styles = (theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  rootHidden: {
    display: 'none',
  },
  scrollContainer: {
    flex: 1,
    position: 'relative',
  },
  grid: {
    marginBottom: theme.spacing(1),
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
});

const Home = ({
  classes,
  currentQuery,
  hasFailed,
  hidden,
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

  const renderContent = () => {
    if (hasFailed) {
      return (
        <NoConnection
          onTryAgainButtonClick={onGetHits}
        />
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
            <CreateCustomAppCard />
            <SubmitAppCard />
          </Grid>
        </EmptyState>
      );
    }

    const hasNextPage = page + 1 < totalPage;
    const itemCount = hits.length + 3;
    // Every row is loaded except for our loading indicator row.
    const isItemLoaded = (index) => !hasNextPage || index < hits.length;
    const rowHeight = 150 + 16;
    const columnCount = Math.floor(innerWidth / 176);
    const rowCount = Math.ceil(itemCount / columnCount);
    const columnWidth = Math.floor(innerWidth / columnCount);
    const Cell = ({ columnIndex, rowIndex, style }) => {
      const index = rowIndex * columnCount + columnIndex;

      if (index === 0) {
        return (
          <div className={classes.cardContainer} style={style}>
            <CreateCustomAppCard key="create-custom-app" />
          </div>
        );
      }

      if (index === hits.length + 1) {
        if (isGetting) {
          return (
            <div className={classes.cardContainer} style={style}>
              <CircularProgress size={28} />
            </div>
          );
        }

        if (hits.length > 0) {
          return (
            <div className={classes.cardContainer} style={style}>
              <SubmitAppCard key="submit-new-app" />
            </div>
          );
        }
      }

      if (index === hits.length + 2 && hits.length > 0 && !isGetting) {
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

      const hitIndex = index - 1;
      if (hitIndex >= hits.length) return <div style={style} />;

      const app = hits[hitIndex];
      return (
        <div className={classes.cardContainer} style={style}>
          <AppCard
            key={app.id}
            id={app.id}
            name={app.name}
            url={app.url}
            icon={app.icon}
            icon128={app.icon128}
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
        loadMoreItems={onGetHits}
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
              height={innerHeight - 102} // titlebar: 22, searchbox: 40, bottom nav: 40
              rowCount={rowCount}
              rowHeight={rowHeight}
              width={innerWidth}
              initialScrollOffset={scrollOffset}
              onItemsRendered={newItemsRendered}
              onScroll={(position) => {
                onUpdateScrollOffset(position.scrollOffset || 0);
              }}
              ref={ref}
            >
              {Cell}
            </FixedSizeGrid>
          );
        }}
      </InfiniteLoader>
    );
  };

  return (
    <div className={classNames(classes.root, hidden && classes.rootHidden)}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <SearchBox />
        </Grid>
      </Grid>
      <div
        className={classes.scrollContainer}
      >
        {renderContent()}
      </div>
    </div>
  );
};

Home.defaultProps = {
  currentQuery: '',
  hidden: false,
};

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  currentQuery: PropTypes.string,
  hasFailed: PropTypes.bool.isRequired,
  hidden: PropTypes.bool,
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
