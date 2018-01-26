## 9.3.1
- Fixes bugs.

---

## 9.3.0
- Windows & Linux are no longer officially supported. I don't have enough resources (time & money) to ensure WebCatalog works well across all three platforms.
- Removes auto updater as Windows certificate will expire soon [#254](https://github.com/quanglam2807/webcatalog/issues/254).
- Fixes critical security bug on Windows ([Electron, CVE-2018-1000006](https://electronjs.org/blog/protocol-handler-fix)).

---

## 9.2.1
- Fixes bugs.

---

## 9.2.0
- Fixes bugs [#244](https://github.com/quanglam2807/webcatalog/issues/244) [#206](https://github.com/quanglam2807/webcatalog/issues/206).

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
  - Adds [CLI support](https://github.com/quanglam2807/webcatalog#command-line).
  - Fixes: web view loses focus when switching windows [#101](https://github.com/quanglam2807/webcatalog/issues/101).

---

## 9.0.0
- **Breaking Change for Linux**: Apps are now installed at `~/.webcatalog/apps` instead of `~/.config/WebCatalog/apps`. Apps installed at the old path will be removed automatically [webcatalog/webcatalog#235](https://github.com/quanglam2807/webcatalog/issues/235).
- Disables resource sharing by default. You can enable it in the new preference dialog.
- Upgrades to [molecule@2.3.0](https://github.com/webcatalog/molecule/releases/tag/v2.3.0).
  - Improves "Find In Page" [webcatalog/webcatalog#163](https://github.com/quanglam2807/webcatalog/issues/163) [webcatalog/molecule#10](https://github.com/webcatalog/molecule/pull/10). (Thanks to [@swrobel](https://github.com/swrobel))
- Ensures icons to look great on desktop platforms [webcatalog-apps#13](https://github.com/quanglam2807/webcatalog-apps/pull/13).  (Thanks to [@VirgileACM](https://github.com/VirgileACM))

---

[Older Versions](https://raw.githubusercontent.com/webcatalog/webcatalog/master/RELEASE_NOTES0.md)
