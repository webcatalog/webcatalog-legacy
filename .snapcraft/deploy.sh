#!/usr/bin/env bash

if [[ "$TRAVIS_OS_NAME" == "linux" ]]; then
    openssl aes-256-cbc -K $encrypted_0865a52076c8_key -iv $encrypted_0865a52076c8_iv -in .snapcraft/travis_snapcraft.cfg -out .snapcraft/snapcraft.cfg -d;
    snap run snapcraft push dist/*.snap --release stable;
fi