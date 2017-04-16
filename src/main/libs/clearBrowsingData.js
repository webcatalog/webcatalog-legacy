const { dialog, session } = require('electron');
const sendMessageToWindow = require('./sendMessageToWindow');

const clearBrowsingData = ({ appName, appId }) => {
  dialog.showMessageBox({
    type: 'warning',
    buttons: ['Yes', 'Cancel'],
    defaultId: 1,
    title: 'Clear cache confirmation',
    message: `This will clear all data (cookies, local storage etc) from ${appName}. Are you sure you wish to proceed?`,
  }, (response) => {
    if (response === 0) {
      const s = session.fromPartition(`persist:${appId}`);
      s.clearStorageData((err) => {
        if (err) {
          sendMessageToWindow('log', `Clearing browsing data err: ${err.message}`);
          return;
        }
        sendMessageToWindow('log', `Browsing data of ${appId} cleared.`);
        sendMessageToWindow('reload');
      });
    }
  });
};

module.exports = clearBrowsingData;
