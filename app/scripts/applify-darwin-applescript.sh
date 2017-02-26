#!/usr/bin/env bash

# Based on https://gist.github.com/oubiwann/453744744da1141ccc542ff75b47e0cf
# applify.sh "App name" "URL" "Icon path" "Id"

APPNAME=${1}
APPURL=${2}
APPICON=${3}
APPID=${4}
HOMEDIR=$(eval echo "~/.webcatalog")
TARGETDIR="${HOMEDIR}/$APPNAME.app"

mkdir -vp ${TARGETDIR}

rm -rf "${TARGETDIR}"


APPLESCRIPT_TEMP=$(mktemp)

# If a URL is received, write a temporary file to tell WebCatalog what URL to launch
cat <<EOF > "${APPLESCRIPT_TEMP}"
on open location this_URL
	 do shell script "echo \"" & this_URL & "\" > ~/.webcatalog/${APPID}.rurl"
	 do shell script "open -a ~\"/Applications/WebCatalog Apps/${APPNAME}.app\""
end open location

do shell script "open -a ~\"/Applications/WebCatalog Apps/${APPNAME}.app\""
EOF

osacompile -o "${TARGETDIR}" "${APPLESCRIPT_TEMP}"

# Icon
cp -v "${APPICON}" "${TARGETDIR}/Contents/Resources/applet.icns"
