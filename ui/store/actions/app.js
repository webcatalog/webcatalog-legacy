/* global fetch execFile remote fs WindowsShortcuts https os mkdirp */
import { batchActions } from 'redux-batched-actions';
import {
  SET_STATUS, ADD_APPS, ADD_APP_STATUS, REMOVE_APP_STATUS, RESET_APP, SET_INSTALLED_HITS,
  INSTALLED, INPROGRESS, LOADING, FAILED, DONE,
} from '../constants/actions';
import scanInstalledAsync from '../helpers/scanInstalledAsync';
import getAllAppPath from '../helpers/getAllAppPath';

import { search } from './search';
import { fetchInstalled } from './installed';

let fetching = false;

const allAppPath = getAllAppPath();

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


  fetch(`https://backend.getwebcatalog.com/apps/page/${currentPage}.json`)
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

  let iconExt;
  switch (os.platform()) {
    case 'darwin': {
      iconExt = 'icns';
      break;
    }
    case 'linux': {
      iconExt = 'png';
      break;
    }
    case 'win32':
    default: {
      iconExt = 'ico';
    }
  }

  const iconPath = `${remote.app.getPath('temp')}/${Math.floor(Date.now())}.${iconExt}`;
  const iconFile = fs.createWriteStream(iconPath);

  https.get(`https://backend.getwebcatalog.com/images/${app.get('id')}.${iconExt}`, (response) => {
    response.pipe(iconFile);


    iconFile.on('finish', () => {
      switch (os.platform()) {
        case 'darwin':
        case 'linux': {
          execFile(`${remote.app.getAppPath()}/scripts/applify-${os.platform()}.sh`, [
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
          break;
        }
        case 'win32':
        default: {
          if (!fs.existsSync(allAppPath)) {
            mkdirp.sync(allAppPath);
          }

          WindowsShortcuts.create(`${allAppPath}/${app.get('name')}.lnk`, {
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


export const uninstallApp = app => ((dispatch, getState) => {
  dispatch({
    type: ADD_APP_STATUS,
    id: app.get('id'),
    status: INPROGRESS,
  });

  switch (os.platform()) {
    case 'darwin': {
      const appPath = `${allAppPath}/${app.get('name')}.app`;
      deleteFolderRecursive(appPath);
      break;
    }
    case 'linux': {
      const appPath = `${allAppPath}/${app.get('id')}.desktop`;
      fs.unlinkSync(appPath);
      break;
    }
    case 'win32':
    default: {
      const appPath = `${allAppPath}/${app.get('name')}.lnk`;
      fs.unlinkSync(appPath);
    }
  }

  dispatch({
    type: REMOVE_APP_STATUS,
    id: app.get('id'),
  });

  // update installed page
  const { installed } = getState();
  if (installed.status !== LOADING && installed.hits && installed.hits.size > 0) {
    dispatch({
      type: SET_INSTALLED_HITS,
      hits: installed.hits.filter(hit => (hit.get('id') !== app.get('id'))),
    });
  }
});


export const scanInstalledApps = () => ((dispatch) => {
  scanInstalledAsync(allAppPath)
    .then((installedIds) => {
      installedIds.forEach((id) => {
        dispatch({
          type: ADD_APP_STATUS,
          id,
          status: INSTALLED,
        });
      });
    });
});

export const refresh = pathname => ((dispatch, getState) => {
  const state = getState();
  if (pathname === '/search' && state.search.status !== LOADING) {
    dispatch(search());
  } else if (pathname === '/installed' && state.installed.status !== LOADING) {
    dispatch(fetchInstalled());
  } else if (state.app.status !== LOADING) {
    dispatch({ type: RESET_APP });
    dispatch(fetchApps());
  }
});
