import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import IconButton from 'material-ui/IconButton';
import RefreshIcon from 'material-ui-icons/Refresh';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import { fetchApps } from '../../actions/home';

const styleSheet = createStyleSheet('RefreshButton', {
  root: {
  },
});

const RefreshButton = (props) => {
  const {
    classes,
    onFetchApps,
  } = props;

  return (
    <IconButton
      color="contrast"
      aria-label="Refresh"
      onClick={onFetchApps}
      className={classes.root}
    >
      <RefreshIcon />
    </IconButton>
  );
};

RefreshButton.defaultProps = {
};

RefreshButton.propTypes = {
  classes: PropTypes.object.isRequired,
  onFetchApps: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = dispatch => ({
  onFetchApps: () => dispatch(fetchApps()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(RefreshButton));
