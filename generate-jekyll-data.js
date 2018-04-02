const fs = require('fs-extra');
const yaml = require('js-yaml');

const appDirs = fs.readdirSync('./directory/apps');

appDirs.forEach((appId) => {
  if (appId === '.DS_Store') return;
  const yamlPath = `./directory/apps/${appId}/${appId}.yml`;
  const content = yaml.load(fs.readFileSync(yamlPath, 'utf8'));

  content.title = `${content.name} for macOS, Windows & Linux`;
  content.key = appId;

  const newContent = `---
${yaml.dump(content)}
---`;

  fs.ensureDirSync('./docs/_directory');
  fs.writeFileSync(`./docs/_directory/${appId}.md`, newContent);
});
