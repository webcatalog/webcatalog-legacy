import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import HomeIcon from 'material-ui-icons/Home';
import IconButton from 'material-ui/IconButton';
import KeyboardArrowLeftIcon from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from 'material-ui-icons/KeyboardArrowRight';
import Paper from 'material-ui/Paper';
import RefreshIcon from 'material-ui-icons/Refresh';
import SettingsIcon from 'material-ui-icons/Settings';
import Tooltip from 'material-ui/Tooltip';

import connectComponent from '../helpers/connect-component';

import { open as openDialogPreferences } from '../state/dialogs/preferences/actions';

import {
  STRING_BACK,
  STRING_FORWARD,
  STRING_HOME,
  STRING_PREFERENCES,
  STRING_RELOAD,
} from '../constants/strings';

const styles = theme => ({
  container: {
    zIndex: 2,
    borderRadius: 0,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: 68,
    padding: theme.spacing.unit,
    paddingTop: 18,
    boxSizing: 'border-box',
    WebkitAppRegion: 'drag',
    WebkitUserSelect: 'none',
  },
  containerWithoutTitlebar: {
    paddingTop: 28,
  },
  containerVert: {
    width: '100%',
    height: 'auto',
    flexDirection: 'row',
    padding: '0 4px',
  },
  containerVertWithoutTitleBar: {
    paddingLeft: 68,
  },
  innerContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
  },
  innerContainerVert: {
    flexDirection: 'row',
    alignItems: 'initial',
  },
  innerContainerEnd: {
    flex: '0 0 auto',
  },
  innerContainerEndVert: {
    flex: '0 0 auto',
    alignItems: 'flex-end',
  },
  iconButtonRoot: {
    height: 24,
    width: 24,
    margin: '20px auto 0 auto',
  },
  iconButtonIcon: {
    height: 32,
    width: 32,
  },
  hiddenMenuItem: {
    display: 'none',
  },
  menuItem: {
    cursor: 'pointer',
  },
  badge: {
    marginLeft: 12,
  },
});

const NavigationBar = (props) => {
  const {
    canGoBack,
    canGoForward,
    classes,
    navigationBarPosition,
    onBackButtonClick,
    onForwardButtonClick,
    onHomeButtonClick,
    onOpenDialogPreferences,
    onRefreshButtonClick,
    showTitleBar,
  } = props;

  const vert = navigationBarPosition === 'top';

  let tooltipPlacement;
  switch (navigationBarPosition) {
    case 'left':
      tooltipPlacement = 'right';
      break;
    case 'right':
      tooltipPlacement = 'left';
      break;
    default:
      tooltipPlacement = 'bottom';
  }

  return (
    <Paper
      elevation={2}
      className={classnames(
        classes.container,
        vert && classes.containerVert,
        window.platform === 'darwin' && !showTitleBar && classes.containerWithoutTitlebar,
        vert && window.platform === 'darwin' && !showTitleBar && classes.containerVertWithoutTitleBar,
      )}
    >
      <div className={classnames(classes.innerContainer, vert && classes.innerContainerVert)}>
        <Tooltip
          title={STRING_HOME}
          placement={tooltipPlacement}
        >
          <IconButton
            aria-label={STRING_HOME}
            onClick={onHomeButtonClick}
          >
            <HomeIcon />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={STRING_BACK}
          placement={tooltipPlacement}
        >
          <IconButton
            aria-label={STRING_BACK}
            disabled={!canGoBack}
            onClick={onBackButtonClick}
          >
            <KeyboardArrowLeftIcon />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={STRING_FORWARD}
          placement={tooltipPlacement}
        >
          <IconButton
            aria-label={STRING_FORWARD}
            disabled={!canGoForward}
            onClick={onForwardButtonClick}
          >
            <KeyboardArrowRightIcon />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={STRING_RELOAD}
          placement={tooltipPlacement}
        >
          <IconButton
            aria-label={STRING_RELOAD}
            onClick={onRefreshButtonClick}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </div>

      <div className={classnames(classes.innerContainerEnd, classes.innerContainerEndVert)}>
        <Tooltip
          title={STRING_PREFERENCES}
          placement={tooltipPlacement}
        >
          <IconButton
            aria-label={STRING_PREFERENCES}
            onClick={() => onOpenDialogPreferences()}
          >
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </div>
    </Paper>
  );
};

NavigationBar.defaultProps = {
  canGoBack: false,
  canGoForward: false,
  showTitleBar: false,
};

NavigationBar.propTypes = {
  canGoBack: PropTypes.bool,
  canGoForward: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  navigationBarPosition: PropTypes.string.isRequired,
  onBackButtonClick: PropTypes.func.isRequired,
  onForwardButtonClick: PropTypes.func.isRequired,
  onHomeButtonClick: PropTypes.func.isRequired,
  onOpenDialogPreferences: PropTypes.func.isRequired,
  onRefreshButtonClick: PropTypes.func.isRequired,
  showTitleBar: PropTypes.bool,
};

const mapStateToProps = state => ({
  canGoBack: state.nav.canGoBack,
  canGoForward: state.nav.canGoForward,
  navigationBarPosition: state.preferences.navigationBarPosition,
  showTitleBar: state.preferences.showTitleBar,
});

const actionCreators = {
  openDialogPreferences,
};

export default connectComponent(
  NavigationBar,
  mapStateToProps,
  actionCreators,
  styles,
);
