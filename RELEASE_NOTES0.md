## 9.6.2
- Adds WidevineCDM back to macOS & Linux.

---

## 9.6.1
- Upgrades to `electron@1.8.2`.
- Removes WidevineCDM.

---

## 9.4.0
- Rebrands to **Appifier**.
- Redesigns to keep only the core functionalities. Don't worry! A fully rewritten version of WebCatalog will be available soon.

---

## 9.3.1
- Fixes bugs.

---

## 9.3.0
- Windows & Linux are no longer officially supported. I don't have enough resources (time & money) to ensure WebCatalog works well across all three platforms.
- Removes auto updater as Windows certificate will expire soon [#254](https://github.com/quanglam2807/appifier/issues/254).
- Fixes critical security bug on Windows ([Electron, CVE-2018-1000006](https://electronjs.org/blog/protocol-handler-fix)).

---

## 9.2.1
- Fixes bugs.

---

## 9.2.0
- Fixes bugs [#244](https://github.com/quanglam2807/appifier/issues/244) [#206](https://github.com/quanglam2807/appifier/issues/206).

---

## 9.1.2
- Fixes bugs.

---

## 9.1.1
- Fixes bugs.

---

## 9.1.0
The project is restructured as a monorepo.

- Upgrades to [appifier@3.0.2](https://www.npmjs.com/package/appifier) (formerly molecule).
  - Adds [CLI support](https://github.com/quanglam2807/appifier#command-line).
  - Fixes: web view loses focus when switching windows [#101](https://github.com/quanglam2807/appifier/issues/101).

---

## 9.0.0
- **Breaking Change for Linux**: Apps are now installed at `~/.webcatalog/apps` instead of `~/.config/WebCatalog/apps`. Apps installed at the old path will be removed automatically [webcatalog/webcatalog#235](https://github.com/quanglam2807/appifier/issues/235).
- Disables resource sharing by default. You can enable it in the new preference dialog.
- Upgrades to [molecule@2.3.0](https://github.com/webcatalog/molecule/releases/tag/v2.3.0).
  - Improves "Find In Page" [webcatalog/webcatalog#163](https://github.com/quanglam2807/appifier/issues/163) [webcatalog/molecule#10](https://github.com/webcatalog/molecule/pull/10). (Thanks to [@swrobel](https://github.com/swrobel))
- Ensures icons to look great on desktop platforms [webcatalog-apps#13](https://github.com/quanglam2807/appifier-apps/pull/13).  (Thanks to [@VirgileACM](https://github.com/VirgileACM))

---

[Older Versions](https://raw.githubusercontent.com/webcatalog/webcatalog/master/RELEASE_NOTES0.md)

---

## 8.0.6 | 8.0.7
- Fixes bug.

---

## 8.0.5
- Fixes bug.

---

## 8.0.4
- Improves error handling.

---

## 8.0.0 | 8.0.1 | 8.0.2 | 8.0.3
- Simplifies functionality.
- Adds ability to create custom app.

#### Breaking Changes:
- Apps installed with WebCatalog 7 and lower are no longer supported. You'll need to manually uninstall and then reinstall them.
- Apps with low-resolution icons are removed from the directory. If you are using any of those apps, you'll need to manually create them.

**[Read More on Our Official Blog](https://medium.com/webcatalog/webcatalog-8-less-for-more-1efa076f76d8)**

---

## 7.7.0 | 7.7.1 | 7.7.2
- Prepares for [WebCatalog 8](https://github.com/quanglam2807/appifier/pull/212).
- Removes authentication.

---

## 7.6.1
- Windows: Fixes a bug which prevents WebCatalog to scan for installed apps.

---

## 7.6.0
- Adds a shortcut to the “Installed Apps” page whenever updates are available.
- Adds option to auto hide menu bar.
- macOS: Adds option to hide both navigation bar and menu bar.

---

## 7.5.0
- Adds proxy support.
- Improves stability.
- Fixes bugs.

---

## 7.4.2
- Disables resource sharing on Windows.

---

## 7.4.1
- Improves stability.
- Fixes bugs.

---

## 7.4.0
- If you have many apps installed, WebCatalog will use much less disk space.
  - Up to 95% on macOS.
  - Up to 70% on Windows.
  - Up to 75% on Linux.
- Linux: Fixes icon missing on dock.

---

## 7.3.2
- Linux: Fixes application names (`"Gmail"` instead of `Gmail`).

---

## 7.3.1
- Linux: Fixes app installation.

---

## 7.3.0
- Linux: Rolls back to .deb, .rpm & .pacman packaging.
- Linux: Adds update notification.
- Fixes bugs.

---

## 7.2
- Adds "Update all" button.
- Fixes bugs.

---

## 7.1
- Linux: Uses [AppImage](https://appimage.org/) packaging.
- Linux: Adds auto-update support.
- Improves installation speed.
- Fixes bugs.

---

## 7.0
A few months ago, we started building WebCatalog from scratch to provide a simpler, more unified experience. Since then, we’ve redesigned the app, rebuilt the core components and fixed many bugs. Here’s an overview of what you’ll see in 7.0.

#### Material Design
Inspired by Google’s beautiful design language, we completely changed WebCatalog’s appearance.

#### Molecule
To move the app development forward, we decided to rebuild the engine powering WebCatalog Apps. We named it Molecule.

With Molecule:

- WebCatalog Apps now run independently from WebCatalog. It means you can uninstall or move WebCatalog to external storage without affecting those apps. 
- Notifications now work properly.
- Many critical bugs are fixed.

We also added Dark Mode, Navigation Bar Toggle, etc. And we planned to add many more features in the upcoming updates.

#### Auto Update
WebCatalog 7+ will download and install new update in background!

**[Read More on Our Official Blog](https://medium.com/webcatalog/announcing-webcatalog-7-0-c5bafe5442a8)**

---

## 6.4
- Improves stability.
- Fixes bugs.

---

## 6.3
- Improves user experience.
- Fixes bugs.

---

## 6.2
- Adds spell checker.

---

## 6.1.0
- Adds back option to use the app without signing in.

---

## 6.0.1
- Fixes bugs.

---

## 6.0.0
- Adds connection error notice.
- Adds right-click menu.
- Removes ad blocker.
- Removes quit on last window option (macOS).
- Removes tab support.
- Removes Facebook authentication.
- Removes Twitter authentication.
- Improves security.

---

## 6.0.0-rc
- Removes ad blocker.
- Removes quit on last window option (macOS).
- Removes tab support.
- Removes Facebook authentication.
- Removes Twitter authentication.

---

## 6.0.0-beta.3
- Fixes bugs.
- Adds option to sign in with email.

---

## 6.0.0-beta.3
- Fixes bugs.
- Adds option to sign in with email.

---

## 6.0.0-beta.2
- Fixes bugs.

---

## 6.0.0-beta
- Adds connection error notice.
- Disables nodeIntegration in renderer to improve security.
- Adds tab support #62 #87 .
- Adds right-click menu #102.

---

## 5.2.1
- Fixes bugs.

---

## 5.2.0
- Adds My Apps page.
- Adds option to use custom user agent.
- Adds confirmation dialog when uninstalling app.
- Fixes bugs.

---

## 5.1.1
- Fixes a critical bug.

---

## 5.1.0
- Adds option to use the app without signing in.
- Hides nav bar in fullscreen mode. (Thanks to [dlanileonardo](https://github.com/dlanileonardo))
- Fixes bugs.

---

## 5.0.0
- Uses new branding.
- Adds accounts system.
- Adds web interface.
- Adds live chat support.
- Adds share buttons.
- Improves app discovery.
- Improves security & performance.
- Fixes bugs.

**[Read More on Our Official Blog](https://medium.com/webcatalog/introduce-webcatalog-5-a-big-overhaul-1f44d6cc4acd)**

---

## 5.0.0-rc
- Adds options to sign in with Facebook & Twitter.
- Adds share buttons.

---

## 5.0.0-beta
- Uses new branding.
- Adds accounts system.
- Adds web interface.
- Adds live chat support.
- Improves app discovery.
- Improves security & performance.

---

## 4.1.12
- Fixes bugs.

---

## 4.1.11
- Fixes a bug with app update detection.

---

## 4.1.10
- Hides custom apps from installed app list.

---

## 4.1.9
- Removes ability to install custom app.
- Improves user interface.
- Improves notification.
- Code signs Windows version.
- Fixes bugs.

---

## 4.1.8 (beta)
- Removes ability to install custom app.
- Improves user interface.
- Improves notification.
- Code signs Windows version.
- Fixes bugs.

---

## 4.1.7 (alpha)
- Fixes bugs.

---

## 4.1.6 (alpha)
- Fixes bugs.
- Code signs Windows version.

---

## 4.1.5 (alpha)
- Fixes bugs.
- **Breaking change (Linux only):** Apps installed in previous versions will not be detected by WebCatalog. You need to remove them manually from `~/.local/share/applications`.

---

## 4.1.4 (alpha)
- Fixes bugs.

---

## 4.1.3 (alpha)
- Fixes bugs.

---

## 4.1.2 (alpha)
- Fixes bugs.

---


## 4.1.1 (alpha)
- Adds ability to update apps installed from WebCatalog.
- Fixes bugs.

---

## 4.1.0 (alpha)
- Removes ability to install custom app.
- Improves user interface.
- Improves notification.
- Fixes bugs.

---

## 4.0.3
- Fixes bugs.

---


## 4.0.2 (alpha)
- Fixes bugs.

---


## 4.0.1 (alpha)
- Fixes bugs.

---

## 4.0.0 (alpha)
- Adds ability to install custom app.
- Blocks ads & tracking.
- Clears storage data when uninstalling.
- Adds options to inject CSS & JS.
- Adds option to customize home URL.
- Removes Choosy support.
- Fixes bugs.

---

## 3.4.4
- Fixes bugs.

---

## 3.4.3 (beta)
- Fixes bugs.

---

## 3.4.2 (beta)
- Brings back WideVineCDM (for Netflix).

---

## 3.4.1
- Removes Windows 32-bit & Linux 32-bit support.
- Fixes [a critical bug on Windows](https://github.com/quanglam2807/appifier/issues/74).

---

## 3.4.0 (beta)
- Adds Windows 32-bit & Linux 32-bit support.
- Fixes bugs, including [Feedly's login bug](https://github.com/quanglam2807/appifier/issues/70).
- Removes Flash, Chromecast and WidevineCdm support. *Apps with Flash and WidevineCdm will be removed from the catalog*.

---

## 3.3.1 (beta)
- Adds Windows 32-bit support.

---

## 3.3.0
- Fixes bugs & improves stability.
- Shows page title on title bar (Windows).
- Creates desktop shortcuts automatically when installing apps (Windows).
- Hides title bar in full screen mode (macOS).

---

## 3.2.7
- Only shows navigation bar on hover (less distraction).

---

## 3.2.6
- Fixes bug with auto updater which [causes apps installed from WebCatalog to crash on startup](https://github.com/quanglam2807/appifier/issues/47).

---

## 3.2.5
- Fixes bugs.

---

## 3.2.4 (beta)
- Fixes bugs.

---

## 3.2.3 (beta)
- Fixes bugs.

---

## 3.2.2 (beta)
- Adds Donate button.
- Improves About window.
- Adds ability for apps installed from WebCatalog to open URLs.
- Allows OpenGL applications to utilize the integrated GPU.
- Allows apps to open in assigned workspace.
- Fixes bugs.

---

## 3.2.1 (beta)
- Adds ability for apps installed from WebCatalog to open URLs.
- Allows OpenGL applications to utilize the integrated GPU.

---

## 3.2.0 (beta)
- Adds Donate button.
- Improves About window.

---

## 3.1.1
- Fixes bugs.

---


## 3.1.0 (beta)
- Adds Auto Updater (macOS).

---

## 3.0.6 (beta)
- Fixes bugs.

---

## 3.0.5 (beta)
- Fixes bugs.

---

## 3.0.4 (beta)
- Fixes bugs.

---

## 3.0.3 (beta)
- Adds shortcut key to launch Settings.
- Removes trial mode.

---

## 3.0.2 (beta)
- Fixes bugs.

---

## 3.0.1 (beta)
- Fixes bugs.

---

## 3.0.0 (beta)
- Adds Find in Page.
- Adds Navigation bar.
- Adds Per-app settings.
- Adds options to quit app when last window is closed (macOS only).

---

## 2.9.1
- Upgrades to Electron 1.6 (from 1.4), Chrome 56 (from 53).

---

## 2.9.0
- Adds option to remember the last page you open.
- Adds option to swipe to navigate (macOS only).
- Fixes bugs.

---


## 2.8.4
- Fixes switching account bug in Google apps.

---

## 2.8.3
- Fixes adding account bug in Google apps.

---

## 2.8.2
- Fixes calling bug in Facebook Messenger.

---


## 2.8.1
- Fixes some bugs.

---


## 2.8.0
- Adds Chromecast support.
- Adds installed app list.
- Fixes some bugs.

---


## 2.7.2
- Fixes Linux installers.

---

## 2.7.1
- Fixes a critical bug on Linux and macOS.

---

## 2.7.0
- Adds Linux support.
- Fixes bugs.

---

## 2.6.0
- Fixes app installation on Windows.
- Uses independent session for each app.

---

## 2.5.0
- Fixes update mechanism.
- Fixes many minor bugs.
- Adds version number to settings dialog.
- Improves Windows installer.

---

## 2.4.1
- Fixes OAuth authentication.

---

## 2.4.0
- Add Windows support.
- Fixes a few bugs.

---

## 2.3.0
- Adds Flash support. (Spotify now works properly).
- Adds WidevineCdm support. (Netflix now works properly).
- Makes external URLs open in browser.

---

## 2.2.0
- Fixes many bugs.
- Allows WebCatalog window to be moved around by dragging nav bar.
- Allows WebCatalog to run when other web apps are running.
- Adds refreshing button.

---

## 2.1.0
- Fixes many bugs.
- Adds badge support.

---

## 2.0.2
- Fixes many bugs.
- Improves user experience.


---

## 2.0.1
- Adds Auto updater.

---

## 2.0.0
- First release.
