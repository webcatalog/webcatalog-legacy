if [ "$TRAVIS_OS_NAME" == "osx" ]
then
  brew update

  brew install hugo
  brew install imagemagick

  brew upgrade node
fi

if [ "$TRAVIS_OS_NAME" == "linux" ]
then
  if [ "$BUILD_TYPE" = "windows" ]
  then
    sudo add-apt-repository ppa:ubuntu-wine/ppa -y
    sudo apt-get update
    sudo apt-get install wine nsis -y
  fi

  if [ "$BUILD_TYPE" = "linux" ]
  then
    gem install fpm
  fi

  export GOPATH=$HOME/go
  go get -v github.com/spf13/hugo

  sudo apt-get install imagemagick

  curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

node -v
npm install -g nativefier
npm install -g electron-builder
npm install -g surge
