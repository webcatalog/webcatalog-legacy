/* global shell remote */

import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';

import { INSTALLED, INPROGRESS } from '../constants/actions';
import { installApp, uninstallApp } from '../actions';

const extractDomain = (url) => {
  const matches = url.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
  const domain = matches && matches[1];
  return domain.replace('www.', '');
};

const Card = ({
  app, appStatus,
  requestUninstallApp, requestInstallApp,
}) => (
  <div className="col">
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
            onClick={() => {
              const BrowserWindow = remote.BrowserWindow;
              const trialWindow = new BrowserWindow({
                width: 1024,
                height: 600,
              });
              trialWindow.loadURL(app.get('url'));
            }}
          >
            Try
          </a>,
        ];
      })()}
    </div>
  </div>
);

Card.propTypes = {
  app: React.PropTypes.instanceOf(Immutable.Map),
  appStatus: React.PropTypes.instanceOf(Immutable.Map),
  requestInstallApp: React.PropTypes.func,
  requestUninstallApp: React.PropTypes.func,
};

const mapStateToProps = state => ({
  appStatus: state.app.appStatus,
});

const mapDispatchToProps = dispatch => ({
  requestInstallApp: (app) => {
    dispatch(installApp(app));
  },
  requestUninstallApp: (app) => {
    dispatch(uninstallApp(app));
  },
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(Card);
