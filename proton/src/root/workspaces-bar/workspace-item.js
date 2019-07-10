import React from 'react';
import PropTypes from 'prop-types';

import connectComponent from '../../helpers/connect-component';

import { open as openDialogWorkspace } from '../../state/dialogs/new-workspace/actions';

import { setActive } from '../../state/root/workspaces-bar/actions';

const styles = {
  root: {
    cursor: 'pointer',
    display: 'flex',
    marginBottom: 12,
    position: 'relative',
  },
  circle: {
    width: 42,
    height: 42,
    backgroundColor: 'lightgray',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
    '&:hover': {
      background: 'red',
    },
  },
  circleActive: {
    extend: 'circle',
    backgroundColor: 'gray',
  },
  avatar: {
    width: 14,
    height: 14,
    backgroundColor: 'darkgray',
    borderRadius: '100%',
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
};

const TabBarItem = (props) => {
  const {
    active,
    classes,
    index,
    onOpenDialogWorkspace,
    onSetActive,
    workspace,
  } = props;

  const handleMouseDown = (e) => {
    const isRightClick = e.nativeEvent.which === 3;
    if (isRightClick) onOpenDialogWorkspace(workspace.workspaceId);
  };

  return (
    <div
      className={classes.root}
      onClick={() => onSetActive(workspace)}
      onMouseDown={handleMouseDown}
      role="button"
      tabIndex="0"
    >
      <div className={classes[`circle${active ? 'Active' : ''}`]}>
        {index + 1}
      </div>
      <div className={classes.avatar} />
    </div>
  );
};

TabBarItem.defaultProps = {
  active: false,
};

TabBarItem.propTypes = {
  active: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onOpenDialogWorkspace: PropTypes.func.isRequired,
  onSetActive: PropTypes.func.isRequired,
  workspace: PropTypes.shape({}).isRequired,
};

const mapStateToProps = () => ({});

const actionCreators = {
  setActive,
  openDialogWorkspace,
};

export default connectComponent(
  TabBarItem,
  mapStateToProps,
  actionCreators,
  styles,
);
