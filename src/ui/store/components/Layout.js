import React from 'react';
import { connect } from 'react-redux';

import { fetchApps } from '../actions/home';
import { scanInstalledApps } from '../actions/appManagement';

import Nav from './Nav';

class Layout extends React.Component {
  componentDidMount() {
    const { requestScanInstalledApps } = this.props;
    requestScanInstalledApps();
  }

  componentWillUnmount() {
    this.scrollContainer.onscroll = null;
  }

  render() {
    const { children, pathname } = this.props;

    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Nav pathname={pathname} />
        {children}
      </div>
    );
  }
}

Layout.propTypes = {
  children: React.PropTypes.element, // matched child route component
  pathname: React.PropTypes.string,
  requestScanInstalledApps: React.PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  pathname: ownProps.location.pathname,
});

const mapDispatchToProps = dispatch => ({
  requestFetchApps: () => {
    dispatch(fetchApps());
  },
  requestScanInstalledApps: () => {
    dispatch(scanInstalledApps());
  },
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(Layout);
