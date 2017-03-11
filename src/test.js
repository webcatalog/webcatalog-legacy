const fs = require('fs');

const imageDataPath = './data/images';
const jsonDataPath = './data/json';

const jsonFiles = fs.readdirSync(jsonDataPath);

jsonFiles.forEach((fileName) => {
  // Remove .json from filename to get app id
  const id = fileName.replace('.json', '');

  const dataStr = fs.readFileSync(`${jsonDataPath}/${id}.json`, 'utf8');
  const app = JSON.parse(dataStr);

  if (!app.url || !app.name) {
    console.log(`${id}.json is not valid.`);
    process.exit(1);
  }

  if (!fs.existsSync(`${imageDataPath}/${id}.png`)) {
    console.log(`${id}.png does not exist.`);
    process.exit(1);
  }
});
