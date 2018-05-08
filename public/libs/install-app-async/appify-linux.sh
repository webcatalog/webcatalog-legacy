#!/usr/bin/env bash

# http://vaclavkosar.com/2018/02/25/Creating-Custom-Ubuntu-Web-Link-App.html

url="$1";
APPNAME=${1};
APPURL=${2};
APPID=${3};
APPPNG=${4};
APPCATEGORY=${5:="Other"};
APPMODE=${6:="google-chrome"}; # google-chrome | chromium

mkdir -p "${HOME}/bin";

command="${HOME}/bin/${APPID}";

if [ "${APPMODE}" == "juli" ]; then
	cat - > "${command}" <<END
#!/bin/sh -ue

#${1}
#${2}
#${3}
juli --id="${APPID}" --name="${APPNAME}" --url="${APPURL}";
END
else
	EXECPATH="google-chrome";
	if [ "${APPMODE}" == "chromium" ]; then
		EXECPATH="chromium-browser";
	fi

	cat - > "${command}" <<END
#!/bin/sh -ue

#${1}
#${2}
#${3}
${EXECPATH} --class "$APPNAME" --user-data-dir="$HOME/.config/webcatalog-$APPID" --app="$APPURL";
END
fi


chmod u+x "$command";

mkdir -p "${HOME}/.local/share/icons";
icon="${HOME}/.local/share/icons/webcatalog-${APPID}.png";
cp -v "${APPPNG}" "${icon}";

mkdir -p "${HOME}/.local/share/applications";
desktopFile="$HOME/.local/share/applications/webcatalog-${APPID}.desktop";

cat - > "$desktopFile" <<END
[Desktop Entry]
Version=1.0
Type=Application
Name=$APPNAME
GenericName=$APPNAME
Icon=$icon
Exec=$command
Terminal=false
Categories=$APPCATEGORY;
END
