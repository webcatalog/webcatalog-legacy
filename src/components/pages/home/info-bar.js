import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

import connectComponent from '../../../helpers/connect-component';

const styles = (theme) => ({
  root: {
    display: 'flex',
    height: 36,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  statusText: {
    marginRight: theme.spacing(1),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

const Toolbar = ({
  classes,
  currentQuery,
}) => {
  if (currentQuery.length > 0) {
    return (
      <div className={classes.root}>
        <Typography variant="body2" color="textPrimary" className={classes.statusText}>
          Search results for
          &quot;
          {currentQuery}
          &quot;
        </Typography>
      </div>
    );
  }
  return null;
};

Toolbar.defaultProps = {
  currentQuery: '',
};

Toolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  currentQuery: PropTypes.string,
};

const mapStateToProps = (state) => ({
  currentQuery: state.home.currentQuery,
});

export default connectComponent(
  Toolbar,
  mapStateToProps,
  null,
  styles,
);
