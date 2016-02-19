set -e

if [ "$TRAVIS_OS_NAME" == "osx" ]
then
  node ./scripts/update_algolia_data.js
fi
