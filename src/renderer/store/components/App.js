import { ipcRenderer } from 'electron';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { screenResize } from '../actions/screen';
import { bootIntercom } from '../actions/intercom';
import { signIn } from '../actions/auth';
import { setManagedApp, removeManagedApp } from '../actions/appManagement';

import Nav from './Nav';

import Auth from './Auth';
import Home from './Home';
import Search from './Search';
import Installed from './Installed';

class App extends React.Component {
  componentDidMount() {
    const {
      requestBootIntercom,
      requestSetManagedApp, requestRemoveManagedApp,
      onResize, onReceiveToken,
    } = this.props;

    window.addEventListener('resize', onResize);

    ipcRenderer.send('scan-installed-apps');

    ipcRenderer.on('token', (e, token) => {
      onReceiveToken(token);
    });

    ipcRenderer.on('app-status', (e, id, status, app) => {
      if (status === null) return requestRemoveManagedApp(id);

      return requestSetManagedApp(id, status, app);
    });

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
  onReceiveToken: PropTypes.func.isRequired,
  requestBootIntercom: PropTypes.func.isRequired,
  requestSetManagedApp: PropTypes.func.isRequired,
  requestRemoveManagedApp: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  routeId: state.route.get('routeId'),
  token: state.auth.get('token'),
});

const mapDispatchToProps = dispatch => ({
  onResize: () => {
    dispatch(screenResize({
      screenWidth: window.innerWidth,
    }));
  },
  onReceiveToken: token => dispatch(signIn(token)),
  requestBootIntercom: () => dispatch(bootIntercom()),
  requestSetManagedApp: (id, status, app) => dispatch(setManagedApp(id, status, app)),
  requestRemoveManagedApp: id => dispatch(removeManagedApp(id)),
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(App);
