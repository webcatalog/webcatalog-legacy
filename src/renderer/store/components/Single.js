import { ipcRenderer } from 'electron';
import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Spinner, ProgressBar, Button, Intent, Classes } from '@blueprintjs/core';
import semver from 'semver';
import classNames from 'classnames';

import getServerUrl from '../libs/getServerUrl';
import { LATEST_SHELL_VERSION } from '../constants/versions';

import { setCategory } from '../actions/home';
import { goBack, setRoute } from '../actions/route';
import { fetchSingleApp } from '../actions/single';

import NoConnection from './NoConnection';

class Single extends React.Component {
  componentDidMount() {
    const { requestFetchSingleApp, app } = this.props;

    requestFetchSingleApp(app.get('id'));
  }

  render() {
    const {
      app, isFailed, managedApps, token, requestGoBack,
      requestLoadCategory, requestFetchSingleApp,
    } = this.props;

    const wikipediaTitle = app.get('wikipediaTitle') || app.get('name');

    const backButton = (
      <Button
        iconName="chevron-left"
        className={classNames(
          Classes.LARGE,
          Classes.MINIMAL,
        )}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        text="Back"
        onClick={() => requestGoBack()}
      />
    );

    if (!app.get('name')) {
      if (isFailed) {
        return (
          <div
            style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}
          >
            {backButton}
            <NoConnection handleClick={() => requestFetchSingleApp(app.get('id'))} />
          </div>
        );
      }

      return (
        <div
          style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}
        >
          {backButton}
          <Spinner className={Classes.LARGE} />
        </div>
      );
    }

    return (
      <div
        style={{ flex: 1, overflow: 'auto', padding: 12, textAlign: 'center', position: 'relative' }}
      >
        {backButton}
        <img
          src={getServerUrl(`/s3/${app.get('id')}.webp`)}
          role="presentation"
          alt={app.get('name')}
          style={{
            height: 128,
            width: 128,
            marginBottom: 8,
          }}
        />
        <h3
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 'normal',
            whiteSpace: 'nowrap',
            margin: '0 0 8px',
          }}
        >
          {app.get('name')}
        </h3>
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
                  className={Classes.LARGE}
                  intent={Intent.SUCCESS}
                  onClick={() => ipcRenderer.send('update-app', app.get('id'), managedApps.getIn([app.get('id'), 'app']).toJS(), token)}
                />
              ) : (
                <Button
                  key="open"
                  text="Open"
                  className={Classes.LARGE}
                  onClick={() => ipcRenderer.send('open-app', app.get('id'), managedApps.getIn([app.get('id'), 'app', 'name']))}
                />
              ),
              <Button
                key="uninstall"
                text="Uninstall"
                iconName="trash"
                className={Classes.LARGE}
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
              className={Classes.LARGE}
              intent={Intent.PRIMARY}
              onClick={() => ipcRenderer.send('install-app', app.get('id'), token)}
            />
          );
        })()}
        {app.get('url') ? (
          <p
            style={{
              marginTop: 12,
              marginBottom: 8,
              lineHeight: '1em',
              fontSize: 16,
            }}
          >
            <span>Website: </span>
            <a onClick={() => ipcRenderer.send('open-in-browser', app.get('url'))}>
              {app.get('url')}
            </a>
          </p>
        ) : null}
        {app.get('category') ? (
          <p
            style={{
              marginBottom: 16,
              lineHeight: '1em',
              fontSize: 16,
            }}
          >
            <span>Category: </span>
            <a className="category-text" onClick={() => requestLoadCategory(app.get('category'))}>
              {app.get('category').replace('+', ' & ')}
            </a>
          </p>
        ) : null}

        {app.get('description') ? (
          <p
            style={{
              textAlign: 'left',
              lineHeight: '1.5em',
              fontSize: 15,
            }}
          >
            {app.get('description')} <a onClick={() => ipcRenderer.send('open-in-browser', `https://en.wikipedia.org/wiki/${encodeURIComponent(wikipediaTitle)}`)}>Wikipedia</a>
          </p>
        ) : null}
      </div>
    );
  }
}

Single.propTypes = {
  app: PropTypes.instanceOf(Immutable.Map).isRequired,
  isFailed: PropTypes.bool.isRequired,
  managedApps: PropTypes.instanceOf(Immutable.Map).isRequired,
  token: PropTypes.string.isRequired,
  requestFetchSingleApp: PropTypes.func.isRequired,
  requestGoBack: PropTypes.func.isRequired,
  requestLoadCategory: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  app: state.single.get('app'),
  isFailed: state.single.get('isFailed'),
  managedApps: state.appManagement.get('managedApps'),
  token: state.auth.get('token'),
});

const mapDispatchToProps = dispatch => ({
  requestFetchSingleApp: id => dispatch(fetchSingleApp(id)),
  requestGoBack: () => dispatch(goBack()),
  requestLoadCategory: (category) => {
    dispatch(setCategory(category));
    dispatch(setRoute('home'));
  },
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(Single);
