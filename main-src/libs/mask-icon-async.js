/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const path = require('path');
const Jimp = process.env.NODE_ENV === 'production' ? require('jimp').default : require('jimp');

// apply icon template to make icon follow Big Sur style
const maskIconAsync = async (iconPath, iconDestPath, unplated = false) => {
  const iconDirPath = process.env.NODE_ENV === 'production'
    ? path.resolve(__dirname, 'images')
    : path.resolve(__dirname, '..', 'images');

  const foregroundPath = unplated
    ? path.join(iconDirPath, 'icon-mask-unplated.png')
    : path.join(iconDirPath, 'icon-mask.png');

  // load images
  const foreground = await Jimp.read(foregroundPath);
  const iconFilled = await Jimp.read(iconPath);

  // replace transparent pixels with white pixels
  const whiteHex = Jimp.rgbaToInt(255, 255, 255, 255);
  for (let w = 0; w < iconFilled.bitmap.width; w += 1) {
    for (let h = 0; h < iconFilled.bitmap.height; h += 1) {
      const pixelHex = iconFilled
        .getPixelColor(w, h); // returns the colour of that pixel e.g. 0xFFFFFFFF
      const pixelRgba = Jimp
        .intToRGBA(pixelHex); // e.g. converts 0xFFFFFFFF to {r: 255, g: 255, b: 255, a:255}
      if (pixelRgba.a === 0) {
        iconFilled.setPixelColor(whiteHex, w, h);
      }
    }
  }

  // resize to fit into mask
  let iconPadded = iconFilled;
  if (!unplated) {
    iconFilled.resize(824, 824);
    iconPadded = new Jimp(1024, 1024).composite(iconFilled, 100, 100);
  } else {
    iconFilled.resize(1024, 1024);
  }

  const maskedIcon = foreground.clone();
  for (let w = 0; w < maskedIcon.bitmap.width; w += 1) {
    for (let h = 0; h < maskedIcon.bitmap.height; h += 1) {
      const pixelHex = maskedIcon
        .getPixelColor(w, h); // returns the colour of that pixel e.g. 0xFFFFFFFF
      if (pixelHex === whiteHex) {
        maskedIcon.setPixelColor(iconPadded.getPixelColor(w, h), w, h);
      }
    }
  }

  return maskedIcon.writeAsync(iconDestPath);
};

module.exports = maskIconAsync;
