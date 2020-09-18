mkdir icon-ico
sips -z 16 16     icon-unplated.png --out icon-ico/icon_16x16.png
sips -z 24 24     icon-unplated.png --out icon-ico/icon_24x24.png
sips -z 32 32     icon-unplated.png --out icon-ico/icon_32x32.png
sips -z 48 48     icon-unplated.png --out icon-ico/icon_48x48.png
sips -z 64 64     icon-unplated.png --out icon-ico/icon_64x64.png
sips -z 128 128   icon-unplated.png --out icon-ico/icon_128x128.png
sips -z 256 256   icon-unplated.png --out icon-ico/icon_256x256.png
# https://formulae.brew.sh/formula/imagemagick
# https://superuser.com/questions/227736/how-do-i-convert-a-png-into-a-ico
convert icon-ico/*.png icon.ico
rm -R icon-ico