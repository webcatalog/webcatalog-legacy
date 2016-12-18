/* global shell */
import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';

import { fetchApps, installApp } from '../actions';

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
    const { status, apps, requestInstallApp } = this.props;

    if (status === 'loading') return (<div>loading</div>);

    return (
      <div className="container">
        <nav className="pt-navbar pt-fixed-top">
          <div className="pt-navbar-group pt-align-left">
            <div className="pt-navbar-heading">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <input className="pt-input" placeholder="Search (name, URL)..." type="text" />
          </div>
          <div className="pt-navbar-group pt-align-right">
            <button className="pt-button pt-minimal pt-icon-edit">Request New App</button>
            <span className="pt-navbar-divider" />
            <button className="pt-button pt-minimal pt-icon-cog" />
          </div>
        </nav>
        <div className="grid">
          {apps.map(app => (
            <div className="col" key={app.get('id')}>
              <div className="pt-card pt-elevation-1" style={{ textAlign: 'center' }}>
                <img className="logo" src={`https://backend.getwebcatalog.com/images/${app.get('id')}@128px.webp`} role="presentation" />
                <h5>{app.get('name')}</h5>
                <p>
                  <a onClick={() => shell.openExternal(app.get('url'))}>
                    {extractDomain(app.get('url'))}
                  </a>
                </p>
                <a
                  role="button"
                  className="pt-button pt-intent-primary pt-icon-download"
                  tabIndex="0"
                  onClick={() => requestInstallApp(app)}
                >
                  Install
                </a>
                <a
                  role="button"
                  className="pt-button"
                  tabIndex="0"
                  style={{ marginLeft: 6 }}
                >
                  Try
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  status: React.PropTypes.string,
  apps: React.PropTypes.instanceOf(Immutable.List),
  requestFetchApps: React.PropTypes.func,
  requestInstallApp: React.PropTypes.func,
};

const mapStateToProps = state => ({
  status: state.app.status,
  apps: state.app.apps,
});

const mapDispatchToProps = dispatch => ({
  requestFetchApps: () => {
    dispatch(fetchApps());
  },
  requestInstallApp: (app) => {
    dispatch(installApp(app));
  },
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(App);
