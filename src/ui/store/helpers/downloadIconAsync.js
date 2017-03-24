/* global https fs tmp */

const downloadIconAsync = (appId) => {
  const pngDirPath = tmp.dirSync().name;
  const pngPath = `${pngDirPath}/${appId}.png`;

  return new Promise((resolve, reject) => {
    const iconFile = fs.createWriteStream(pngPath);

    const req = https.get(`https://cdn.rawgit.com/webcatalog/backend/compiled/images/${appId}.png`, (response) => {
      response.pipe(iconFile);

      iconFile.on('error', (err) => {
        reject(err);
      });

      iconFile.on('finish', () => {
        resolve(pngPath);
      });
    });

    req.on('error', (err) => {
      reject(err);
    });
  });
};

export default downloadIconAsync;
