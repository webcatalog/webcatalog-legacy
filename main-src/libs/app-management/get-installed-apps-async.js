/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const { app } = require('electron');
const path = require('path');
const fsExtra = require('fs-extra');

const { getPreference } = require('../preferences');
const sendToAllWindows = require('../send-to-all-windows');

const getInstalledAppsAsync = () => {
  sendToAllWindows('clean-app-management');

  const installationPath = getPreference('installationPath').replace('~', app.getPath('home'));

  return Promise.resolve()
    .then(() => {
      const apps = [];

      if (fsExtra.pathExistsSync(installationPath)) {
        return fsExtra.readdir(installationPath, { withFileTypes: true })
          .then((files) => {
            files.forEach((file) => {
              if (!file.isDirectory()) return;
              const fileName = file.name;

              const resourcesPath = process.platform === 'darwin'
                ? path.join(installationPath, fileName, 'Contents', 'Resources')
                : path.join(installationPath, fileName, 'resources');

              const packageJsonPath = path.join(resourcesPath, 'app.asar.unpacked', 'package.json');

              const appJsonPath = path.join(resourcesPath, 'app.asar.unpacked', 'build', 'app.json');
              const iconPath = path.join(resourcesPath, 'app.asar.unpacked', 'build', 'icon.png');

              let version = '0.0.0';
              let appJson;
              let icon;
              let lastUpdated = 0;

              if (fsExtra.pathExistsSync(appJsonPath)) {
                lastUpdated = Math.floor(fsExtra.statSync(appJsonPath).mtimeMs);
                appJson = fsExtra.readJSONSync(appJsonPath);
              } else {
                // if app.json doesn't exist then skip the app
                return;
              }

              if (fsExtra.pathExistsSync(packageJsonPath)) {
                try {
                  version = fsExtra.readJSONSync(packageJsonPath).version;
                } catch (err) {
                  // eslint-disable-next-line no-console
                  console.log(err);
                }
              }

              if (fsExtra.pathExistsSync(iconPath)) {
                icon = iconPath;
              }

              const appObj = Object.assign(appJson, {
                version,
                icon,
                engine: appJson.engine || 'electron',
                status: 'INSTALLED',
                lastUpdated,
              });
              apps.push(appObj);
            });
          })
          .then(() => apps);
      }

      return apps;
    })
    .then((apps) => {
      sendToAllWindows('set-app-batch', apps);
      sendToAllWindows('set-scanning-for-installed', false);
    });
};

module.exports = getInstalledAppsAsync;
