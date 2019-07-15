import React from 'react';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import grey from '@material-ui/core/colors/grey';
import blueGrey from '@material-ui/core/colors/blueGrey';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CloseIcon from '@material-ui/icons/Close';

import connectComponent from '../../helpers/connect-component';

import { STRING_ADD } from '../../constants/strings';

import { updateActivePage } from '../../state/root/general/actions';

import { requestRemoveWorkspace } from '../../senders/workspaces';

import RightClickMenu from '../shared/right-click-menu';

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
    backgroundColor: blueGrey[900],
  },
  containerWithoutTitlebar: {
    paddingTop: 28,
  },
  innerContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
  },
  innerContainerEnd: {
    flex: '0 0 auto',
  },
  settingIcon: {
    color: theme.palette.common.white,
  },
  workspaceOuter: {
    position: 'relative',
    width: 68,
    height: 68,
    padding: 4,
    boxSizing: 'border-box',
    '&:focus': {
      borderColor: 'transparent',
      outline: 0,
    },
  },
  workspaceIcon: {
    backgroundColor: grey[300],
    width: 36,
    height: 36,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
    borderRadius: 4,
    textAlign: 'center',
    lineHeight: '36px',
    fontSize: '24px',
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
  },
  workspaceIconImg: {
    height: 28,
    width: 28,
    paddingTop: 4,
  },
  workspaceDesc: {
    color: theme.palette.common.white,
    fontSize: 10,
    height: 12,
    left: 0,
    position: 'absolute',
    textAlign: 'center',
    top: 52,
    width: 68,
  },
  workspaceSelected: {
    backgroundColor: theme.palette.common.white,
    bottom: 0,
    height: 36,
    left: 0,
    margin: 'auto',
    position: 'absolute',
    top: 0,
    width: 3,
  },
});

const WorkspaceBar = (props) => {
  const {
    classes,
    activePage,
    workspaceId,
    workspaces,
    onUpdateActivePage,
  } = props;

  return (
    <Paper
      elevation={2}
      className={classes.container}
    >
      <div className={classes.innerContainer}>
        {workspaces.map((workspace, i) => (
          <RightClickMenu
            key={`workspaceBarItem_${workspace.id}`}
            id={`workspaceBarItem_${workspace.id}`}
            buttonElement={(
              <div
                className={classes.workspaceOuter}
                onClick={() => onUpdateActivePage('workspace', workspace.id)}
                onKeyDown={() => onUpdateActivePage('workspace', workspace.id)}
                tabIndex="0"
                role="button"
              >
                <div className={classes.workspaceIcon}>
                  <img src={workspace.icon} alt={workspace.name} className={classes.workspaceIconImg} />
                </div>
                <div className={classes.workspaceDesc}>
                  ⌘ {i + 1}
                </div>
                {activePage === 'workspace' && workspaceId === workspace.id && <div className={classes.workspaceSelected} />}
              </div>
            )}
          >
            <ListItem button onClick={() => requestRemoveWorkspace(i)}>
              <ListItemIcon>
                <CloseIcon />
              </ListItemIcon>
              <ListItemText primary="Remove" />
            </ListItem>
          </RightClickMenu>
        ))}
        <div
          className={classes.workspaceOuter}
          onClick={() => onUpdateActivePage('add-workspace', null)}
          onKeyDown={() => onUpdateActivePage('add-workspace', null)}
          tabIndex="0"
          role="button"
        >
          <div className={classes.workspaceIcon}>
            +
          </div>
          <div className={classes.workspaceDesc}>
            {STRING_ADD}
          </div>
          <div className={classes.workspaceDesc} />
          {activePage === 'add-workspace' && <div className={classes.workspaceSelected} />}
        </div>
      </div>
    </Paper>
  );
};

WorkspaceBar.defaultProps = {
  activePage: 'add-workspace',
  workspaceId: null,
};

WorkspaceBar.propTypes = {
  classes: PropTypes.object.isRequired,
  activePage: PropTypes.string,
  workspaceId: PropTypes.string,
  workspaces: PropTypes.arrayOf(PropTypes.object).isRequired,
  onUpdateActivePage: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  activePage: state.general.activePage,
  workspaceId: state.general.workspaceId,
  workspaces: state.workspaces,
});

const actionCreators = {
  updateActivePage,
};

export default connectComponent(
  WorkspaceBar,
  mapStateToProps,
  actionCreators,
  styles,
);
