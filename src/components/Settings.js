/* global os */
import React from 'react';
import { connect } from 'react-redux';
import { Dialog, Button, Intent, Switch } from '@blueprintjs/core';

import { toggleSettingDialog, setBehavior } from '../actions/settings';

const Settings = ({
  isOpen, swipeToNavigate,
  requestToggleSettingDialog, requestSetBehavior,
}) => (
  <Dialog
    iconName="cog"
    isOpen={isOpen}
    onClose={() => requestToggleSettingDialog()}
    title="Settings"
  >
    <div className="pt-dialog-body">
      {(os.platform() === 'darwin') ? [
        <Switch
          checked={swipeToNavigate}
          label="Swipe to Navigate"
          onChange={e => requestSetBehavior('swipeToNavigate', e.target.checked)}
        />,
        <p>
          <span>Navigate between pages with 3-finger gesture. You need to change </span>
          <strong>Preferences &gt; Trackpad &gt; More Gesture &gt; Swipe between page</strong>
          <span> to </span>
          <strong>Swipe with three fingers</strong>
          <span> or </span>
          <strong>Swipe with two or three fingers</strong>.
        </p>,
      ] : null}
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
  requestToggleSettingDialog: React.PropTypes.func,
  requestSetBehavior: React.PropTypes.func,
};

const mapStateToProps = state => ({
  isOpen: state.settings.isOpen,
  swipeToNavigate: state.settings.behaviors.swipeToNavigate,
});

const mapDispatchToProps = dispatch => ({
  requestToggleSettingDialog: () => {
    dispatch(toggleSettingDialog());
  },
  requestSetBehavior: (name, val) => {
    dispatch(setBehavior(name, val));
  },
});


export default connect(
  mapStateToProps, mapDispatchToProps,
)(Settings);
