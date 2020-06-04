import React, { useEffect, useState, useMemo } from 'react';

import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import GetAppIcon from '@material-ui/icons/GetApp';

import { FixedSizeGrid } from 'react-window';

import connectComponent from '../../../helpers/connect-component';

import AppCard from '../../shared/app-card';
import EmptyState from '../../shared/empty-state';

import SearchBox from './search-box';


import { deselectAll, selectAppIds, deselectAppIds } from '../../../state/installed/actions';
import {
  updateAllApps,
  updateApps,
} from '../../../state/app-management/actions';
import {
  getOutdatedAppsAsList,
  filterApps,
  isInstalledApp,
  isOutdatedApp,
  isCancelableApp,
} from '../../../state/app-management/utils';

import {
  requestCancelInstallApp,
  requestCancelUpdateApp,
  requestUninstallApps,
} from '../../../senders';

import {
  INSTALLED,
  INSTALLING,
} from '../../../constants/app-statuses';

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
  updateAllFlexRight: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
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
  apps,
  classes,
  onDeselectAll,
  onDeselectAppIds,
  onSelectAppIds,
  onUpdateAllApps,
  onUpdateApps,
  outdatedAppCount,
  query,
  scanning,
  selectedAppIdObj,
  selectedCancelableApps,
  selectedUninstallableApps,
  selectedUpdatableApps,
  sortInstalledAppBy,
}) => {
  const appList = useMemo(() => {
    const lst = Object.values(apps);

    switch (sortInstalledAppBy) {
      case 'last-updated': {
        // https://stackoverflow.com/a/10124053/5522263
        lst.sort((x, y) => {
          const dateX = x.lastRequestedToUpdate || x.lastUpdated || 0;
          const dateY = y.lastRequestedToUpdate || y.lastUpdated || 0;
          return dateY - dateX;
        });
        break;
      }
      case 'name-desc': {
        lst.sort((x, y) => y.name.localeCompare(x.name));
        break;
      }
      case 'name':
      default: {
        lst.sort((x, y) => x.name.localeCompare(y.name));
      }
    }

    return lst;
  }, [apps, sortInstalledAppBy]);
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

    if (Object.keys(apps).length > 0) {
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
              selected={selectedAppIdObj[app.id] || false}
              onSelectedChange={(e) => {
                if (e.target.checked) {
                  onSelectAppIds([app.id]);
                } else {
                  onDeselectAppIds([app.id]);
                }
              }}
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

  // only selectable if the app is installed or queueing for updating/installing
  const selectedAppIds = Object.keys(selectedAppIdObj)
    .filter((id) => {
      if (selectedAppIdObj[id] === false) return false;
      const app = apps[id];
      return app && (app.status === INSTALLED || (app.status === INSTALLING && app.cancelable));
    });

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <SearchBox />
        </Grid>
      </Grid>
      <div className={classes.scrollContainer}>
        {appList.length > 0 && (
          <>
            {selectedAppIds.length > 0 ? (
              <div className={classes.updateAllFlexRoot}>
                <div className={classes.updateAllFlexLeft}>
                  <Tooltip title="Deselect all">
                    <IconButton
                      color="default"
                      size="small"
                      aria-label="Deselect all"
                      onClick={() => onDeselectAll()}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Typography variant="body2" color="textPrimary" className={classes.statusText}>
                    <span>{selectedAppIds.length}</span>
                    <span>&nbsp;Selected</span>
                  </Typography>
                  <Button
                    onClick={() => {
                      const appIds = appList.map((app) => app.id);
                      onSelectAppIds(appIds);
                    }}
                    size="small"
                  >
                    Select All
                  </Button>
                </div>
                <div className={classes.updateAllFlexRight}>
                  {selectedUpdatableApps.length > 0 && (
                    <Button
                      className={classes.actionButton}
                      onClick={() => {
                        onUpdateApps(selectedUpdatableApps);
                        onDeselectAll();
                      }}
                      size="small"
                    >
                      Update
                    </Button>
                  )}
                  {selectedCancelableApps.length > 0 && (
                    <Button
                      className={classes.actionButton}
                      onClick={() => {
                        onDeselectAll();
                        selectedCancelableApps.forEach((app) => {
                          if (app.version) return requestCancelUpdateApp(app.id);
                          return requestCancelInstallApp(app.id);
                        });
                      }}
                      size="small"
                    >
                      Cancel
                    </Button>
                  )}
                  {selectedUninstallableApps.length > 0 && (
                    <Button
                      className={classes.actionButton}
                      onClick={() => {
                        requestUninstallApps(selectedUninstallableApps);
                      }}
                      size="small"
                    >
                      Uninstall
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className={classes.updateAllFlexRoot}>
                <div className={classes.updateAllFlexLeft}>
                  <Button
                    onClick={() => {
                      const appIds = appList.map((app) => app.id);
                      onSelectAppIds(appIds);
                    }}
                    size="small"
                  >
                    Select All
                  </Button>
                </div>
                <div className={classes.updateAllFlexRight}>
                  {!query && (
                    <Typography variant="body2" color="textPrimary" className={classes.statusText}>
                      <span>{outdatedAppCount}</span>
                      <span>&nbsp;Pending Updates</span>
                    </Typography>
                  )}
                  {outdatedAppCount > 0 && !query && (
                    <Button
                      className={classes.actionButton}
                      onClick={onUpdateAllApps}
                      size="small"
                    >
                      Update All
                    </Button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
        <Divider />
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
  classes: PropTypes.object.isRequired,
  onDeselectAppIds: PropTypes.func.isRequired,
  onDeselectAll: PropTypes.func.isRequired,
  onSelectAppIds: PropTypes.func.isRequired,
  onUpdateAllApps: PropTypes.func.isRequired,
  onUpdateApps: PropTypes.func.isRequired,
  outdatedAppCount: PropTypes.number.isRequired,
  query: PropTypes.string,
  scanning: PropTypes.bool.isRequired,
  selectedAppIdObj: PropTypes.objectOf(PropTypes.bool).isRequired,
  selectedCancelableApps: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedUninstallableApps: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedUpdatableApps: PropTypes.arrayOf(PropTypes.object).isRequired,
  sortInstalledAppBy: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  const { selectedAppIdObj } = state.installed;
  const selectedUninstallableApps = [];
  const selectedCancelableApps = [];
  const selectedUpdatableApps = [];

  Object.keys(selectedAppIdObj).forEach((id) => {
    if (selectedAppIdObj[id] !== true) return;

    const app = state.appManagement.apps[id];
    if (!(app && (app.status === INSTALLED || (app.status === INSTALLING && app.cancelable)))) {
      return;
    }

    if (isInstalledApp(app.id, state)) {
      selectedUninstallableApps.push(app);
    }
    if (isCancelableApp(app.id, state)) {
      selectedCancelableApps.push(app);
    }
    if (isOutdatedApp(app.id, state)) {
      selectedUpdatableApps.push(app);
    }
  });

  return {
    apps: filterApps(state.appManagement.apps, state.installed.query),
    outdatedAppCount: getOutdatedAppsAsList(state).length,
    query: state.installed.query,
    scanning: state.appManagement.scanning,
    sortInstalledAppBy: state.preferences.sortInstalledAppBy,
    selectedAppIdObj,
    selectedCancelableApps,
    selectedUninstallableApps,
    selectedUpdatableApps,
  };
};

const actionCreators = {
  deselectAll,
  deselectAppIds,
  selectAppIds,
  updateAllApps,
  updateApps,
};

export default connectComponent(
  Installed,
  mapStateToProps,
  actionCreators,
  styles,
);
