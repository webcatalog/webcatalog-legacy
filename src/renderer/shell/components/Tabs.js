import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import { blue, red, pink, purple, deepPurple, teal, green, deepOrange, brown, grey } from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar';
import AddCircleIcon from 'material-ui-icons/Add';

import { addTab, removeTab, setActiveTab } from '../actions/root';

const styleSheet = createStyleSheet('Tabs', theme => ({
  tabContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    overflowY: 'auto',
  },
  tab: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.7)',

    '&:hover': {
      color: '#fff',
    },
  },
  activeTab: {
    color: '#fff',
  },
  tabAvatar: {
    color: '#fff',
    height: 48,
    width: 48,
    marginTop: theme.spacing.unit,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: grey[800],
    },
  },
  blueActiveTabAvatar: {
    backgroundColor: blue[500],
    '&:hover': {
      backgroundColor: blue[700],
    },
  },
  redActiveTabAvatar: {
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[700],
    },
  },
  pinkActiveTabAvatar: {
    backgroundColor: pink[500],
    '&:hover': {
      backgroundColor: pink[700],
    },
  },
  purpleActiveTabAvatar: {
    backgroundColor: purple[500],
    '&:hover': {
      backgroundColor: purple[700],
    },
  },
  deepPurpleActiveTabAvatar: {
    backgroundColor: deepPurple[500],
    '&:hover': {
      backgroundColor: deepPurple[700],
    },
  },
  tealActiveTabAvatar: {
    backgroundColor: teal[500],
    '&:hover': {
      backgroundColor: teal[700],
    },
  },
  greenActiveTabAvatar: {
    backgroundColor: green[600],
    '&:hover': {
      backgroundColor: green[800],
    },
  },
  deepOrangeActiveTabAvatar: {
    backgroundColor: deepOrange[500],
    '&:hover': {
      backgroundColor: deepOrange[700],
    },
  },
  brownActiveTabAvatar: {
    backgroundColor: brown[500],
    '&:hover': {
      backgroundColor: brown[700],
    },
  },
}));

const Tabs = (props) => {
  const {
    classes,
    tabs,

    onAddTab,
    onRemoveTab,
    onSetActiveTab,
  } = props;

  return (
    <div className={classes.tabContainer}>
      {tabs.map((tab, i) => (
        <div
          key={`tab_${tab.id}`}
          className={classnames(classes.tab, { [classes.activeTab]: tab.isActive })}
        >
          <Avatar
            className={classnames(
              classes.tabAvatar,
              { [classes[`${tab.color}ActiveTabAvatar`]]: tab.isActive },
            )}
            onClick={() => onSetActiveTab(tab.id)}
            onContextMenu={() => onRemoveTab(tab.id)}
          >
            {i + 1}
          </Avatar>
          <span>{process.env.PLATFORM === 'darwin' ? '⌘' : '^'}{i + 1}</span>
        </div>
      ))}

      {tabs.length < 9 ? (
        <div className={classes.tab}>
          <Avatar
            className={classes.tabAvatar}
            onClick={() => onAddTab()}
          >
            <AddCircleIcon />
          </Avatar>
        </div>
      ) : null}

    </div>
  );
};

Tabs.propTypes = {
  classes: PropTypes.object.isRequired,

  tabs: PropTypes.arrayOf(PropTypes.object).isRequired,

  onAddTab: PropTypes.func.isRequired,
  onRemoveTab: PropTypes.func.isRequired,
  onSetActiveTab: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  tabs: state.root.tabs,
});

const mapDispatchToProps = dispatch => ({
  onAddTab: () => dispatch(addTab()),
  onRemoveTab: id => dispatch(removeTab(id)),
  onSetActiveTab: id => dispatch(setActiveTab(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Tabs));
