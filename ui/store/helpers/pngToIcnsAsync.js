/* global sharp tmp icongen */

const iconSizes = [
  16, 32, 128, 256, 512, 1024,
];

const generateIconSet = (pngPath) => {
  const iconSetPath = tmp.dirSync().name;

  const promises = iconSizes.map(size =>
    new Promise((resolve, reject) => {
      sharp(pngPath)
        .resize(size, size)
        .toFile(`${iconSetPath}/${size}.png`, (err, info) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(info);
        });
    }));

  return Promise.all(promises)
    .then(() => iconSetPath);
};

const pngToIcnsAsync = pngPath =>
  generateIconSet(pngPath)
    .then((iconSetPath) => {
      const options = {
        type: 'png',
        report: false,
      };

      const distPath = tmp.dirSync().name;
      return icongen(iconSetPath, distPath, options)
        .then(() => `${distPath}/app.icns`);
    });

export default pngToIcnsAsync;
