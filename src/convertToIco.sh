#!/usr/bin/env bash

# https://raw.githubusercontent.com/jiahaog/nativefier/development/bin/convertToIco

# USAGE

# ./convertToIco <input png or ico> <outfilename>.ico
# Example
# ./convertToIco ~/sample.png ~/converted.ico

set -e

type convert >/dev/null 2>&1 || { echo >&2 "Cannot find required ImageMagick Convert executable"; exit 1; }

SOURCE=$1
DEST=$2

if [ -z "${SOURCE}" ]; then
	echo "No source image specified"
	exit 1
fi

if [ -z "${DEST}" ]; then
	echo "No destination specified"
	exit 1
fi

NAME=$(basename "${SOURCE}")
EXT="${NAME##*.}"
BASE="${NAME%.*}"

if [ "${EXT}" == "ico" ]; then
    cp "${SOURCE}" "${DEST}"
    exit 0
fi

convert "${SOURCE}" -define icon:auto-resize="256,128,96,64,48,32,16" "${DEST}"
