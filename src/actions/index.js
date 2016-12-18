/* global fetch exec remote fs https */
import Immutable from 'immutable';

import {
  UPDATE_APP,
} from '../constants/actions';

export const fetchApps = () => ((dispatch, getState) => {
  const appState = getState().app;

  // All pages have been fetched => stop
  if (appState.totalPage && appState.currentPage + 1 === appState.totalPage) return;

  const currentPage = appState.currentPage ? appState.currentPage + 1 : 0;

  fetch(`https://backend.getwebcatalog.com/${currentPage}.json`)
    .then(response => response.json())
    .then((result) => {
      let apps;
      if (appState.apps) {
        apps = appState.apps.concat(Immutable.fromJS(result.chunk));
      } else {
        apps = Immutable.fromJS(result.chunk);
      }

      dispatch({
        type: UPDATE_APP,
        apps,
        status: 'done',
        currentPage,
        totalPage: result.totalPage,
      });
    });
});


export const installApp = app => (() => {
  const iconPath = `${remote.app.getPath('temp')}/icon.icns`;
  const iconFile = fs.createWriteStream(iconPath);

  https.get(`https://backend.getwebcatalog.com/images/${app.get('id')}.icns`, (response) => {
    response.pipe(iconFile);

    iconFile.on('finish', () => {
      const cmd = `${remote.app.getAppPath()}/applify.sh "${app.get('name')}" "${app.get('url')}" "${iconPath}"`;

      exec(cmd);
    });
  });
});
