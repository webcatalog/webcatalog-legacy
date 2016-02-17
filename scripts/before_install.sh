brew update

brew install hugo

if [ "$BUILD_TYPE" = "windows" ]
then
  brew install makensis
  brew install wine
fi

if [ "$BUILD_TYPE" = "osx" ]
then
  brew install imagemagick
fi

if [ "$BUILD_TYPE" = "linux" ]
then
  gem install fpm
fi
