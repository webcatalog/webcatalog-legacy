# Frequently Asked Questions
### Does WebCatalog work on Linux?
At the moment, WebCatalog only works on macOS & Windows. But we are working to bring it to Linux.

### Where are the apps installed from WebCatalog located on macOS?
The apps are located at `~/Applications/WebCatalog Apps`.

### Where are the apps installed from WebCatalog located on Windows?
The apps are located at `%userprofile%/AppData/Roaming/Microsoft/Windows/Start Menu/Programs/WebCatalog Apps`.

### Why does WebCatalog not open on RPM-based Linux distributions?
You need to `libXScrnSaver` to run WebCatalog ([Details](https://github.com/atom/atom/issues/13176)). Open Terminal & run:
```bash
pkcon install libXScrnSaver
```

### How can I install WebCatalog with Pacman on Arch-based Linux distributions?
Open Terminal & run:
```bash
sudo pacman -U path-to-webcatalog-pacman-file
```
