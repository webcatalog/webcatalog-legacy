import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import connectComponent from '../../helpers/connect-component';

import mailServices from '../../constants/services';

const styles = theme => ({
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
  avatarText: {
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
  avatar: {
    height: 32,
    width: 32,
    borderRadius: 4,
    border: '1px solid rgba(0, 0, 0, 0.2)',
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

const WorkspaceSelector = ({
  active,
  classes,
  id,
  name,
  onClick,
  onContextMenu,
  order,
  serviceId,
}) => (
  <div
    role="button"
    className={classNames(classes.root, active && classes.rootActive)}
    onClick={onClick}
    onKeyDown={onClick}
    onContextMenu={onContextMenu}
    tabIndex="0"
  >
    {id === 'add' ? (
      <div className={classes.avatarText}>
        +
      </div>
    ) : (
      <img src={mailServices[serviceId].icon} alt={name} className={classes.avatar} />
    )}
    <p className={classes.shortcutText}>{id === 'add' ? 'Add' : `⌘ + ${order + 1}`}</p>
  </div>
);

WorkspaceSelector.defaultProps = {
  active: false,
  name: null,
  onContextMenu: null,
  order: 0,
  serviceId: null,
};

WorkspaceSelector.propTypes = {
  active: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func,
  order: PropTypes.number,
  serviceId: PropTypes.string,
};

export default connectComponent(
  WorkspaceSelector,
  null,
  null,
  styles,
);
