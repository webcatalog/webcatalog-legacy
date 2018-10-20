#!/usr/bin/env bash

if [[ "$TRAVIS_OS_NAME" == "linux" ]]; then
    snap run snapcraft push dist/*.snap --release stable;
fi