import { remote } from 'electron';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchApps } from '../actions/home';
import { screenResize } from '../actions/screen';
import { scanInstalledApps } from '../actions/appManagement';

import Nav from './Nav';

import Auth from './Auth';
import Home from './Home';
import Search from './Search';
import Installed from './Installed';

class App extends React.Component {
  componentDidMount() {
    const { requestScanInstalledApps, onResize } = this.props;
    requestScanInstalledApps();

    window.addEventListener('resize', onResize);
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
  requestScanInstalledApps: PropTypes.func.isRequired,
  onResize: PropTypes.func.isRequired,
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
  requestFetchApps: () => {
    dispatch(fetchApps());
  },
  requestScanInstalledApps: () => {
    dispatch(scanInstalledApps());
  },
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(App);
