import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
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

import { updateAllApps } from '../../../state/app-management/actions';
import { getCancelableAppsAsList, getOutdatedAppsAsList, filterApps } from '../../../state/app-management/utils';

import {
  requestCancelInstallApp,
  requestCancelUpdateApp,
} from '../../../senders';

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
  divider: {
  },
  updateAllFlexRoot: {
    display: 'flex',
    height: 36,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  updateAllFlexLeft: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  pendingUpdates: {
    paddingLeft: theme.spacing(1),
  },
  updateAllButton: {
    marginLeft: theme.spacing(1),
  },
  cardContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Installed = ({
  apps,
  cancelableAppsAsList,
  classes,
  onUpdateAllApps,
  outdatedAppCount,
  query,
  sortInstalledAppBy,
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
    if (Object.keys(apps).length > 0) {
      const appList = Object.values(apps);

      switch (sortInstalledAppBy) {
        case 'last-updated': {
          // https://stackoverflow.com/a/10124053/5522263
          appList.sort((x, y) => {
            const dateX = x.lastRequestedToUpdate || x.lastUpdated || 0;
            const dateY = y.lastRequestedToUpdate || y.lastUpdated || 0;
            return dateY - dateX;
          });
          break;
        }
        case 'name-desc': {
          appList.sort((x, y) => y.name.localeCompare(x.name));
          break;
        }
        case 'name':
        default: {
          appList.sort((x, y) => x.name.localeCompare(y.name));
        }
      }

      const rowHeight = 150 + 16;
      const columnCount = Math.floor(innerWidth / 176);
      const rowCount = Math.ceil(appList.length / columnCount);
      const columnWidth = Math.floor(innerWidth / columnCount);
      const Cell = ({ columnIndex, rowIndex, style }) => {
        const index = rowIndex * columnCount + columnIndex;

        if (index >= appList.length) return <div style={style} />;

        const app = appList[index];
        return (
          <div className={classes.cardContainer} style={style}>
            <AppCard
              key={app.id}
              id={app.id}
              name={app.name}
              url={app.url}
              icon={app.icon}
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
          height={innerHeight - 138} // titlebar: 22, searchbox: 40, toolbar: 36, bottom nav: 40
          rowCount={rowCount}
          rowHeight={rowHeight}
          width={innerWidth}
        >
          {Cell}
        </FixedSizeGrid>
      );
    }

    if (query) {
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
            <b>{query}</b>
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
        <div className={classes.updateAllFlexRoot}>
          <div className={classes.updateAllFlexLeft}>
            <Typography variant="body2" color="textPrimary" className={classes.pendingUpdates}>
              <span>{outdatedAppCount}</span>
              <span>&nbsp;Pending Updates</span>
            </Typography>
            <Button
              className={classes.updateAllButton}
              onClick={onUpdateAllApps}
              size="small"
              disabled={outdatedAppCount < 1}
            >
              Update All
            </Button>
            {cancelableAppsAsList.length > 0 && (
              <Button
                className={classes.updateAllButton}
                onClick={() => {
                  cancelableAppsAsList.forEach((app) => {
                    if (app.version) return requestCancelUpdateApp(app.id);
                    return requestCancelInstallApp(app.id);
                  });
                }}
                size="small"
              >
                Cancel All
              </Button>
            )}
          </div>
        </div>
        <Divider className={classes.divider} />
        {renderContent()}
      </div>
    </div>
  );
};

Installed.defaultProps = {
  query: null,
};

Installed.propTypes = {
  apps: PropTypes.object.isRequired,
  cancelableAppsAsList: PropTypes.arrayOf(PropTypes.object).isRequired,
  classes: PropTypes.object.isRequired,
  onUpdateAllApps: PropTypes.func.isRequired,
  outdatedAppCount: PropTypes.number.isRequired,
  query: PropTypes.string,
  sortInstalledAppBy: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  apps: filterApps(state.appManagement.apps, state.installed.query),
  cancelableAppsAsList: getCancelableAppsAsList(state),
  outdatedAppCount: getOutdatedAppsAsList(state).length,
  query: state.installed.query,
  sortInstalledAppBy: state.preferences.sortInstalledAppBy,
});

const actionCreators = {
  updateAllApps,
};

export default connectComponent(
  Installed,
  mapStateToProps,
  actionCreators,
  styles,
);
