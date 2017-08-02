/* eslint-disable no-console */
const path = require('path');

const createAppAsync = require('../lib');

createAppAsync(
  'google-drive',
  'Google Drive',
  'https://drive.google.com',
  path.resolve(__dirname, '828296a5-0969-4a56-8e68-e188b03584b0.icns'),
  path.resolve(__dirname, 'dist'),
)
.then(() => console.log('ok'))
.catch(err => console.log(err));
