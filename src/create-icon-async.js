const fileType = require('file-type');
const icongen = require('icon-gen');
const Jimp = require('jimp');
const path = require('path');
const readChunk = require('read-chunk');

const getExpectedIconFileExt = () => {
  switch (process.platform) {
    case 'darwin': return 'icns';
    case 'win32': return 'ico';
    default: return 'png';
  }
};

const createIconAsync = (inputPath, outputDirPath) => {
  const buffer = readChunk.sync(inputPath, 0, 4100);

  const type = fileType(buffer);
  const inputFormat = type.ext;

  const expectedFormat = getExpectedIconFileExt();

  if (inputFormat !== 'png') {
    return Promise.reject(new Error('Input format is not supported.'));
  }

  if (expectedFormat === 'png') return Promise.resolve(inputPath);

  const sizes = expectedFormat === 'icns'
    ? [16, 24, 32, 48, 64, 128, 256, 512, 1024] // icns
    : [16, 24, 32, 48, 64, 128, 256]; // ico

  return Promise.resolve()
    .then(() => Jimp.read(inputPath))
    .then((img) => {
      const p = sizes.map(size =>
        new Promise((resolve) => {
          img
            .clone()
            .resize(size, size)
            .quality(100)
            .write(path.join(outputDirPath, `${size}.png`), resolve);
        }));

      return Promise.all(p);
    })
    .then(() => icongen(outputDirPath, outputDirPath, { type: 'png', modes: [expectedFormat] }))
    .then(results => results[0]);
};

module.exports = createIconAsync;
