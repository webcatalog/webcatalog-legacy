const { dialog, session, app } = require('electron');

const sendMessageToWindow = require('./sendMessageToWindow');

const clearBrowsingData = () => {
  dialog.showMessageBox({
    type: 'warning',
    buttons: ['Yes', 'Cancel'],
    defaultId: 1,
    title: 'Clear cache confirmation',
    message: `This will clear all data (cookies, local storage etc) from ${app.getName()}. Are you sure you wish to proceed?`,
  }, (response) => {
    if (response === 0) {
      const partitions = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i =>
        ((i === 0) ? 'persist:app' : `persist:app.${i}`),
      );

      partitions.forEach((partition) => {
        const s = session.fromPartition(partition);
        if (!s) return;
        s.clearStorageData((err) => {
          if (err) {
            sendMessageToWindow('log', `Clearing browsing data err: ${err.message}`);
            return;
          }
          sendMessageToWindow('log', 'Browsing data cleared.');
          sendMessageToWindow('reload');
        });
      });
    }
  });
};

module.exports = clearBrowsingData;
