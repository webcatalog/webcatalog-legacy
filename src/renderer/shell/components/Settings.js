import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dialog, Button, Intent, Switch } from '@blueprintjs/core';

import { toggleSettingDialog, setBehavior } from '../actions/settings';

const Settings = ({
  isOpen, swipeToNavigate, rememberLastPage, quitOnLastWindow,
  blockAds, customHome, injectedCSS, injectedJS, customUserAgent,
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
      {(process.env.PLATFORM === 'darwin') ? (
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
              <span> Restart is required.</span>
            </p>
          </div>
        </div>
      ) : null}

      {(process.env.PLATFORM === 'darwin') ? (
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
            Leave it blank to use {window.shellInfo.url} (default).
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

      <div className="pt-form-group">
        <label className="pt-label" htmlFor="customHome">
          Custom User Agent
        </label>
        <div className="pt-form-content">
          <input
            className="pt-input"
            style={{ width: 300 }}
            type="url"
            placeholder="Custom User Agent"
            value={customUserAgent || ''}
            required
            onChange={(e) => {
              const val = e.target.value;
              requestSetBehavior('customUserAgent', val);
            }}
          />
          <p className="pt-form-helper-text">
            <a
              onClick={() => {
                let val;
                switch (process.env.PLATFORM) {
                  case 'win32':
                    val = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36';
                    break;
                  case 'darwin':
                    val = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36';
                    break;
                  default:
                    val = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36';
                }
                requestSetBehavior('customUserAgent', val);
              }}
            >
              Chrome 57
            </a>
            <span> | </span>
            <a
              onClick={() => {
                let val;
                switch (process.env.PLATFORM) {
                  case 'win32':
                    val = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:53.0) Gecko/20100101 Firefox/53.0';
                    break;
                  case 'darwin':
                    val = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:53.0) Gecko/20100101 Firefox/53.0';
                    break;
                  default:
                    val = 'Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:53.0) Gecko/20100101 Firefox/53.0';
                }
                requestSetBehavior('customUserAgent', val);
              }}
            >
              Firefox 53
            </a>
            <span> | </span>
            <a
              onClick={() => {
                const val = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko';
                requestSetBehavior('customUserAgent', val);
              }}
            >
              IE 11
            </a>
            <span> | </span>
            <a
              onClick={() => {
                const val = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36 Edge/15.15063';
                requestSetBehavior('customUserAgent', val);
              }}
            >
              Edge 15
            </a>
            <span> | </span>
            <a
              onClick={() => {
                const val = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.1 Safari/603.1.30';
                requestSetBehavior('customUserAgent', val);
              }}
            >
              Safari 10.1
            </a>
          </p>
          <p className="pt-form-helper-text">
            <a
              onClick={() => {
                const val = 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5x build/mtc19t applewebkit/537.36 (KHTML, like Gecko) Chrome/51.0.2702.81 Mobile Safari/537.36';
                requestSetBehavior('customUserAgent', val);
              }}
            >
              Chrome for Android 51
            </a>
            <span> | </span>
            <a
              onClick={() => {
                const val = 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A5297c Safari/602.1';
                requestSetBehavior('customUserAgent', val);
              }}
            >
              Safari Mobile 10
            </a>
          </p>
          <p className="pt-form-helper-text">
            Set a custom user agent.
            Restart is required. Leave it blank to use default user agent.
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
  isOpen: PropTypes.bool.isRequired,
  swipeToNavigate: PropTypes.bool.isRequired,
  quitOnLastWindow: PropTypes.bool.isRequired,
  rememberLastPage: PropTypes.bool.isRequired,
  blockAds: PropTypes.bool.isRequired,
  customHome: PropTypes.string,
  injectedCSS: PropTypes.string,
  injectedJS: PropTypes.string,
  customUserAgent: PropTypes.string,
  requestToggleSettingDialog: PropTypes.func.isRequired,
  requestSetBehavior: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isOpen: state.settings.get('isOpen'),
  swipeToNavigate: state.settings.get('swipeToNavigate'),
  rememberLastPage: state.settings.get('rememberLastPage'),
  quitOnLastWindow: state.settings.get('quitOnLastWindow'),
  blockAds: state.settings.get('blockAds'),
  customHome: state.settings.get('customHome'),
  injectedCSS: state.settings.get('injectedCSS'),
  injectedJS: state.settings.get('injectedJS'),
  customUserAgent: state.settings.get('customUserAgent'),
});

const mapDispatchToProps = dispatch => ({
  requestToggleSettingDialog: () => dispatch(toggleSettingDialog()),
  requestSetBehavior: (name, val) => dispatch(setBehavior(name, val)),
});


export default connect(
  mapStateToProps, mapDispatchToProps,
)(Settings);
