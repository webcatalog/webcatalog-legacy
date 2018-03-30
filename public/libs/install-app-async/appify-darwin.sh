#!/usr/bin/env bash
# https://gist.github.com/mathiasbynens/674099
# https://mathiasbynens.be/notes/shell-script-mac-apps
# http://vaclavkosar.com/2018/02/25/Creating-Custom-Ubuntu-Web-Link-App.html

APPNAME=${1};
APPURL=${2};
APPID=${3};
APPICNS=${4};
APPPNG=${5};
DEST=${6:-.};
APPMODE=${7:="google-chrome"}; # google-chrome | chromium
CONTENT_DIR="${DEST}/${APPNAME}.app/Contents";
MACOS_DIR="${DEST}/${APPNAME}.app/Contents/MacOS";
RESOURCE_DIR="${DEST}/${APPNAME}.app/Contents/Resources";

if [ -a "${DEST}/${APPNAME}.app" ]; then
	rm -rf "${DEST}/${APPNAME}.app";
fi;

mkdir -p "${MACOS_DIR}";

EXECPATH="/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome";
if [ "${APPMODE}" == "chromium" ]; then
	EXECPATH="/Applications/Chromium.app/Contents/MacOS/Chromium";
fi

cat <<EOF > "${MACOS_DIR}/Executable"
#!/usr/bin/env bash

#${1}
#${2}
#${3}

${EXECPATH} --class ${APPID} --user-data-dir="${HOME}/.webcatalog-lite/${APPID}" --app="$APPURL"
EOF

chmod +x "${MACOS_DIR}/Executable";

mkdir -p "${RESOURCE_DIR}";
cp -v "${APPICNS}" "${RESOURCE_DIR}/app.icns";
cp -v "${APPPNG}" "${RESOURCE_DIR}/app.png";

cat <<EOF > "$CONTENT_DIR/Info.plist"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>CFBundleExecutable</key>
    <string>Executable</string>
    <key>CFBundleGetInfoString</key>
    <string>$APPNAME</string>
    <key>CFBundleIconFile</key>
    <string>app.icns</string>
    <key>CFBundleName</key>
    <string>$APPNAME</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
  </dict>
</plist>
EOF
