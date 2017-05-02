import { ipcRenderer } from 'electron';
import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { ProgressBar, Button, Intent } from '@blueprintjs/core';
import semver from 'semver';

import getServerUrl from '../libs/getServerUrl';
import { LATEST_SHELL_VERSION } from '../constants/versions';

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
  app, managedApps, token,
}) => (
  <div className="col">
    <div className="pt-card pt-elevation-1" style={{ textAlign: 'center', padding: '12px 8px' }}>
      <img
        src={getServerUrl(`/s3/${app.get('id')}@128px.webp`)}
        role="presentation"
        alt={app.get('name')}
        style={{
          height: 64,
          width: 64,
          marginBottom: 8,
        }}
      />
      <h5
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: 'normal',
          whiteSpace: 'nowrap',
          margin: 0,
        }}
      >{app.get('name')}</h5>
      <p>
        <a onClick={() => ipcRenderer.send('open-in-browser', app.get('url'))}>
          {extractDomain(app.get('url'))}
        </a>
      </p>
      {(() => {
        let appStatus = null;

        if (!appStatus && managedApps.has(app.get('id'))) {
          appStatus = managedApps.getIn([app.get('id'), 'status']);
        }

        if (appStatus === 'INSTALLING' || appStatus === 'UNINSTALLING' || appStatus === 'UPDATING') {
          return (
            <ProgressBar intent={Intent.PRIMARY} className="card-progress-bar" />
          );
        }
        if (appStatus === 'INSTALLED') {
          return [
            semver.gte(managedApps.getIn([app.get('id'), 'app', 'shellVersion']), LATEST_SHELL_VERSION) ? (
              <Button
                key="open"
                text="Open"
                onClick={() => ipcRenderer.send('open-app', app.get('id'), app.get('name'))}
              />
            ) : (
              <Button
                key="update"
                text="Update"
                iconName="download"
                intent={Intent.SUCCESS}
                onClick={() => ipcRenderer.send('update-app', app.get('id'), managedApps.getIn([app.get('id'), 'app', 'name']))}
              />
            ),
            <Button
              key="uninstall"
              text="Uninstall"
              iconName="trash"
              intent={Intent.DANGER}
              style={{ marginLeft: 6 }}
              onClick={() => ipcRenderer.send('uninstall-app', app.get('id'), token)}
            />,
          ];
        }
        return (
          <Button
            key="install"
            text="Install"
            iconName="download"
            intent={Intent.PRIMARY}
            onClick={() => ipcRenderer.send('install-app', app.get('id'), token)}
          />
        );
      })()}
    </div>
  </div>
);

Card.propTypes = {
  app: PropTypes.instanceOf(Immutable.Map).isRequired,
  managedApps: PropTypes.instanceOf(Immutable.Map).isRequired,
  token: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  managedApps: state.appManagement.get('managedApps'),
  token: state.auth.get('token'),
});

export default connect(
  mapStateToProps,
)(Card);
