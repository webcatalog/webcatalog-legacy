# Based on https://gist.github.com/oubiwann/453744744da1141ccc542ff75b47e0cf
#!/usr/bin/env bash

# applify.sh "App name" "URL" "Icon path" "Id"

APPNAME=${1}
APPURL=${2}
APPICON=${3}
APPID=${4}
APPDIR=$(eval echo "~/Applications")
TARGETDIR="${APPDIR}/WebCatalog Apps/$APPNAME.app"

rm -rf "${TARGETDIR}"

APPLESCRIPT_TEMP=$(mktemp)

# If a URL is received, write a temporary file to tell WebCatalog what URL to launch
cat <<EOF > "${APPLESCRIPT_TEMP}"
on open location this_URL
	 do shell script "echo \"" & this_URL & "\" > ~/.webcatalog/${APPID}.rurl"
	 do shell script "open -a ~/.webcatalog/\"${APPNAME}.app\""
end open location

do shell script "open -a ~/.webcatalog/\"${APPNAME}.app\""
EOF

osacompile -o "${TARGETDIR}" "${APPLESCRIPT_TEMP}"

# Icon
cp -v "${APPICON}" "${TARGETDIR}/Contents/Resources/applet.icns"

# To identify
echo "{ \"id\": \"${APPID}\", \"version\": 2 }" > "${TARGETDIR}/Contents/Resources/info.json"

# Generate a temporary app to be launched by AppleScript
# Two .app file structure because AppleScripe doesn't not launch the exectuable correctly + Bash script doesn't support Apple Events
$(dirname -- "$0")/applify-darwin-tmp.sh "$@"
