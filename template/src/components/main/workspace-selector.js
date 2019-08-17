import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import connectComponent from '../../helpers/connect-component';

const styles = (theme) => ({
  root: {
    height: 68,
    width: 68,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    fontFamily: theme.typography.fontFamily,
    outline: 'none',
    '&:hover': {
      background: theme.palette.action.hover,
      cursor: 'pointer',
    },
    WebkitAppRegion: 'no-drag',
    opacity: 0.8,
  },
  rootActive: {
    borderColor: theme.palette.type === 'dark' ? theme.palette.common.white : theme.palette.common.black,
    borderLeft: '4px solid',
    opacity: 1,
  },
  avatar: {
    height: 32,
    width: 32,
    background: theme.palette.type === 'dark' ? theme.palette.common.white : theme.palette.common.black,
    borderRadius: 4,
    color: theme.palette.getContrastText(theme.palette.type === 'dark' ? theme.palette.common.white : theme.palette.common.black),
    lineHeight: '32px',
    textAlign: 'center',
    fontWeight: 500,
    textTransform: 'uppercase',
  },
  shortcutText: {
    marginTop: 2,
    marginBottom: 0,
    padding: 0,
    fontSize: '12px',
    fontWeight: 500,
    color: theme.palette.text.primary,
  },
});

const getAvatarText = (id, name, order) => {
  if (id === 'add') return '+';
  if (name) return name[0];
  return order + 1;
};

const WorkspaceSelector = ({
  active,
  classes,
  id,
  name,
  order,
  onClick,
  onContextMenu,
}) => (
  <div
    role="button"
    className={classNames(classes.root, active && classes.rootActive)}
    onClick={onClick}
    onKeyDown={null}
    onContextMenu={onContextMenu}
    tabIndex="0"
  >
    <div className={classes.avatar}>
      {getAvatarText(id, name, order)}
    </div>
    <p className={classes.shortcutText}>{id === 'add' ? 'Add' : `⌘ + ${order + 1}`}</p>
  </div>
);

WorkspaceSelector.defaultProps = {
  active: false,
  name: null,
  order: 0,
  onContextMenu: null,
};

WorkspaceSelector.propTypes = {
  active: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  order: PropTypes.number,
  onClick: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func,
};

export default connectComponent(
  WorkspaceSelector,
  null,
  null,
  styles,
);
