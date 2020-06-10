import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import SearchIcon from '@material-ui/icons/Search';
import GetAppIcon from '@material-ui/icons/GetApp';

import { FixedSizeGrid } from 'react-window';

import connectComponent from '../../../helpers/connect-component';

import AppCard from '../../shared/app-card';
import EmptyState from '../../shared/empty-state';

import SearchBox from './search-box';
import Toolbar from './toolbar';

import { updateScrollOffset } from '../../../state/installed/actions';

const styles = (theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  scrollContainer: {
    flex: 1,
  },
  statusText: {
    marginRight: theme.spacing(1),
  },
  actionButton: {
    marginLeft: theme.spacing(1),
  },
  cardContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeringCircularProgress: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Installed = ({
  activeQuery,
  appIds,
  classes,
  onUpdateScrollOffset,
  scanning,
  scrollOffset,
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

  const renderContent = () => {
    if (scanning) {
      return (
        <div className={classes.centeringCircularProgress}>
          <CircularProgress size={28} />
        </div>
      );
    }

    if (appIds.length > 0) {
      const rowHeight = 150 + 16;
      const innerWidthMinurScrollbar = window.process.platform === 'win32' ? innerWidth - 20 : innerWidth;
      const columnCount = Math.floor(innerWidthMinurScrollbar / 176);
      const rowCount = Math.ceil(appIds.length / columnCount);
      const columnWidth = Math.floor(innerWidthMinurScrollbar / columnCount);
      const Cell = ({ columnIndex, rowIndex, style }) => {
        const index = rowIndex * columnCount + columnIndex;

        if (index >= appIds.length) return <div style={style} />;

        const appId = appIds[index];
        return (
          <div className={classes.cardContainer} style={style}>
            <AppCard
              key={appId}
              id={appId}
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
        <FixedSizeGrid
          columnCount={columnCount}
          columnWidth={columnWidth}
          height={innerHeight - (window.process.platform === 'win32' ? 116 : 138)} // titlebar: 22, searchbox: 40, toolbar: 36, bottom nav: 40
          rowCount={rowCount}
          rowHeight={rowHeight}
          width={innerWidth}
          initialScrollTop={scrollOffset}
          onScroll={(position) => {
            onUpdateScrollOffset(position.scrollTop || 0);
          }}
        >
          {Cell}
        </FixedSizeGrid>
      );
    }

    if (activeQuery) {
      return (
        <EmptyState
          icon={SearchIcon}
          title="No Matching Results"
        >
          <Typography
            variant="subtitle1"
            align="center"
          >
            Your search -&nbsp;
            <b>{activeQuery}</b>
            &nbsp;- did not match any installed apps.
          </Typography>
        </EmptyState>
      );
    }

    return (
      <EmptyState
        icon={GetAppIcon}
        title="No Installed Apps"
      >
        Your installed apps on this machine will show up here.
      </EmptyState>
    );
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <SearchBox />
        </Grid>
      </Grid>
      <div className={classes.scrollContainer}>
        <Toolbar />
        <Divider />
        {renderContent()}
      </div>
    </div>
  );
};

Installed.defaultProps = {
  activeQuery: '',
};

Installed.propTypes = {
  activeQuery: PropTypes.string,
  appIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  classes: PropTypes.object.isRequired,
  onUpdateScrollOffset: PropTypes.func.isRequired,
  scanning: PropTypes.bool.isRequired,
  scrollOffset: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  activeQuery: state.installed.activeQuery,
  appIds: state.installed.filteredSortedAppIds || state.appManagement.sortedAppIds,
  outdatedAppCount: 0,
  scanning: state.appManagement.scanning,
  scrollOffset: state.installed.scrollOffset,
});

const actionCreators = {
  updateScrollOffset,
};

export default connectComponent(
  Installed,
  mapStateToProps,
  actionCreators,
  styles,
);
