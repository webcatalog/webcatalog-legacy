import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import IconButton from 'material-ui/IconButton';
import RefreshIcon from 'material-ui-icons/Refresh';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import { getApps } from '../../state/topCharts/actions';

const styleSheet = createStyleSheet('RefreshButton', {
  root: {
  },
});

const RefreshButton = (props) => {
  const {
    classes,
    onGetApps,
  } = props;

  return (
    <IconButton
      color="contrast"
      aria-label="Refresh"
      onClick={onGetApps}
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
  onGetApps: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = dispatch => ({
  onGetApps: () => dispatch(getApps({ next: false })),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(RefreshButton));
