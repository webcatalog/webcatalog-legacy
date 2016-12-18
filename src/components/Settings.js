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
