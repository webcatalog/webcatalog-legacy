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

---

[Older Versions](https://raw.githubusercontent.com/webcatalog/webcatalog/master/RELEASE_NOTES0.md)
