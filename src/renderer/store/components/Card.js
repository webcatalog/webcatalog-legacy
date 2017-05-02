import { ipcRenderer } from 'electron';
import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { ProgressBar, Button, Intent, Classes } from '@blueprintjs/core';
import semver from 'semver';

import getServerUrl from '../libs/getServerUrl';
import { LATEST_SHELL_VERSION } from '../constants/versions';

const Card = ({
  app, managedApps, token,
}) => (
  <div className="col">
    <div className="pt-card pt-elevation-1" style={{ textAlign: 'center', padding: 12, position: 'relative' }}>
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
          margin: '0 0 8px',
        }}
      >
        {app.get('name')}
        <Button
          iconName="info-sign"
          className={Classes.MINIMAL}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
          }}
          onClick={() => ipcRenderer.send('open-in-browser', getServerUrl(`/apps/${app.get('slug')}/id${app.get('id')}`))}
        />
      </h5>
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
          const shouldUpdate = semver.lt(managedApps.getIn([app.get('id'), 'app', 'shellVersion']), LATEST_SHELL_VERSION)
                            || app.get('version') > managedApps.getIn([app.get('id'), 'app', 'version']);

          return [
            shouldUpdate ? (
              <Button
                key="update"
                text="Update"
                iconName="download"
                intent={Intent.SUCCESS}
                onClick={() => ipcRenderer.send('update-app', app.get('id'), managedApps.getIn([app.get('id'), 'app']).toJS(), token)}
              />
            ) : (
              <Button
                key="open"
                text="Open"
                onClick={() => ipcRenderer.send('open-app', app.get('id'), managedApps.getIn([app.get('id'), 'app', 'name']))}
              />
            ),
            <Button
              key="uninstall"
              text="Uninstall"
              iconName="trash"
              intent={Intent.DANGER}
              style={{ marginLeft: 6 }}
              onClick={() => ipcRenderer.send('uninstall-app', app.get('id'), managedApps.getIn([app.get('id'), 'app']).toObject())}
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
