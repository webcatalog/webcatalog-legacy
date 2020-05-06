import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import red from '@material-ui/core/colors/red';

import connectComponent from '../../helpers/connect-component';
import getAvatarText from '../../helpers/get-avatar-text';

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
    position: 'relative',
    borderLeft: '4px solid',
    borderColor: 'transparent',
  },
  rootHibernate: {
    opacity: 0.4,
  },
  rootActive: {
    borderColor: theme.palette.type === 'dark' ? theme.palette.common.white : theme.palette.common.black,
    opacity: 1,
  },
  avatar: {
    height: 32,
    width: 32,
    background: theme.palette.common.white,
    borderRadius: 4,
    color: theme.palette.getContrastText(theme.palette.common.white),
    lineHeight: '32px',
    textAlign: 'center',
    fontWeight: 500,
    textTransform: 'uppercase',
    border: theme.palette.type === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
    overflow: 'hidden',
  },
  textAvatar: {
    background: theme.palette.type === 'dark' ? theme.palette.common.white : theme.palette.common.black,
    color: theme.palette.getContrastText(theme.palette.type === 'dark' ? theme.palette.common.white : theme.palette.common.black),
  },
  transparentAvatar: {
    background: 'transparent',
    border: 'none',
    color: theme.palette.text.primary,
  },
  avatarPicture: {
    height: 32,
    width: 32,
  },
  shortcutText: {
    marginTop: 2,
    marginBottom: 0,
    padding: 0,
    fontSize: '12px',
    fontWeight: 500,
    color: theme.palette.text.primary,
  },
  badgeCount: {
    position: 'absolute',
    right: 10,
    top: 4,
    backgroundColor: red[600],
    height: 16,
    width: 16,
    borderRadius: 8,
    fontSize: '12px',
    lineHeight: '16px',
    textAlign: 'center',
    color: theme.palette.common.white,
    paddingLeft: 1.3,
    fontWeight: 700,
  },
});

const WorkspaceSelector = ({
  active,
  badgeCount,
  classes,
  hibernated,
  id,
  name,
  onClick,
  onContextMenu,
  order,
  picturePath,
  transparentBackground,
}) => (
  <div
    role="button"
    className={classNames(
      classes.root,
      hibernated && classes.rootHibernate,
      active && classes.rootActive,
    )}
    onClick={onClick}
    onKeyDown={null}
    onContextMenu={onContextMenu}
    tabIndex="0"
  >
    <div
      className={classNames(
        classes.avatar,
        (id === 'add' || !picturePath) && classes.textAvatar,
        transparentBackground && classes.transparentAvatar,
      )}
    >
      {picturePath ? (
        <img alt="Icon" className={classes.avatarPicture} src={`file://${picturePath}`} draggable={false} />
      ) : getAvatarText(id, name, order)}
    </div>
    {badgeCount > 0 && (
      <div className={classes.badgeCount}>
        {badgeCount > 9 ? '*' : badgeCount}
      </div>
    )}
    {(id === 'add' || order < 9) && (
      <p className={classes.shortcutText}>{id === 'add' ? 'Add' : `${window.process.platform === 'darwin' ? '⌘' : 'Ctrl'} + ${order + 1}`}</p>
    )}
  </div>
);

WorkspaceSelector.defaultProps = {
  active: false,
  badgeCount: 0,
  hibernated: false,
  name: null,
  onContextMenu: null,
  order: 0,
  picturePath: null,
  transparentBackground: false,
};

WorkspaceSelector.propTypes = {
  active: PropTypes.bool,
  badgeCount: PropTypes.number,
  classes: PropTypes.object.isRequired,
  hibernated: PropTypes.bool,
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func,
  order: PropTypes.number,
  picturePath: PropTypes.string,
  transparentBackground: PropTypes.bool,
};

export default connectComponent(
  WorkspaceSelector,
  null,
  null,
  styles,
);
