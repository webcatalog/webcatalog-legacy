/* global fetch execFile remote fs https */
import { batchActions } from 'redux-batched-actions';
import {
  SET_STATUS, ADD_APPS, ADD_APP_STATUS, REMOVE_APP_STATUS,
  INSTALLED, INPROGRESS, LOADING, FAILED, DONE,
} from '../constants/actions';

let loading = false;

export const fetchApps = () => (dispatch, getState) => {
  const appState = getState().app;

  // All pages have been fetched => stop
  if (appState.totalPage && appState.currentPage + 1 === appState.totalPage) return;

  // Prevent run many times
  if (loading) return;

  loading = true;

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

      loading = false;
    })
    .catch(() => {
      dispatch({
        type: SET_STATUS,
        status: FAILED,
      });

      // prevent constantly retrying to connect
      setTimeout(() => {
        loading = false;
      }, 1000);
    });
};


export const installApp = app => (dispatch) => {
  dispatch({
    type: ADD_APP_STATUS,
    id: app.get('id'),
    status: INPROGRESS,
  });

  const iconPath = `${remote.app.getPath('temp')}/icon.icns`;
  const iconFile = fs.createWriteStream(iconPath);

  https.get(`https://backend.getwebcatalog.com/images/${app.get('id')}.icns`, (response) => {
    response.pipe(iconFile);

    iconFile.on('finish', () => {
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

  const appPath = `${remote.app.getPath('home')}/Applications/WebCatalog Apps/${app.get('name')}.app`;

  deleteFolderRecursive(appPath);

  dispatch({
    type: REMOVE_APP_STATUS,
    id: app.get('id'),
  });
});


export const scanInstalledApps = () => ((dispatch) => {
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
});
