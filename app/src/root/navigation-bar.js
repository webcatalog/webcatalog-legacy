import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import IconButton from 'material-ui/IconButton';
import SettingsIcon from 'material-ui-icons/Settings';
import Paper from 'material-ui/Paper';
import KeyboardArrowLeftIcon from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from 'material-ui-icons/KeyboardArrowRight';
import RefreshIcon from 'material-ui-icons/Refresh';
import HomeIcon from 'material-ui-icons/Home';

import connectComponent from '../helpers/connect-component';

import { open as openDialogPreferences } from '../state/dialogs/preferences/actions';

const styles = theme => ({
  container: {
    zIndex: 2,
    borderRadius: 0,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: 64,
    padding: theme.spacing.unit,
    paddingTop: 18,
    boxSizing: 'border-box',
    WebkitAppRegion: 'drag',
    WebkitUserSelect: 'none',
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
});

const NavigationBar = (props) => {
  const {
    canGoBack,
    canGoForward,
    classes,
    onBackButtonClick,
    onForwardButtonClick,
    onHomeButtonClick,
    onOpenDialogPreferences,
    onRefreshButtonClick,
    vert,
  } = props;

  return (
    <Paper elevation={2} className={classnames(classes.container, vert && classes.containerVert)}>
      <div className={classnames(classes.innerContainer, vert && classes.innerContainerVert)}>
        <IconButton aria-label="Home" onClick={onHomeButtonClick}>
          <HomeIcon />
        </IconButton>
        <IconButton aria-label="Back" onClick={onBackButtonClick} disabled={!canGoBack}>
          <KeyboardArrowLeftIcon />
        </IconButton>
        <IconButton aria-label="Forward" onClick={onForwardButtonClick} disabled={!canGoForward}>
          <KeyboardArrowRightIcon />
        </IconButton>
        <IconButton aria-label="Refresh" onClick={onRefreshButtonClick}>
          <RefreshIcon />
        </IconButton>
      </div>

      <div className={classnames(classes.innerContainerEnd, classes.innerContainerEndVert)}>
        <IconButton
          aria-label="Preferences"
          onClick={() => onOpenDialogPreferences()}
        >
          <SettingsIcon />
        </IconButton>
      </div>
    </Paper>
  );
};

NavigationBar.defaultProps = {
  canGoBack: false,
  canGoForward: false,
  vert: false,
};

NavigationBar.propTypes = {
  canGoBack: PropTypes.bool,
  canGoForward: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  onBackButtonClick: PropTypes.func.isRequired,
  onForwardButtonClick: PropTypes.func.isRequired,
  onHomeButtonClick: PropTypes.func.isRequired,
  onOpenDialogPreferences: PropTypes.func.isRequired,
  onRefreshButtonClick: PropTypes.func.isRequired,
  vert: PropTypes.bool,
};

const mapStateToProps = state => ({
  canGoBack: state.nav.canGoBack,
  canGoForward: state.nav.canGoForward,
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
