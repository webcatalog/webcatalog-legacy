/* global shell remote */
import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';

import { fetchApps, installApp, uninstallApp } from '../actions';
import { LOADING, INSTALLED, INPROGRESS } from '../constants/actions';


const extractDomain = (url) => {
  const matches = url.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
  const domain = matches && matches[1];
  return domain.replace('www.', '');
};

class App extends React.Component {
  componentDidMount() {
    const { requestFetchApps } = this.props;
    requestFetchApps();
  }

  render() {
    const { status, apps, appStatus, requestInstallApp, requestUninstallApp } = this.props;

    return (
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <nav className="pt-navbar pt-fixed-top" style={{ display: 'flex' }}>
          <div className="pt-navbar-group pt-align-left" style={{ flex: 1, paddingRight: 12 }}>
            <div className="pt-navbar-heading">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <input className="pt-input" placeholder="Search (name, URL)..." type="text" style={{ width: '100%' }} />
          </div>
          <div className="pt-navbar-group pt-align-right">
            <button className="pt-button pt-minimal pt-icon-edit">Request New App</button>
            <span className="pt-navbar-divider" />
            <button className="pt-button pt-minimal pt-icon-cog" />
          </div>
        </nav>
        <div style={{ height: 56 }} />
        {(status === LOADING) ? (
          <div
            style={{
              width: '100%',
              height: 64,
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
            }}
          >
            <div className="pt-spinner pt-small">
              <div className="pt-spinner-svg-container">
                <svg viewBox="0 0 100 100">
                  <path
                    className="pt-spinner-track"
                    d="M 50,50 m 0,-44.5 a 44.5,44.5 0 1 1 0,89 a 44.5,44.5 0 1 1 0,-89"
                  />
                  <path className="pt-spinner-head" d="M 94.5 50 A 44.5 44.5 0 0 0 50 5.5" />
                </svg>
              </div>
            </div>
          </div>
        ) : null}
        {apps ? (
          <div className="grid">
            {apps.map(app => (
              <div className="col" key={app.get('id')}>
                <div className="pt-card pt-elevation-1" style={{ textAlign: 'center' }}>
                  <img
                    src={`https://backend.getwebcatalog.com/images/${app.get('id')}@128px.webp`}
                    role="presentation"
                    style={{
                      height: 64,
                      width: 64,
                      marginBottom: 8,
                    }}
                  />
                  <h5>{app.get('name')}</h5>
                  <p>
                    <a onClick={() => shell.openExternal(app.get('url'))}>
                      {extractDomain(app.get('url'))}
                    </a>
                  </p>
                  {(() => {
                    if (appStatus.get(app.get('id')) === INPROGRESS) {
                      return (
                        <div className="pt-progress-bar pt-intent-primary" style={{ textAlign: 'left' }}>
                          <div className="pt-progress-meter" style={{ width: '100%' }} />
                        </div>
                      );
                    }
                    if (appStatus.get(app.get('id')) === INSTALLED) {
                      return [
                        <a
                          key="open"
                          role="button"
                          className="pt-button"
                          tabIndex="0"
                          onClick={() => shell.openItem(`${remote.app.getPath('home')}/Applications/WebCatalog Apps/${app.get('name')}.app`)}
                        >
                          Open
                        </a>,
                        <a
                          key="uninstall"
                          role="button"
                          className="pt-button pt-intent-danger pt-icon-trash"
                          tabIndex="0"
                          style={{ marginLeft: 6 }}
                          onClick={() => requestUninstallApp(app)}
                        >
                          Uninstall
                        </a>,
                      ];
                    }
                    return [
                      <a
                        key="install"
                        role="button"
                        className="pt-button pt-intent-primary pt-icon-download"
                        tabIndex="0"
                        onClick={() => requestInstallApp(app)}
                      >
                        Install
                      </a>,
                      <a
                        key="try"
                        role="button"
                        className="pt-button"
                        tabIndex="0"
                        style={{ marginLeft: 6 }}
                      >
                        Try
                      </a>,
                    ];
                  })()}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
}

App.propTypes = {
  status: React.PropTypes.string,
  apps: React.PropTypes.instanceOf(Immutable.List),
  appStatus: React.PropTypes.instanceOf(Immutable.Map),
  requestFetchApps: React.PropTypes.func,
  requestInstallApp: React.PropTypes.func,
  requestUninstallApp: React.PropTypes.func,
};

const mapStateToProps = state => ({
  status: state.app.status,
  apps: state.app.apps,
  appStatus: state.app.appStatus,
});

const mapDispatchToProps = dispatch => ({
  requestFetchApps: () => {
    dispatch(fetchApps());
  },
  requestInstallApp: (app) => {
    dispatch(installApp(app));
  },
  requestUninstallApp: (app) => {
    dispatch(uninstallApp(app));
  },
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(App);
