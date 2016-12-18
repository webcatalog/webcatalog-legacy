# Based on https://gist.github.com/oubiwann/453744744da1141ccc542ff75b47e0cf
#!/usr/bin/env bash

# applify.sh "App name" "URL" "Icon path"

APPNAME=${1}
APPURL=${2}
APPICONS=${3}
APPID=${4}
APPDIR=$(eval echo "~/Applications")
TARGETDIR="${APPDIR}/WebCatalog Apps/$APPNAME.app"
DIR="${TARGETDIR}/Contents"
SCRIPT="${DIR}/MacOS/${APPNAME}"

mkdir -vp "${DIR}"/{MacOS,Resources}

cat <<EOF > "${SCRIPT}"
#!/usr/bin/env bash
/Applications/WebCatalog.app/Contents/MacOS/WebCatalog --name="$APPNAME" --url="$APPURL"
EOF
chmod +x "${SCRIPT}"

cp -v "$APPICONS" "${DIR}/Resources/${APPNAME}.icns"

# To identify
echo "${APPID}" > "${TARGETDIR}/id"

cat <<EOF > "$DIR/Info.plist"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>CFBundleExecutable</key>
    <string>$APPNAME</string>
    <key>CFBundleGetInfoString</key>
    <string>$APPNAME</string>
    <key>CFBundleIconFile</key>
    <string>$APPNAME.icns</string>
    <key>CFBundleName</key>
    <string>$APPNAME</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleSignature</key>
    <string>4242</string>
  </dict>
</plist>
EOF

echo $TARGETDIR
