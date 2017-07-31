import React from 'react';
import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import Menu from 'material-ui/Menu';

const styleSheet = createStyleSheet('EmptyState', {
  root: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
});

class EmptyState extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      classes,
      Icon,
      children,
    } = this.props;

    return (
      <div className={classes.root}>
        <Icon />
        {children}
      </div>
    );
  }
}

EmptyState.propTypes = {
  classes: PropTypes.object.isRequired,
  Icon: PropTypes.element.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};

export default withStyles(styleSheet)(EmptyState);
