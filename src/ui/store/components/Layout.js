import { remote } from 'electron';
import React from 'react';
import { connect } from 'react-redux';

import { fetchApps } from '../actions/home';
import { screenResize } from '../actions/screen';
import { scanInstalledApps } from '../actions/appManagement';

import Nav from './Nav';

class Layout extends React.Component {
  componentDidMount() {
    const { requestScanInstalledApps, onResize } = this.props;
    requestScanInstalledApps();

    window.addEventListener('resize', onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.props.onResize);
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
  children: React.PropTypes.element.isRequired, // matched child route component
  pathname: React.PropTypes.string.isRequired,
  requestScanInstalledApps: React.PropTypes.func.isRequired,
  onResize: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  pathname: ownProps.location.pathname,
});

const mapDispatchToProps = dispatch => ({
  onResize: () => {
    dispatch(screenResize({
      screenWidth: window.innerWidth,
      isFullScreen: remote.getCurrentWindow().isFullScreen(),
      isMaximized: remote.getCurrentWindow().isMaximized(),
      isMinimized: remote.getCurrentWindow().isMinimized(),
    }));
  },
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
