/* eslint-disable no-console */
const path = require('path');

const createAppAsync = require('../lib');

const iconFileExt = process.platform === 'darwin' ? 'icns' : 'ico';

createAppAsync(
  'google-drive',
  'Google Drive',
  'https://drive.google.com',
  path.resolve(__dirname, `828296a5-0969-4a56-8e68-e188b03584b0.${iconFileExt}`),
  path.resolve(__dirname, 'dist'),
)
.then(destPath => console.log('Done', destPath))
.catch(err => console.log(err));
