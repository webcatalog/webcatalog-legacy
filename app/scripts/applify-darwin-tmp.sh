# Based on https://gist.github.com/oubiwann/453744744da1141ccc542ff75b47e0cf
#!/usr/bin/env bash

# applify.sh "App name" "URL" "Icon path" "Id"

APPNAME=${1}
APPURL=${2}
APPICON=${3}
APPID=${4}
TMPDIR=$(eval echo "~/.webcatalog")
TARGETDIR="${TMPDIR}/$APPNAME.app"
DIR="${TARGETDIR}/Contents"
SCRIPT="${DIR}/MacOS/${APPNAME}"

mkdir ${TMPDIR}

mkdir -vp "${DIR}"/{MacOS,Resources}

cat <<EOF > "${SCRIPT}"
#!/usr/bin/env bash
/Applications/WebCatalog.app/Contents/Resources/WebCatalog_Alt --name="$APPNAME" --url="$APPURL" --id="$APPID"
EOF
chmod +x "${SCRIPT}"

cp -v "$APPICON" "${DIR}/Resources/${APPNAME}.icns"

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
