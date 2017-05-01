import { remote } from 'electron';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { screenResize } from '../actions/screen';
import { scanInstalledApps } from '../actions/appManagement';
import { bootIntercom } from '../actions/intercom';

import Nav from './Nav';

import Auth from './Auth';
import Home from './Home';
import Search from './Search';
import Installed from './Installed';

class App extends React.Component {
  componentDidMount() {
    const { requestScanInstalledApps, requestBootIntercom, onResize } = this.props;
    requestScanInstalledApps();

    window.addEventListener('resize', onResize);

    requestBootIntercom();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.props.onResize);
  }

  render() {
    const { token, routeId } = this.props;

    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {token ? <Nav /> : null}
        {(() => {
          if (!token) return <Auth />;

          switch (routeId) {
            case 'search':
              return <Search />;
            case 'installed':
              return <Installed />;
            default:
              return <Home />;
          }
        })()}
      </div>
    );
  }
}

App.propTypes = {
  routeId: PropTypes.string.isRequired,
  token: PropTypes.string,
  onResize: PropTypes.func.isRequired,
  requestScanInstalledApps: PropTypes.func.isRequired,
  requestBootIntercom: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  routeId: state.route.get('routeId'),
  token: state.auth.get('token'),
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
  requestScanInstalledApps: () => {
    dispatch(scanInstalledApps());
  },
  requestBootIntercom: () => {
    dispatch(bootIntercom());
  },
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(App);
