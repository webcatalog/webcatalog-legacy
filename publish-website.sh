#!/bin/bash

if [[ $TRAVIS_OS_NAME == 'osx' ]]; then
  export WEBCATALOG_VERSION=$(node -e "console.log(require('./app/package.json').version);")
  yarn global add harp surge
  cd website
  yarn
  mv ./node_modules ./_node_modules
  harp compile
  surge --project ./www --domain getwebcatalog.com
fi
