set -e

if [ "$TRAVIS_OS_NAME" == "osx" ]
then
  $(npm bin)/surge --project ./public --domain webcatalog.xyz
  ./update_algolia_data.sh
fi
