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

### Can I use WebCatalog with [Choosy](https://www.choosyosx.com) on macOS?
Due to [technical limitations](https://github.com/webcatalog/webcatalog/issues/44), at the moment, using WebCatalog with [Choosy](https://www.choosyosx.com) is possible but will be a little bit complicated.

Even though the apps are located at `~/Applications/WebCatalog Apps`, they will not work properly with Choosy. Instead, you need to go to `~/.webcatalog` (Finder > Go to Folder). There, you will also find all the apps you install from WebCatalog. You can move these apps to any locations you like and add them to Choosy to configure your system to fit your preferences.

In the future updates, we will try to simplify this process.
