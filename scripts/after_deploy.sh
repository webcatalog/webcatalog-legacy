set -e

if [ "$TRAVIS_OS_NAME" == "osx" ]
then
  hugo
  $(npm bin)/surge --project ./public --domain webcatalog.xyz
fi
