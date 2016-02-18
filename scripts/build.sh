set -ex

parse_yaml() {
  local prefix=$2
  local s='[[:space:]]*' w='[a-zA-Z0-9_]*' fs=$(echo @|tr @ '\034')
  sed -ne "s|^\($s\)\($w\)$s:$s\"\(.*\)\"$s\$|\1$fs\2$fs\3|p" \
      -e "s|^\($s\)\($w\)$s:$s\(.*\)$s\$|\1$fs\2$fs\3|p"  $1 |
  awk -F$fs '{
    indent = length($1)/2;
    vname[indent] = $2;
    for (i in vname) {if (i > indent) {delete vname[i]}}
    if (length($3) > 0) {
       vn=""; for (i=0; i<indent; i++) {vn=(vn)(vname[i])("_")}
       printf("%s%s%s=\"%s\"\n", "'$prefix'",vn, $2, $3);
    }
  }'
}

rm -rf releases
mkdir -p releases

rm -rf .tmp
mkdir -p .tmp

for entry in content/app/*
do
  # read yaml file
  eval $(parse_yaml $entry "config_")

  # access yaml content
  echo $config_title
  echo $config_app_url

  cat > .tmp/$config_id.json <<EOT
{
  "osx" : {
    "title": "$config_title",
    "background": "../static/img/installer.png",
    "icon": "../static/img/mount.icns",
    "icon-size": 80,
    "contents": [
      { "x": 264, "y": 116, "type": "link", "path": "/Applications" },
      { "x": 12, "y": 116, "type": "file" }
    ]
  },
  "win" : {
    "title" : "$config_title",
    "publisher": "WebCatalog",
    "icon" : "./static/img/windows_setup.ico",
    "verbosity": 1
  }
}
EOT

  # OS X
  if [ "$BUILD_TYPE" = "osx" ]
  then
    $(npm bin)/nativefier --name "$config_title" --platform darwin --icon "static/app/$config_id/osx.png" "$config_app_url" ".tmp/source/$config_id"

    osx_dir=$(find ".tmp/source/$config_id" -name "*darwin-x64" -type d | awk "NR==1")

    $(npm bin)/electron-builder "$osx_dir/$config_title.app" --platform=osx --out=".tmp/releases/$config_id/osx" --config=".tmp/$config_id.json"
    darwin_setup=$(find ".tmp/releases/$config_id/osx" -name "*.dmg" -type f | awk "NR==1")
    mv "$darwin_setup" "releases/$config_id-osx.dmg"
  fi

  # Win32
  if [ "$BUILD_TYPE" = "windows" ]
  then
    $(npm bin)/nativefier --name "$config_title" --platform win32 --arch ia32 --icon "static/app/$config_id/windows.png" "$config_app_url" ".tmp/source/$config_id"
    $(npm bin)/nativefier --name "$config_title" --platform win32 --arch x64 --icon "static/app/$config_id/windows.png" "$config_app_url" ".tmp/source/$config_id"

    win_ia32_dir=$(find ".tmp/source/$config_id" -name "*win32-ia32" -type d | awk "NR==1")

    $(npm bin)/electron-builder "$win_ia32_dir" --platform=win --out=".tmp/releases/$config_id/win32-ia32" --config=".tmp/$config_id.json"
    win_ia32_setup=$(find ".tmp/releases/$config_id/win32-ia32" -name "*.exe" -type f | awk "NR==1")
    mv "$win_ia32_setup" "releases/$config_id-win-ia32.exe"

    win_x64_dir=$(find ".tmp/source/$config_id" -name "*win32-x64" -type d | awk "NR==1")

    $(npm bin)/electron-builder "$win_x64_dir" --platform=win --out=".tmp/releases/$config_id/win32-x64" --config=".tmp/$config_id.json"
    win_x64_setup=$(find ".tmp/releases/$config_id/win32-x64" -name "*.exe" -type f | awk "NR==1")
    mv "$win_x64_setup" "releases/$config_id-win-x64.exe"
  fi

  # Linux
  if [ "$BUILD_TYPE" = "linux" ]
  then
    $(npm bin)/nativefier --name "$config_title" --platform linux --arch ia32 --icon "static/app/$config_id/linux.png" "$config_app_url" ".tmp/source/$config_id"
    $(npm bin)/nativefier --name "$config_title" --platform linux --arch x64 --icon "static/app/$config_id/linux.png" "$config_app_url" ".tmp/source/$config_id"

    linux_ia32_dir=$(find ".tmp/source/$config_id" -name "*linux-ia32" -type d | awk "NR==1")

    zip -r "releases/$config_id-linux-ia32.zip" "$linux_ia32_dir"

    linux_x64_dir=$(find ".tmp/source/$config_id" -name "*linux-x64" -type d | awk "NR==1")

    zip -r "releases/$config_id-linux-x64.zip" "$linux_x64_dir"
  fi

done

# Hugo
# Generate small pngs for web
for entry in static/app/*
do
  convert "$entry/osx.png" -resize 64x64 "$entry/osx.64.png"
done
hugo
# Minify
$(npm bin)/uglifyjs --compress --mangle --output public/js/app.js -- public/js/app.js
$(npm bin)/uglifyjs --compress --mangle --output public/js/search.js -- public/js/search.js
$(npm bin)/cleancss --output public/css/app.css public/css/app.css
find public -name "*.html" -type f -exec $(npm bin)/html-minifier {} --output {} --remove-comments --collapse-whitespace \;
