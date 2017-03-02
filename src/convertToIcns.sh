#!/usr/bin/env bash
### USAGE

# https://github.com/jiahaog/nativefier/blob/development/bin/convertToIcns

# ./convertToIcns <input png> <outp icns>
# Example
# ./convertToIcns ~/sample.png ~/Desktop/converted.icns

# exit the shell script on error immediately
set -e

# Exec Paths
type convert >/dev/null 2>&1 || { echo >&2 "Cannot find required ImageMagick Convert executable"; exit 1; }
type png2icns >/dev/null 2>&1 || { echo >&2 "Cannot find required icnsutils executable"; exit 1; }

# Parameters
SOURCE=$1
DEST=$2

# Check source and destination arguments
if [ -z "${SOURCE}" ]; then
	echo "No source image specified"
	exit 1
fi

if [ -z "${DEST}" ]; then
	echo "No destination specified"
	exit 1
fi

# File Infrastructure
NAME=$(basename "${SOURCE}")
BASE="${NAME%.*}"
ICONSET=$(mktemp -d)

clean_up() {
    rm -rf "${ICONSET}"
}

trap clean_up EXIT

mkdir -p "${ICONSET}"

PNG_PATH=$1

# Resample image into iconset
convert "${PNG_PATH}" -define png:big-depth=16 -define png:color-type=6 -sample 16x16 "${ICONSET}/icon_16x16.png"
convert "${PNG_PATH}" -define png:big-depth=16 -define png:color-type=6 -sample 32x32 "${ICONSET}/icon_32x32.png"
convert "${PNG_PATH}" -define png:big-depth=16 -define png:color-type=6 -sample 128x128 "${ICONSET}/icon_128x128.png"
convert "${PNG_PATH}" -define png:big-depth=16 -define png:color-type=6 -sample 256x256 "${ICONSET}/icon_256x256.png"
convert "${PNG_PATH}" -define png:big-depth=16 -define png:color-type=6 -sample 512x512 "${ICONSET}/icon_512x512.png"
convert "${PNG_PATH}" -define png:big-depth=16 -define png:color-type=6 -sample 1024x1024 "${ICONSET}/icon_1024x1024.png"

# Create an icns file lefrom the iconset
png2icns "${DEST}" "${ICONSET}"/icon_*.png

trap - EXIT
clean_up
