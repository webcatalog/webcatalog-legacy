import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import { amber, blue, red, green, grey } from 'material-ui/styles/colors';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import SettingsIcon from 'material-ui-icons/Settings';

const styleSheet = createStyleSheet('Workspaces', theme => ({
  button: {
    // border: `3px solid ${amber[500]}`,
    color: 'rgba(0, 0, 0, .5)',
    backgroundColor: grey[300],
    boxShadow: 'none',
    fontSize: 20,
    fontWeight: 400,
    width: 48,
    height: 48,
    marginTop: 20,
  },
  buttonBlue: {
    backgroundColor: blue[500],
  },
  buttonRed: {
    backgroundColor: red[400],
  },
  buttonGreen: {
    backgroundColor: green[500],
  },
  buttonAmber: {
    backgroundColor: amber[500],
  },
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
    background: grey[900],
    WebkitAppRegion: 'drag',
    WebkitUserSelect: 'none',
  },
  innerContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
  },
}));

const Workspaces = (props) => {
  const {
    classes,
  } = props;

  return (
    <Paper className={classes.container} elevation={4}>
      <div className={classes.innerContainer}>
        <Button
          fab
          color="default"
          aria-label="add"
          className={classnames(classes.button, classes.buttonBlue)}
        >
          1
        </Button>
        <Button
          fab
          color="default"
          aria-label="add"
          className={classnames(classes.button, classes.buttonAmber)}
        >
          2
        </Button>
        <Button
          fab
          color="default"
          aria-label="add"
          className={classnames(classes.button, classes.buttonRed)}
        >
          3
        </Button>
        <Button
          fab
          color="default"
          aria-label="add"
          className={classnames(classes.button, classes.buttonGreen)}
        >
          4
        </Button>
      </div>
      <div>
        <IconButton aria-label="Back">
          <SettingsIcon />
        </IconButton>
      </div>
    </Paper>
  );
};

Workspaces.defaultProps = {
};

Workspaces.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Workspaces));
