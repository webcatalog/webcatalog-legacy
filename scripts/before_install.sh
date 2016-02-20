set -e

if [ "$TRAVIS_OS_NAME" == "osx" ]
then
  brew update

  brew install hugo imagemagick pandoc
  brew install https://raw.githubusercontent.com/kadwanev/bigboybrew/master/Library/Formula/sshpass.rb

  brew upgrade node
fi

if [ "$TRAVIS_OS_NAME" == "linux" ]
then
  if [ "$BUILD_TYPE" = "linux" ]
  then
    gem install fpm
  fi

  # Install Hugo
  mkdir -p ~/opt/packages/hugo && cd $_
  wget https://github.com/spf13/hugo/releases/download/v0.15/hugo_0.15_linux_amd64.tar.gz
  gzip -dc hugo_0.15_linux_amd64.tar.gz | tar xf -
  rm hugo_0.15_linux_amd64.tar.gz
  mkdir ~/bin
  ln -s ~/opt/packages/hugo/hugo_0.15_linux_amd64/hugo_0.15_linux_amd64 ~/bin/hugo
  source ~/.profile
  which hugo
  hugo version
fi
