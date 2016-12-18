/* global fetch exec remote fs https */
import {
  SET_STATUS, ADD_APPS, ADD_APP_STATUS, REMOVE_APP_STATUS, INSTALLED, INPROGRESS,
} from '../constants/actions';

export const fetchApps = () => ((dispatch, getState) => {
  const appState = getState().app;

  // All pages have been fetched => stop
  if (appState.totalPage && appState.currentPage + 1 === appState.totalPage) return;

  const currentPage = appState.currentPage ? appState.currentPage + 1 : 0;

  fetch(`https://backend.getwebcatalog.com/${currentPage}.json`)
    .then(response => response.json())
    .then(({ chunk, totalPage }) => {
      dispatch({
        type: SET_STATUS,
        status: 'done',
      });
      dispatch({
        type: ADD_APPS,
        chunk,
        currentPage,
        totalPage,
      });
    });
});


export const installApp = app => ((dispatch) => {
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
      const cmd = `${remote.app.getAppPath()}/applify.sh "${app.get('name')}" "${app.get('url')}" "${iconPath}" "${app.get('id')}"`;

      exec(cmd, (err) => {
        if (!err) {
          dispatch({
            type: ADD_APP_STATUS,
            id: app.get('id'),
            status: INSTALLED,
          });
        }
      });
    });
  });
});

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
