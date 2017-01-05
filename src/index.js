const fs = require('fs');
const sharp = require('sharp');
const algoliasearch = require('algoliasearch');
const mkdirp = require('mkdirp');


const convertToIcns = require('./convertToIcns');

const imageDataPath = './data/images';
const jsonDataPath = './data/json';

const targetPath = './www';
const imageTargetPath = `${targetPath}/images`;
const updateTargetPath = `${targetPath}/update/darwin`;

const numberOfAppInChunk = 24;

// released versions
const versions = ['2.3.0', '2.2.0', '2.1.0', '2.0.2', '2.0.1', '2.0.0'];

// init target folders
mkdirp.sync(imageTargetPath);
mkdirp.sync(updateTargetPath);

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

  fs.writeFile(`${targetPath}/${i}.json`, JSON.stringify(data), (err) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
  });
});

// update server
// https://github.com/Squirrel/Squirrel.Mac#server-support
const currentVersion = versions[0];
const oldVersions = versions;
oldVersions.shift();
oldVersions.forEach((version) => {
  const data = {
    name: currentVersion,
    url: `https://github.com/webcatalog/desktop/releases/download/${currentVersion}/WebCatalog-${currentVersion}-mac.zip`,
  };

  fs.writeFile(`${updateTargetPath}/${version}.json`, JSON.stringify(data), (err) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
  });
});

// algolia
const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_API_KEY);
const index = client.initIndex('webcatalog');
index.addObjects(apps, (err) => {
  if (err) {
    console.error(err);
  }
});

// create 404
fs.createReadStream('./src/404.html').pipe(fs.createWriteStream('./www/404.html'));
