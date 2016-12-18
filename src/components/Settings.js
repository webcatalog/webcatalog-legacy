/* global ipcRenderer */
import React from 'react';
import { connect } from 'react-redux';
import { Dialog, Button, Intent } from '@blueprintjs/core';

import { toggleSettingDialog } from '../actions/settings';

const Settings = ({ isOpen, requestToggleSettingDialog }) => (
  <Dialog
    iconName="cog"
    isOpen={isOpen}
    onClose={() => requestToggleSettingDialog()}
    title="Settings"
  >
    <div className="pt-dialog-body">
      <p>The initial width & height used for new apps installed from WebCatalog.</p>
      <label htmlFor="windowWidth" className="pt-label pt-inline">
        Initial window width
        <div className="pt-input-group">
          <span className="pt-icon pt-icon-column-layout" />
          <input
            className="pt-input"
            style={{ width: 200 }}
            type="text"
            placeholder="Initial window width"
            dir="auto"
            name="windowWidth"
          />
        </div>
      </label>
      <label htmlFor="windowHeight" className="pt-label pt-inline">
        Initial window height
        <div className="pt-input-group">
          <span className="pt-icon pt-icon-column-layout" />
          <input
            className="pt-input"
            style={{ width: 200 }}
            type="text"
            placeholder="Initial window height"
            dir="auto"
            name="windowHeight"
          />
        </div>
      </label>
      <p>All settings are automatically saved.</p>
      <hr />
      <Button
        text="Clear browsing data"
        intent={Intent.DANGER}
        onClick={() => ipcRenderer.send('clearAppData')}
        style={{ marginBottom: 6 }}
      />
      <p>Affects all apps installed from WebCatalog.</p>
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
  requestToggleSettingDialog: React.PropTypes.func,
};

const mapStateToProps = state => ({
  isOpen: state.settings.isOpen,
});

const mapDispatchToProps = dispatch => ({
  requestToggleSettingDialog: () => {
    dispatch(toggleSettingDialog());
  },
});


export default connect(
  mapStateToProps, mapDispatchToProps,
)(Settings);
