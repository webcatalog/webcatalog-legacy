const fs = require('fs');
const sharp = require('sharp');
const algoliasearch = require('algoliasearch');
const mkdirp = require('mkdirp');
const ejs = require('ejs');

const convertToIcns = require('./convertToIcns');
const convertToIco = require('./convertToIco');

const imageDataPath = './data/images';
const jsonDataPath = './data/json';

const targetPath = './www';
const imageTargetPath = `${targetPath}/images`;
const appPageTargetPath = `${targetPath}/apps/page`;

const numberOfAppInChunk = 24;

// released version
// do not need to change, auto updater is now handled using electron-builder + GitHub Release
const latestVersion = '3.1.1';

// init target folders
mkdirp.sync(imageTargetPath);
mkdirp.sync(appPageTargetPath);

const jsonFiles = fs.readdirSync(jsonDataPath);

const chunks = [[]];

let count = 0;
let chunkIndex = 0;

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

  // Add Data to chunk
  if (count === numberOfAppInChunk) {
    chunkIndex += 1;
    chunks[chunkIndex] = [];
    count = 0;
  }
  const dataStr = fs.readFileSync(`${jsonDataPath}/${id}.json`, 'utf8');
  const app = JSON.parse(dataStr);
  app.id = id;

  chunks[chunkIndex].push(app);
  count += 1;

  apps.push(app);
});


chunks.forEach((chunk, i) => {
  const data = {
    totalPage: chunks.length,
    chunk,
  };

  // generate app page
  fs.writeFile(`${appPageTargetPath}/${i}.json`, JSON.stringify(data), (err) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
  });
});

// warning.
const oldVersionCaution = {
  totalPage: 1,
  chunk: [
    {
      name: 'This version is no longer supported. Go to getwebcatalog.com to download the latest version.',
      url: 'https://getwebcatalog.com',
      id: 'old-version-caution',
    },
  ],
};
fs.writeFile(`${targetPath}/0.json`, JSON.stringify(oldVersionCaution), (err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
});


// update server
fs.writeFile(`${targetPath}/latest.json`, JSON.stringify({ version: latestVersion }), (err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
});

// algolia
if (!process.env.ALGOLIA_API_KEY || !process.env.ALGOLIA_APPLICATION_ID) {
  console.log('Missing Algolia info >> Skip Algolia');
} else {
  const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_API_KEY);
  const index = client.initIndex('webcatalog');

  // set object id
  const algoliaApps = apps.map((a) => {
    const app = a;
    app.objectID = app.id;
    return app;
  });

  index.addObjects(algoliaApps, (err) => {
    if (err) {
      console.error(err);
    }
  });
}


// create 404
fs.createReadStream('./src/404.html').pipe(fs.createWriteStream('./www/404.html'));

// create simple catalog index.html
const ejsTemplate = fs.readFileSync('./src/index.ejs', 'utf8');
fs.writeFileSync('./www/index.html', ejs.render(ejsTemplate, { apps }));
