import React from 'react';
import { connect } from 'react-redux';

import Nav from './Nav';
import Settings from './Settings';

const Layout = ({ children, pathname }) => (
  <div style={{ maxWidth: 960, margin: '0 auto' }}>
    <Nav pathname={pathname} />
    <div style={{ height: 48 }} />
    {children}
    <Settings />
  </div>
);

Layout.propTypes = {
  children: React.PropTypes.element, // matched child route component
  pathname: React.PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  pathname: ownProps.location.pathname,
});

export default connect(
  mapStateToProps,
)(Layout);
