/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
// External Dependencies
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

const connectComponent = (component, mapStateToProps, actionCreators, styles, options) => {
  // Adds `on` to binded action names
  const onActionCreators = {};
  if (actionCreators) {
    Object.keys(actionCreators).forEach((key) => {
      const newKey = `on${key[0].toUpperCase()}${key.substring(1, key.length)}`;
      onActionCreators[newKey] = actionCreators[key];
    });
  }

  const styledComponent = styles ? withStyles(styles)(component, { name: component.name })
    : component;

  return connect(
    mapStateToProps,
    (dispatch) => bindActionCreators(onActionCreators, dispatch),
    null,
    options,
  )(styledComponent);
};

export default connectComponent;
