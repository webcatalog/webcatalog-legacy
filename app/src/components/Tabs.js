import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import classnames from 'classnames';
import Draggable from 'react-draggable';
import Mousetrap from 'mousetrap';

import { blue, red, pink, purple, deepPurple, teal, green, deepOrange, brown, grey } from 'material-ui/styles/colors';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import AddCircleIcon from 'material-ui-icons/Add';
import Avatar from 'material-ui/Avatar';

import {
  addTab,
  removeTab,
  setActiveTab,
  swapTab,
} from '../actions/root';

const TAB_HEIGHT = 80;

const styleSheet = createStyleSheet('Tabs', theme => ({
  tabContainer: {
    flex: 1,
    position: 'relative',
    // display: 'flex',
    // flexDirection: 'column',
    // alignItems: 'center',
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    overflowY: 'auto',
  },
  tab: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.7)',
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    left: 0,

    width: '100%',
    height: TAB_HEIGHT,

    padding: theme.spacing.unit,
    boxSizing: 'border-box',

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
    '&:hover': {
      backgroundColor: grey[800],
    },
    margin: '0 auto',
    WebkitAppRegion: 'no-drag',
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
  tabShortcutText: {
    height: 16,
    lineHeight: '16px',
  },
}));

const handleDrag = (e, { node }) => {
  // stay on top
  // eslint-disable-next-line
  node.style.zIndex = 1000;
};

class Tabs extends React.Component {
  componentDidMount() {
    const { onSetActiveTab, onAddTab } = this.props;

    // tab shortcut
    for (let i = 0; i < 9; i += 1) {
      Mousetrap.bind([`command+${i + 1}`, `ctrl+${i + 1}`], () => {
        const { tabs } = this.props;

        if (tabs[i]) {
          onSetActiveTab(tabs[i].id);
        }
      });
    }

    Mousetrap.bind(['command+t', 'ctrl+t'], () => onAddTab());
  }

  // eslint-disable-next-line
  componentWillUnmount() {
    for (let i = 0; i < 9; i += 1) {
      Mousetrap.unbind([`command+${i + 1}`, `ctrl+${i + 1}`]);
    }

    Mousetrap.unbind(['command+t', 'ctrl+t']);
  }

  render() {
    const {
      classes,
      tabs,

      onAddTab,
      onRemoveTab,
      onSwapTab,
      onSetActiveTab,
    } = this.props;

    return (
      <div className={classes.tabContainer}>
        {tabs.map((tab, i) => {
          const defaultY = TAB_HEIGHT * i;

          const handleStop = (e, { node, y }) => {
            // remove stay on top trick
            // eslint-disable-next-line
            node.style.zIndex = null;

            const d = Math.abs(defaultY - y);
            const count = d > (TAB_HEIGHT / 2) ?
              Math.floor((d - (TAB_HEIGHT / 2)) / TAB_HEIGHT) + 1 : 1;


            if (d > TAB_HEIGHT / 2) {
              let secondI = i;
              if (defaultY > y) {
                secondI = i - count > -1 ? i - count : 0;
              } else {
                secondI = i + count < tabs.length ? i + count : tabs.length - 1;
              }

              if (i !== secondI) {
                onSwapTab(i, secondI);
              }
            }
          };

          return (
            <Draggable
              key={`tab_${tab.id}`}
              axis="y"
              position={{ x: 0, y: TAB_HEIGHT * i }}
              onStart={handleDrag}
              onDrag={handleDrag}
              onStop={handleStop}
            >
              <div className={classnames(classes.tab, { [classes.activeTab]: tab.isActive })}>
                <Avatar
                  className={classnames(
                    classes.tabAvatar,
                    { [classes[`${tab.color}ActiveTabAvatar`]]: tab.isActive },
                  )}
                  onClick={() => onSetActiveTab(tab.id)}
                  onContextMenu={() => onRemoveTab(tab.id)}
                >
                  {tab.id + 1}
                </Avatar>
                <span className={classes.tabShortcutText}>{window.PLATFORM === 'darwin' ? '⌘' : '^'}{i + 1}</span>
              </div>
            </Draggable>
          );
        })}

        {tabs.length < 9 ? (
          <div className={classes.tab} style={{ top: tabs.length * 80 }}>
            <Avatar
              className={classes.tabAvatar}
              onClick={() => onAddTab()}
            >
              <AddCircleIcon />
            </Avatar>
            <span className={classes.tabShortcutText}>{window.PLATFORM === 'darwin' ? '⌘' : '^'}T</span>
          </div>
        ) : null}

      </div>
    );
  }
}

Tabs.propTypes = {
  classes: PropTypes.object.isRequired,

  tabs: PropTypes.arrayOf(PropTypes.object).isRequired,

  onAddTab: PropTypes.func.isRequired,
  onRemoveTab: PropTypes.func.isRequired,
  onSwapTab: PropTypes.func.isRequired,
  onSetActiveTab: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  tabs: state.root.tabs,
});

const mapDispatchToProps = dispatch => ({
  onAddTab: () => dispatch(addTab()),
  onRemoveTab: id => dispatch(removeTab(id)),
  onSwapTab: (firstIndex, secondIndex) => dispatch(swapTab(firstIndex, secondIndex)),
  onSetActiveTab: id => dispatch(setActiveTab(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Tabs));
