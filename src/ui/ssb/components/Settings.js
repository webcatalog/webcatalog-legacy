import { remote } from 'electron';
import React from 'react';
import { connect } from 'react-redux';
import { Dialog, Button, Intent, Switch } from '@blueprintjs/core';

import { toggleSettingDialog, setBehavior } from '../actions/settings';

const appInfo = remote.getCurrentWindow().appInfo;

const Settings = ({
  isOpen, swipeToNavigate, rememberLastPage, quitOnLastWindow,
  blockAds, customHome, injectedCSS, injectedJS,
  requestToggleSettingDialog, requestSetBehavior,
}) => (
  <Dialog
    iconName="cog"
    isOpen={isOpen}
    onClose={() => requestToggleSettingDialog()}
    title="Settings"
    className="settings-dialog"
  >
    <div className="pt-dialog-body">
      {(remote.require('os').platform() === 'darwin') ? (
        <div className="pt-form-group">
          <div className="pt-form-content">
            <Switch
              checked={swipeToNavigate}
              label="Swipe to Navigate"
              onChange={e => requestSetBehavior('swipeToNavigate', e.target.checked)}
            />
            <p className="pt-form-helper-text">
              <span>Navigate between pages with 3-finger gesture. You need to change </span>
              <strong>Preferences &gt; Trackpad &gt; More Gesture &gt; Swipe between page</strong>
              <span> to </span>
              <strong>Swipe with three fingers</strong>
              <span> or </span>
              <strong>Swipe with two or three fingers</strong>.
            </p>
          </div>
        </div>
      ) : null}

      {(remote.require('os').platform() === 'darwin') ? (
        <div className="pt-form-group">
          <div className="pt-form-content">
            <Switch
              checked={quitOnLastWindow}
              label="Quit when last window is closed"
              onChange={e => requestSetBehavior('quitOnLastWindow', e.target.checked)}
            />
          </div>
        </div>
      ) : null}

      <div className="pt-form-group">
        <div className="pt-form-content">
          <Switch
            checked={blockAds}
            label="Block ads & tracking"
            onChange={e => requestSetBehavior('blockAds', e.target.checked)}
          />
          <p className="pt-form-helper-text">
            Restart is required.
          </p>
        </div>
      </div>

      <div className="pt-form-group">
        <div className="pt-form-content">
          <Switch
            checked={rememberLastPage}
            label="Remember the last page you open"
            onChange={e => requestSetBehavior('rememberLastPage', e.target.checked)}
          />
          <p className="pt-form-helper-text">
            <span>Remember the last page you open and automatically go to</span>
            <span> the page the next time you open an app installed from WebCatalog.</span>
          </p>
        </div>
      </div>

      <div className="pt-form-group">
        <label className="pt-label" htmlFor="customHome">
          Custom Home URL
        </label>
        <div className="pt-form-content">
          <input
            className="pt-input"
            style={{ width: 300 }}
            type="url"
            placeholder="Custom Home URL"
            value={customHome || ''}
            required
            onChange={(e) => {
              const val = e.target.value;
              requestSetBehavior('customHome', val);
            }}
          />
          <p className="pt-form-helper-text">
            Set home page to a custom URL.
            Leave it blank to use {appInfo.url} (default).
          </p>
        </div>
      </div>

      <div className="pt-form-group">
        <label className="pt-label" htmlFor="injectedCSS">
          Injected CSS
        </label>
        <div className="pt-form-content">
          <textarea
            className="pt-input"
            style={{ width: 300 }}
            dir="auto"
            value={injectedCSS || ''}
            onChange={(e) => {
              const val = e.target.value.length > 0 ? e.target.value : null;
              requestSetBehavior('injectedCSS', val);
            }}
          />
          <p className="pt-form-helper-text">
            Restart is required. Leave it blank if you do not want to inject anything.
          </p>
        </div>
      </div>

      <div className="pt-form-group">
        <label className="pt-label" htmlFor="injectedCSS">
          Injected JS
        </label>
        <div className="pt-form-content">
          <textarea
            className="pt-input"
            style={{ width: 300 }}
            dir="auto"
            value={injectedJS || ''}
            onChange={(e) => {
              const val = e.target.value.length > 0 ? e.target.value : null;
              requestSetBehavior('injectedJS', val);
            }}
          />
          <p className="pt-form-helper-text">
            Restart is required. Leave it blank if you do not want to inject anything.
          </p>
        </div>
      </div>
    </div>
    <div className="pt-dialog-footer">
      <div className="pt-dialog-footer-actions">
        <Button text="Close" intent={Intent.PRIMARY} onClick={() => requestToggleSettingDialog()} />
      </div>
    </div>
  </Dialog>
);

Settings.propTypes = {
  isOpen: React.PropTypes.bool,
  swipeToNavigate: React.PropTypes.bool,
  quitOnLastWindow: React.PropTypes.bool,
  rememberLastPage: React.PropTypes.bool,
  blockAds: React.PropTypes.bool,
  customHome: React.PropTypes.string,
  injectedCSS: React.PropTypes.string,
  injectedJS: React.PropTypes.string,
  requestToggleSettingDialog: React.PropTypes.func,
  requestSetBehavior: React.PropTypes.func,
};

const mapStateToProps = state => ({
  isOpen: state.settings.get('isOpen'),
  swipeToNavigate: state.settings.getIn(['behaviors', 'swipeToNavigate']),
  rememberLastPage: state.settings.getIn(['behaviors', 'rememberLastPage']),
  quitOnLastWindow: state.settings.getIn(['behaviors', 'quitOnLastWindow']),
  blockAds: state.settings.getIn(['behaviors', 'blockAds']),
  customHome: state.settings.getIn(['behaviors', 'customHome']),
  injectedCSS: state.settings.getIn(['behaviors', 'injectedCSS']),
  injectedJS: state.settings.getIn(['behaviors', 'injectedJS']),
});

const mapDispatchToProps = dispatch => ({
  requestToggleSettingDialog: () => {
    dispatch(toggleSettingDialog());
  },
  requestSetBehavior: (name, val) => {
    // save to state & electron-settings
    dispatch(setBehavior(name, val));
  },
});


export default connect(
  mapStateToProps, mapDispatchToProps,
)(Settings);
