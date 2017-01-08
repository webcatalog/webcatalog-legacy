/* global fetch execFile remote fs WindowsShortcuts https os */
import { batchActions } from 'redux-batched-actions';
import {
  SET_STATUS, ADD_APPS, ADD_APP_STATUS, REMOVE_APP_STATUS, RESET_APP,
  INSTALLED, INPROGRESS, LOADING, FAILED, DONE, NONE,
} from '../constants/actions';

import { search } from './search';

let fetching = false;

export const fetchApps = () => (dispatch, getState) => {
  const appState = getState().app;

  // All pages have been fetched => stop
  if (appState.totalPage && appState.currentPage + 1 === appState.totalPage) return;

  // Prevent redundant requests
  if (fetching) return;
  fetching = true;

  const currentPage = appState.currentPage + 1;

  dispatch({
    type: SET_STATUS,
    status: LOADING,
  });


  fetch(`https://backend.getwebcatalog.com/${currentPage}.json`)
    .then(response => response.json())
    .then(({ chunk, totalPage }) => {
      dispatch(batchActions([
        {
          type: SET_STATUS,
          status: DONE,
        },
        {
          type: ADD_APPS,
          chunk,
          currentPage,
          totalPage,
        },
      ]));
    })
    .catch(() => {
      dispatch({
        type: SET_STATUS,
        status: FAILED,
      });
    })
    .then(() => {
      fetching = false;
    });
};


export const installApp = app => (dispatch) => {
  dispatch({
    type: ADD_APP_STATUS,
    id: app.get('id'),
    status: INPROGRESS,
  });

  const iconExt = os.platform() === 'darwin' ? 'icns' : 'ico';

  const iconPath = `${remote.app.getPath('temp')}/${Math.floor(Date.now())}.${iconExt}`;
  const iconFile = fs.createWriteStream(iconPath);

  https.get(`https://backend.getwebcatalog.com/images/${app.get('id')}.${iconExt}`, (response) => {
    response.pipe(iconFile);


    iconFile.on('finish', () => {
      if (os.platform() === 'darwin') {
        execFile(`${remote.app.getAppPath()}/applify.sh`, [
          app.get('name'),
          app.get('url'),
          iconPath,
          app.get('id'),
        ], (err) => {
          if (err) {
            /* eslint-disable no-console */
            console.log(err);
            /* eslint-enable no-console */
            dispatch({
              type: REMOVE_APP_STATUS,
              id: app.get('id'),
            });
            return;
          }

          dispatch({
            type: ADD_APP_STATUS,
            id: app.get('id'),
            status: INSTALLED,
          });
        });
      } else {
        // Windows
        WindowsShortcuts.create(`${remote.app.getPath('home')}/AppData/Roaming/Microsoft/Windows/Start Menu/Programs/WebCatalog Apps/${app.get('name')}.lnk`, {
          target: '%userprofile%/AppData/Local/Programs/WebCatalog/WebCatalog.exe',
          args: `--name="${app.get('name')}" --url="${app.get('url')}" --id="${app.get('id')}"`,
          icon: iconPath,
          desc: app.get('id'),
        }, (err) => {
          if (err) {
            /* eslint-disable no-console */
            console.log(err);
            /* eslint-enable no-console */
            dispatch({
              type: REMOVE_APP_STATUS,
              id: app.get('id'),
            });
            return;
          }

          dispatch({
            type: ADD_APP_STATUS,
            id: app.get('id'),
            status: INSTALLED,
          });
        });
      }
    });
  });
};

const deleteFolderRecursive = (path) => {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file) => {
      const curPath = `${path}/${file}`;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};


export const uninstallApp = app => ((dispatch) => {
  dispatch({
    type: ADD_APP_STATUS,
    id: app.get('id'),
    status: INPROGRESS,
  });

  if (os.platform() === 'darwin') {
    const appPath = `${remote.app.getPath('home')}/Applications/WebCatalog Apps/${app.get('name')}.app`;
    deleteFolderRecursive(appPath);
  } else {
    const appPath = `${remote.app.getPath('home')}/AppData/Roaming/Microsoft/Windows/Start Menu/Programs/WebCatalog Apps/${app.get('name')}.lnk`;
    fs.unlinkSync(appPath);
  }

  dispatch({
    type: REMOVE_APP_STATUS,
    id: app.get('id'),
  });
});


export const scanInstalledApps = () => ((dispatch) => {
  if (os.platform() === 'darwin') {
    const allAppPath = `${remote.app.getPath('home')}/Applications/WebCatalog Apps`;
    fs.readdir(allAppPath, (err, files) => {
      if (err) return;

      files.forEach((fileName) => {
        if (fileName === '.DS_Store') return;
        const id = fs.readFileSync(`${allAppPath}/${fileName}/id`, 'utf8').trim();
        dispatch({
          type: ADD_APP_STATUS,
          id,
          status: INSTALLED,
        });
      });
    });
  } else {
    // Windows
    const allAppPath = `${remote.app.getPath('home')}/AppData/Roaming/Microsoft/Windows/Start Menu/Programs/WebCatalog Apps`;
    fs.readdir(allAppPath, (err, files) => {
      if (err) return;

      files.forEach((fileName) => {
        WindowsShortcuts.query(`${allAppPath}/${fileName}`, (wsShortcutErr, { desc }) => {
          dispatch({
            type: ADD_APP_STATUS,
            id: desc,
            status: INSTALLED,
          });
        });
      });
    });
  }
});

export const refresh = () => ((dispatch, getState) => {
  const state = getState();
  const searchStatus = state.search.status;
  const appStatus = state.app.status;
  if (searchStatus !== LOADING && searchStatus !== NONE) {
    dispatch(search());
  } else if (appStatus !== LOADING) {
    dispatch({ type: RESET_APP });
    dispatch(fetchApps());
  }
});
