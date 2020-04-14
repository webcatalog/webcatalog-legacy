const argv = require('yargs-parser')(process.argv.slice(1));
const icongen = require('icon-gen');
const Jimp = require('jimp');
const path = require('path');
const tmp = require('tmp');
const fsExtra = require('fs-extra');
const isUrl = require('is-url');
const sudo = require('sudo-prompt');

const downloadAsync = require('../../download-async');

const {
  engine,
  id,
  name,
  url,
  icon,
  homePath,
  installationPath,
  requireAdmin,
  username,
  registered,
} = argv;

const unescapeString = (str) => str.replace(/\\"/gmi, '"');

const escapeString = (str) => str.replace(/"/gmi, '\\"');

// https://github.com/iteufel/node-strings-file/blob/master/index.js
const strings2Obj = (data, wantComments) => {
  if (data.indexOf('\n') === -1) {
    // eslint-disable-next-line no-param-reassign
    data += '\n';
  }
  const re = /(?:\/\*(.+)\*\/\n)?(.+)\s*=\s*"(.+)";\n/gmi;
  const res = {};
  let m = re.exec(data);
  while (m !== null) {
    if (m.index === re.lastIndex) {
      re.lastIndex += 1;
    }
    if (m[2].substring(0, 1) === '"') {
      m[2] = m[2].trim().slice(1, -1);
    }
    m[2] = m[2].trim();
    if (wantComments) {
      res[m[2]] = {
        value: unescapeString(m[3]),
        comment: m[1] || '',
      };
    } else {
      res[m[2]] = unescapeString(m[3]);
    }
    m = re.exec(data);
  }
  return res;
};

// https://github.com/iteufel/node-strings-file/blob/master/index.js
/* eslint-disable prefer-template */
const obj2Strings = (obj) => {
  let data = '';
  Object.keys(obj).forEach((i) => {
    if (typeof obj[i] === 'object') {
      if (obj[i].comment && obj[i].comment.length > 0) {
        data += '/*' + obj[i].comment + '*/\n';
      }
      data += i + ' = "' + escapeString(obj[i].value) + '";\n';
    } else if (typeof obj[i] === 'string') {
      data += i + ' = "' + escapeString(obj[i]) + '";\n';
    }
  });
  return data;
};
/* eslint-enable prefer-template */

const sudoAsync = (prompt) => new Promise((resolve, reject) => {
  const opts = {
    name: 'WebCatalog',
  };
  process.env.USER = username;
  sudo.exec(prompt, opts, (error, stdout, stderr) => {
    if (error) {
      return reject(error);
    }
    return resolve(stdout, stderr);
  });
});

const getAppFolderName = () => {
  if (process.platform === 'darwin') {
    return `${name}.app`;
  }
  if (process.platform === 'linux') {
    return `${name}-linux-x64`;
  }
  if (process.platform === 'win32') {
    return `${name}-win32-x64`;
  }
  throw Error('Unsupported platform');
};

const tmpObj = tmp.dirSync();
const tmpPath = tmpObj.name;
const appFolderPath = path.join(tmpPath, getAppFolderName());
// Mock Electron for backward compatiblity
const contentsPath = path.join(appFolderPath, 'Contents');
const resourcesPath = process.platform === 'darwin'
  ? path.join(contentsPath, 'Resources')
  : path.join(appFolderPath, 'resources');
const appAsarUnpackedPath = path.join(resourcesPath, 'app.asar.unpacked');
const packageJsonPath = path.join(appAsarUnpackedPath, 'package.json');
const appJsonPath = path.join(appAsarUnpackedPath, 'build', 'app.json');
const publicIconIcnsPath = path.join(resourcesPath, 'icon.icns');
const publicIconPngPath = path.join(appAsarUnpackedPath, 'build', 'icon.png');

const buildResourcesPath = path.join(tmpPath, 'build-resources');
const iconIcnsPath = path.join(buildResourcesPath, 'e.icns');
const iconPngPath = path.join(buildResourcesPath, 'e.png');

const allAppsPath = installationPath.replace('~', homePath);
const finalPath = process.platform === 'darwin'
  ? path.join(allAppsPath, `${name}.app`)
  : path.join(allAppsPath, name);

Promise.resolve()
  .then(() => {
    if (isUrl(icon)) {
      return downloadAsync(icon, iconPngPath);
    }

    return fsExtra.copy(icon, iconPngPath);
  })
  .then(() => Jimp.read(iconPngPath))
  .then((img) => {
    const sizes = process.platform === 'darwin'
      ? [16, 32, 64, 128, 256, 512, 1024]
      : [16, 24, 32, 48, 64, 128, 256];

    const p = (process.platform === 'darwin' || process.platform === 'win32')
      ? sizes.map((size) => new Promise((resolve) => {
        img
          .clone()
          .resize(size, size)
          .quality(100)
          .write(path.join(buildResourcesPath, `${size}.png`), resolve);
      })) : [];

    return Promise.all(p)
      .then(() => {
        if (process.platform === 'darwin') {
          return icongen(buildResourcesPath, buildResourcesPath, {
            report: true,
            icns: {
              name: 'e',
              sizes,
            },
          });
        }
        return null;
      });
  })
  .then(() => {
    if (process.platform === 'darwin') {
      return Promise.resolve()
        .then(() => fsExtra.ensureDir(appAsarUnpackedPath))
        .then(() => fsExtra.copy(iconPngPath, publicIconPngPath))
        .then(() => fsExtra.copy(iconIcnsPath, publicIconIcnsPath))
        .then(() => {
          const execFilePath = process.platform === 'darwin'
            ? path.join(contentsPath, 'MacOS', 'webcatalog_root_app')
            : path.join(appFolderPath, name);
          const execFileContent = `#!/bin/sh
DIR=$(dirname "$0");
  cd "$DIR";
cd ..;
cd Resources;

cp -rf ~/Library/Application\\ Support/Google/Chrome/NativeMessagingHosts ../../Contents/Profile/NativeMessagingHosts

pgrepResult=$(pgrep -f "$DIR/${id}.app")
numProc=$(echo "$pgrepResult" | wc -l)
if [ $numProc -ge 2 ]
    then
    exit;
fi
pgrepResult=$(pgrep -f "$PWD"/${id}.app/Contents/MacOS/Google\\ Chrome)
if [ -n "$pgrepResult" ]; then
    exit
fi

exec "$PWD"/${id}.app/Contents/MacOS/Google\\ Chrome --no-sandbox --test-type  --args --app="${url}" --user-data-dir="$DIR"/../Profile
`;
          return fsExtra.outputFile(execFilePath, execFileContent)
            .then(() => fsExtra.chmod(execFilePath, '755'));
        })
        .then(() => {
          const infoPlistPath = path.join(contentsPath, 'Info.plist');
          const infoPlistContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleExecutable</key>
  <string>webcatalog_root_app</string>
  <key>CFBundleIconFile</key>
  <string>icon.icns</string>
  <key>CFBundleIdentifier</key>
  <string>com.webcatalog.${engine}.${id}</string>
</dict>
</plist>
`;
          return fsExtra.outputFile(infoPlistPath, infoPlistContent);
        })
        .then(() => {
          // init profile
          // add empty "First Run" file so default browser prompt doesn't show up
          const profilePath = path.join(contentsPath, 'Profile');

          // move data from v1
          const chromiumDataPath = path.join(homePath, '.webcatalog', 'chromium-data', id);
          if (fsExtra.existsSync(chromiumDataPath)) {
            fsExtra.moveSync(chromiumDataPath, profilePath);
          }

          return fsExtra.ensureFile(path.join(profilePath, 'First Run'));
        })
        .then(() => {
          // init cloned Chromium app
          const clonedBrowserPath = path.join(resourcesPath, `${id}.app`);
          const clonedBrowserContentsPath = path.join(clonedBrowserPath, 'Contents');
          const browserPath = path.join('/Applications', 'Google Chrome.app');
          const browserContentsPath = path.join(browserPath, 'Contents');

          const p = [];

          // resources dir
          // overwrite app name
          fsExtra.readdirSync(path.join(browserContentsPath, 'Resources'))
            .forEach((itemName) => {
              if (itemName.endsWith('.lproj')) {
                const stringsContent = fsExtra.readFileSync(
                  path.join(browserContentsPath, 'Resources', itemName, 'InfoPlist.strings'),
                  'utf8',
                );
                const strings = strings2Obj(stringsContent);

                // overwrite values
                strings.CFBundleName = name;
                strings.CFBundleDisplayName = name;
                strings.CFBundleGetInfoString = 'The app is created with WebCatalog (https://webcatalogapp.com). Copyright 2020 Google LLC. All rights reserved.';

                const clonedStringsPath = path.join(clonedBrowserContentsPath, 'Resources', itemName, 'InfoPlist.strings');
                fsExtra.ensureFileSync(clonedStringsPath);
                fsExtra.writeFileSync(
                  clonedStringsPath,
                  obj2Strings(strings),
                  { encoding: 'utf16le' }, // Google use UTF-8, but Apple recommends using UTF-16
                );
              } else if (itemName !== 'app.icns') {
                p.push(fsExtra.ensureSymlink(
                  path.join(browserContentsPath, 'Resources', itemName),
                  path.join(clonedBrowserContentsPath, 'Resources', itemName),
                ));
              }
            });
          // overwrite icon
          p.push(fsExtra.copy(
            iconIcnsPath,
            path.join(clonedBrowserContentsPath, 'Resources', 'app.icns'),
          ));


          // symlinks for other files & dirs
          fsExtra.readdirSync(browserContentsPath, { withFileTypes: true })
            .forEach((item) => {
              if (item.name !== 'Resources') {
                // symlink one more level deeper
                if (item.isDirectory()) {
                  fsExtra.readdirSync(path.join(browserContentsPath, item.name))
                    .forEach((subItemName) => {
                      p.push(fsExtra.ensureSymlink(
                        path.join(browserContentsPath, item.name, subItemName),
                        path.join(clonedBrowserContentsPath, item.name, subItemName),
                      ));
                    });
                } else {
                  p.push(fsExtra.ensureSymlink(
                    path.join(browserContentsPath, item.name),
                    path.join(clonedBrowserContentsPath, item.name),
                  ));
                }
              }
            });

          return Promise.all(p);
        });
    }

    return Promise.reject(new Error('Unsupported platform'));
  })
  .then(() => {
    const packageJson = JSON.stringify({
      version: '2.0.0',
    });
    return fsExtra.writeFileSync(packageJsonPath, packageJson);
  })
  .then(() => {
    const appJson = JSON.stringify({
      id,
      name,
      url,
      engine,
      registered: registered === 'true',
    });
    return fsExtra.writeFileSync(appJsonPath, appJson);
  })
  .then(() => {
    if (requireAdmin === 'true') {
      return sudoAsync(`mkdir -p "${allAppsPath}" && rm -rf "${finalPath}" && mv "${appFolderPath}" "${finalPath}"`);
    }
    return fsExtra.move(appFolderPath, finalPath, { overwrite: true });
  })
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    process.send({
      error: {
        name: e.name,
        message: e.message,
        stack: e.stack,
      },
    });
    process.exit(1);
  });

process.on('uncaughtException', (e) => {
  process.send({
    error: {
      name: e.name,
      message: e.message,
      stack: e.stack,
    },
  });
  process.exit(1);
});
