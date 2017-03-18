const fs = require('fs');
const sharp = require('sharp');
const algoliasearch = require('algoliasearch');
const mkdirp = require('mkdirp');
const { chunk } = require('lodash');

const convertToIcns = require('./convertToIcns');
const convertToIco = require('./convertToIco');

const imageDataPath = './data/images';
const jsonDataPath = './data/json';

const targetPath = './www';
const imageTargetPath = `${targetPath}/images`;

// init target folders
mkdirp.sync(imageTargetPath);

const jsonFiles = fs.readdirSync(jsonDataPath);

const apps = [];

jsonFiles.forEach((fileName) => {
  // Remove .json from filename to get app id
  const id = fileName.replace('.json', '');

  // Generate WebP & PNG
  sharp(`${imageDataPath}/${id}.png`)
    .toFile(`${imageTargetPath}/${id}.png`, (err) => {
      if (err) {
        console.log(`${imageDataPath}/${id}.png`);
        console.log(err);
        process.exit(1);
      }
    })
    .toFile(`${imageTargetPath}/${id}.webp`, (err) => {
      if (err) {
        console.log(`${imageDataPath}/${id}.webp`);
        console.log(err);
        process.exit(1);
      }
    })
    .resize(128, 128)
    .toFile(`${imageTargetPath}/${id}@128px.webp`, (err) => {
      if (err) {
        console.log(`${imageDataPath}/${id}@128px.webp`);
        console.log(err);
        process.exit(1);
      }
    });

  // Generate ICNS
  convertToIcns(`${imageDataPath}/${id}.png`, `${imageTargetPath}/${id}.icns`, (err) => {
    if (err) {
      console.log(`${imageDataPath}/${id}.icns`);
      console.log(err);
      process.exit(1);
      return;
    }
    console.log(`${id}.png is converted to ${id}.icns`);
  });

  // Generate ICO
  convertToIco(`${imageDataPath}/${id}.png`, `${imageTargetPath}/${id}.ico`, (err) => {
    if (err) {
      console.log(`${imageDataPath}/${id}.ico`);
      console.log(err);
      process.exit(1);
      return;
    }
    console.log(`${id}.png is converted to ${id}.ico`);
  });

  const dataStr = fs.readFileSync(`${jsonDataPath}/${id}.json`, 'utf8');
  const app = JSON.parse(dataStr);
  app.id = id;

  apps.push(app);
});

// algolia
if (!process.env.ALGOLIA_API_KEY || !process.env.ALGOLIA_APPLICATION_ID) {
  console.log('Missing Algolia info >> Skip Algolia');
} else {
  console.log('Algolia: start.');
  // set object id
  const algoliaApps = apps.map((a) => {
    const app = a;
    app.objectID = app.id;
    return app;
  });

  const TEMP_INDEX = 'webcatalog_temp';
  const PROD_INDEX = 'webcatalog';

  const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_API_KEY);
  const index = client.initIndex(TEMP_INDEX);

  // https://www.algolia.com/doc/faq/index-configuration/how-can-i-update-all-the-objects-of-my-index/

  index.setSettings({ customRanking: ['asc(name)'] }, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    const promises = chunk(algoliaApps, 50).map((appChunk, appChunkIndex) =>
      new Promise((resolve, reject) => {
        console.log(`Algolia: Adding chunk ${appChunkIndex}`);
        index.addObjects(appChunk, (addObjectsErr) => {
          if (addObjectsErr) {
            reject(addObjectsErr);
            return;
          }
          resolve();
        });
      }));

    Promise.all(promises)
      .then(() => {
        client.moveIndex(TEMP_INDEX, PROD_INDEX, (moveIndexErr) => {
          if (moveIndexErr) {
            console.error(moveIndexErr);
            process.exit(1);
            return;
          }
          console.log('Algolia: done.');
        });
      })
      .catch((pErr) => {
        console.log(pErr);

        // delete temp index
        client.deleteIndex(TEMP_INDEX, (delErr) => {
          if (!delErr) {
            console.log('delete temp index successfully');
          }
        });

        process.exit(1);
      });
  });
}
