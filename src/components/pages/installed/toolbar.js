import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import connectComponent from '../../../helpers/connect-component';

import { getOutdatedAppsAsList } from '../../../state/app-management/utils';
import { updateAllApps } from '../../../state/app-management/actions';

const styles = (theme) => ({
  root: {
    display: 'flex',
    height: 36,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  left: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  statusText: {
    marginRight: theme.spacing(1),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  actionButton: {
    marginLeft: theme.spacing(1),
  },
});

const Toolbar = ({
  activeQuery,
  classes,
  onUpdateAllApps,
  outdatedAppCount,
}) => (
  <div className={classes.root}>
    <div className={classes.left}>
      {activeQuery.length > 0 ? (
        <Typography variant="body2" color="textPrimary" className={classes.statusText}>
          Search results for
          &quot;
          {activeQuery}
          &quot;
        </Typography>
      ) : (
        <>
          <Typography variant="body2" color="textPrimary" className={classes.statusText}>
            <span>{outdatedAppCount}</span>
            <span>&nbsp;Pending Updates</span>
          </Typography>
          <Button
            onClick={onUpdateAllApps}
            size="small"
            disabled={outdatedAppCount < 1}
          >
            Update All
          </Button>
        </>
      )}
    </div>
  </div>
);

Toolbar.defaultProps = {
  activeQuery: '',
};

Toolbar.propTypes = {
  activeQuery: PropTypes.string,
  classes: PropTypes.object.isRequired,
  onUpdateAllApps: PropTypes.func.isRequired,
  outdatedAppCount: PropTypes.number.isRequired,
};

const actionCreators = {
  updateAllApps,
};

const mapStateToProps = (state) => ({
  activeQuery: state.installed.activeQuery,
  outdatedAppCount: getOutdatedAppsAsList(state).length,
});

export default connectComponent(
  Toolbar,
  mapStateToProps,
  actionCreators,
  styles,
);
