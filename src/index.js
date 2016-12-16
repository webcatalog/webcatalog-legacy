const fs = require('fs');
const sharp = require('sharp');

const imageDataPath = './data/images';
const jsonDataPath = './data/json';

const targetPath = './www';
const imageTargetPath = `${targetPath}/images`;

const numberOfAppInChunk = 20;

// init target folders
if (!fs.existsSync(targetPath)){
  fs.mkdirSync(targetPath);
}
if (!fs.existsSync(imageTargetPath)){
  fs.mkdirSync(imageTargetPath);
}

const jsonFiles = fs.readdirSync(jsonDataPath);

const chunks = [[]];

let count = 0;
let chunkIndex = 0;

jsonFiles.forEach(fileName => {
  // Remove .json from filename to get app id
  const id = fileName.replace('.json', '');

  // Generate WebP & PNG
  sharp(`${imageDataPath}/${id}.png`)
    .toFile(`${imageTargetPath}/${id}.png`, (err) => {
      if (err) {
        console.log(`${imageDataPath}/${id}.png`)
        console.log(err);
        process.exit(1);
      }
    })
    .toFile(`${imageTargetPath}/${id}.webp`, (err) => {
      if (err) {
        console.log(`${imageDataPath}/${id}.webp`)
        console.log(err);
        process.exit(1);
      }
    });

  // Add Data to chunk
  if (count === numberOfAppInChunk) {
    chunkIndex += 1;
    chunks[chunkIndex] = [];
    count = 0;
  }
  const dataStr = fs.readFileSync(`${jsonDataPath}/${id}.json`, 'utf8');
  const app = JSON.parse(dataStr);
  chunks[chunkIndex].push(app);
  count += 1;
});


chunks.forEach((chunk, i) => {
  const data = {
    totalPage: chunks.length,
    chunk: chunk
  }

  fs.writeFile(`${targetPath}/${i}.json`, JSON.stringify(data), (err) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
  });
});
