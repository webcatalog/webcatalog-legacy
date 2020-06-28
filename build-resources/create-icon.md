To create ICNS:
```bash
iconutil -c icns icon.iconset
```

To create ICO:
```bash
convert icon.iconset/icon_16x16.png icon.iconset/icon_32x32.png icon.iconset/icon_48x48.png icon.iconset/icon_32x32@2x.png icon.iconset/icon_96x96.png icon.iconset/icon_128x128.png icon.iconset/icon_256x256.png icon.ico
```
Ref: https://docs.microsoft.com/en-us/windows/win32/uxguide/vis-icons