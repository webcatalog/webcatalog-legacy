#!/bin/bash

if [ "$TRAVIS_OS_NAME" == 'linux' -a "$TRAVIS_BRANCH" = "master" ]; then
  echo "Publishing Website"
  export WEBCATALOG_VERSION=$(node -e "console.log(require('./app/package.json').version);")
  yarn global add harp
  cd website
  yarn
  mv ./node_modules ./_node_modules
  harp compile

  cd www
  git init
  git checkout -b gh-pages
  git add .
  git -c user.name='Quang Lam' -c user.email='quang.lam2807@gmail.com' commit -m "${TRAVIS_JOB_NUMBER}"
  git remote add origin "https://$GH_TOKEN@github.com/webcatalog/desktop.git"
  git push origin gh-pages -f --quiet > /dev/null 2>&1
else
  echo $TRAVIS_OS_NAME
  echo $TRAVIS_BRANCH
  echo "Skip Publishing Website"
fi
