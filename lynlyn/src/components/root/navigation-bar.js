import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import HomeIcon from '@material-ui/icons/Home';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import Paper from '@material-ui/core/Paper';
import RefreshIcon from '@material-ui/icons/Refresh';
import Tooltip from '@material-ui/core/Tooltip';

import connectComponent from '../../helpers/connect-component';

import {
  STRING_BACK,
  STRING_FORWARD,
  STRING_HOME,
  STRING_RELOAD,
} from '../../constants/strings';

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
    onBackButtonClick,
    onForwardButtonClick,
    onHomeButtonClick,
    onRefreshButtonClick,
  } = props;

  const tooltipPlacement = 'bottom';

  return (
    <Paper
      elevation={2}
      className={classnames(
        classes.container,
        classes.containerVert,
      )}
    >
      <div className={classnames(classes.innerContainer, classes.innerContainerVert)}>
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
        {canGoBack ? (
          <Tooltip
            title={STRING_BACK}
            placement={tooltipPlacement}
          >
            <IconButton
              aria-label={STRING_BACK}
              onClick={onBackButtonClick}
            >
              <KeyboardArrowLeftIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <IconButton
            aria-label={STRING_BACK}
            disabled
            onClick={onBackButtonClick}
          >
            <KeyboardArrowLeftIcon />
          </IconButton>
        )}
        {canGoForward ? (
          <Tooltip
            title={STRING_FORWARD}
            placement={tooltipPlacement}
          >
            <IconButton
              aria-label={STRING_FORWARD}
              onClick={onForwardButtonClick}
            >
              <KeyboardArrowRightIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <IconButton
            aria-label={STRING_FORWARD}
            disabled
            onClick={onForwardButtonClick}
          >
            <KeyboardArrowRightIcon />
          </IconButton>
        )}
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
    </Paper>
  );
};

NavigationBar.defaultProps = {
  canGoBack: false,
  canGoForward: false,
};

NavigationBar.propTypes = {
  canGoBack: PropTypes.bool,
  canGoForward: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  onBackButtonClick: PropTypes.func.isRequired,
  onForwardButtonClick: PropTypes.func.isRequired,
  onHomeButtonClick: PropTypes.func.isRequired,
  onRefreshButtonClick: PropTypes.func.isRequired,
};

export default connectComponent(
  NavigationBar,
  null,
  null,
  styles,
);
