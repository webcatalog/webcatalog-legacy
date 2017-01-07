set APPNAME=%~1
set APPURL=%~2
set APPICON=%3
set APPID=%4

set SHORTCUT_FILE="%userprofile%\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\WebCatalog Apps\%APPNAME%.lnk"
set LINK_ARGUMENTS="--name='%APPNAME%' --url='%APPURL%' --id='%APPID%'"

echo %SHORTCUT_FILE%

call %~dp0shortcutJS.bat -linkfile %SHORTCUT_FILE% -target "%userprofile%\AppData\Local\Programs\WebCatalog\WebCatalog.exe" -linkarguments %LINK_ARGUMENTS% -iconlocation %APPICON%
