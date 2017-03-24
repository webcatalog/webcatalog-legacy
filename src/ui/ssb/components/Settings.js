/* global os argv */
import React from 'react';
import { connect } from 'react-redux';
import { Dialog, Button, Intent, Switch } from '@blueprintjs/core';

import { toggleSettingDialog, setBehavior } from '../actions/settings';

const Settings = ({
  isOpen, swipeToNavigate, rememberLastPage, quitOnLastWindow,
  blockAds, customHome,
  requestToggleSettingDialog, requestSetBehavior,
}) => (
  <Dialog
    iconName="cog"
    isOpen={isOpen}
    onClose={() => requestToggleSettingDialog()}
    title="Settings"
  >
    <div className="pt-dialog-body">
      {(os.platform() === 'darwin') ? (
        <div className="pt-form-group">
          <div className="pt-form-content">
            <Switch
              checked={swipeToNavigate}
              label="Swipe to Navigate"
              onChange={e => requestSetBehavior('swipeToNavigate', e.target.checked)}
              key="swipeToNavigate"
            />
            <p key="swipeToNavigateDesc" className="pt-form-helper-text">
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

      {(os.platform() === 'darwin') ? (
        <div className="pt-form-group">
          <div className="pt-form-content">
            <Switch
              checked={quitOnLastWindow}
              label="Quit when last window is closed"
              onChange={e => requestSetBehavior('quitOnLastWindow', e.target.checked)}
              key="quitOnLastWindow"
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
            key="blockAds"
          />
          <p className="pt-form-helper-text" key="blockAdsDesc">
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
            key="rememberLastPage"
          />
          <p className="pt-form-helper-text" key="rememberLastPageDesc">
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
            onInput={(e) => {
              const val = e.target.value.length > 0 ? e.target.value : null;
              requestSetBehavior('customHome', val);
            }}
          />
          <p className="pt-form-helper-text" key="rememberLastPageDesc">
            Set home page to a custom URL.
            Leave it blank to use {argv.url} (default).
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
  requestToggleSettingDialog: React.PropTypes.func,
  requestSetBehavior: React.PropTypes.func,
};

const mapStateToProps = state => ({
  isOpen: state.settings.isOpen,
  swipeToNavigate: state.settings.behaviors.swipeToNavigate,
  rememberLastPage: state.settings.behaviors.rememberLastPage,
  quitOnLastWindow: state.settings.behaviors.quitOnLastWindow,
  blockAds: state.settings.behaviors.blockAds,
  customHome: state.settings.behaviors.customHome,
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
