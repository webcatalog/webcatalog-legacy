#!/usr/bin/env bash

# applify-linux.sh "App name" "URL" "Icon path" "Id"

APPNAME=${1}
APPURL=${2}
APPICON=${3}
APPID=${4}
APPDIR=$(eval echo "~/.local/share/applications")
ICONDIR=$(eval echo "~/.icons/webcatalog")
DESKTOP_FILE="${APPDIR}/${APPID}.desktop"

echo $DESKTOP_FILE

mkdir -p "${ICONDIR}"

cp -v "$APPICON" "${ICONDIR}/${APPID}.png"

cat <<EOF > "${DESKTOP_FILE}"
[Desktop Entry]
Name=$APPNAME
Exec=/usr/local/bin/webcatalog --name="$APPNAME" --url="$APPURL" --id="$APPID"
Icon=$ICONDIR/$APPID.png
Type=Application
EOF
