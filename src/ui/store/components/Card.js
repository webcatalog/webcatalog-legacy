/* global shell remote os exec */

import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Button, Intent } from '@blueprintjs/core';

import { INSTALLED, INPROGRESS } from '../constants/actions';
import { installApp, uninstallApp } from '../actions/app';
import openApp from '../helpers/openApp';

const extractDomain = (url) => {
  try {
    const matches = url.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
    const domain = matches && matches[1];
    return domain.replace('www.', '');
  } catch (err) {
    return null;
  }
};

const Card = ({
  app, appStatus,
  requestUninstallApp, requestInstallApp,
}) => (
  <div className="col">
    <div className="custom-card pt-card pt-elevation-1" style={{ textAlign: 'center' }}>
      {app.get('id').startsWith('custom-') ? null : (
        <img
          src={`https://cdn.rawgit.com/webcatalog/backend/compiled/images/${app.get('id')}@128px.webp`}
          role="presentation"
          alt={app.get('name')}
          style={{
            height: 64,
            width: 64,
            marginBottom: 8,
          }}
        />
      )}
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
            <Button
              key="open"
              text="Open"
              onClick={() => openApp(app.get('name'), app.get('id'))}
            />,
            <Button
              key="uninstall"
              text="Uninstall"
              iconName="trash"
              intent={Intent.DANGER}
              onClick={() => requestUninstallApp(app)}
              style={{ marginLeft: 6 }}
            />,
          ];
        }
        return (
          <Button
            key="install"
            text="Install"
            iconName="download"
            intent={Intent.PRIMARY}
            onClick={() => requestInstallApp(app)}
          />
        );
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
