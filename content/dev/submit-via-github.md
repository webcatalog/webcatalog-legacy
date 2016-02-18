---
title: Submit New App via GitHub
---

## SUBMIT NEW APP VIA GITHUB

Before submitting your app, please notice that while WebCatalog for Desktop (Windows, OS X and Linux) supports any web apps, WebCatalog for Mobile (Android and iOS) only supports web apps that support `standalone` mode. You can check out these documents [[1](https://en.wikipedia.org/wiki/Single-page_application), [2](https://gist.github.com/irae/1042167), [3](https://developer.mozilla.org/en/docs/Mozilla/Mobile/Viewport_meta_tag), [4](https://developer.apple.com/library/iad/documentation/iPhone/Conceptual/SafariJSDatabaseGuide/OfflineApplicationCache/OfflineApplicationCache.html)] to make sure if your app does, or you can only submit your app for desktop users.

To submit a new app, please [open a pull request](https://help.github.com/categories/collaborating-on-projects-using-pull-requests/) for these following changes.


### STEP 1
Add new app entry in `/content/app/_APP_ID.md` in this following format:

<script src="https://gist.github.com/quanglam2807/a0197a93f2c96e7dc576.js"></script>

- `id`, `title`, `app_url`, `categories`, `platforms`, `description` are required.

- `short_name`: Provide if you want to use an alternative name for iOS home screen. [What is the maximum length the iOS application name can be?](https://stackoverflow.com/questions/6094954/what-is-the-maximum-length-the-ipad-application-name-can-be)

- `developer`: The name of the developer of the app (company or individual), not the person who submit the app.

- `categories`: The category IDs of the app (based on [Windows Store](https://msdn.microsoft.com/en-us/library/windows/apps/mt148528.aspx)). Maximum 2.

    - books-reference
    - business
    - developer
    - education
    - entertainment
    - food  
    - games
    - government
    - health
    - kids-family
    - lifestyle
    - medical   
    - multimedia
    - music
    - navigation
    - news-weather
    - finance   
    - photo-video
    - productivity
    - shopping  
    - social
    - sports
    - travel
    - utilities

- `ios_status_bar_style`: The iOS status bar style of your app. Set to `default`, the status bar appears normal. If set to `black`, the status bar has a black background. If set to `black-translucent`, the status bar is black and translucent. If set to `default` or `black`, the web content is displayed below the status bar. If set to `black-translucent`, the web content is displayed on the entire screen, partially obscured by the status bar. If this field is not set, `default` will be used.

- `description`: There is no limit on the length but only 120 characters of the description will be displayed in the list view.

**SAMPLE**
<script src="https://gist.github.com/quanglam2807/b8a2d3ba621b68a506e7.js"></script>

---

### STEP 2
Create a folder named `_APP_ID` in `static/app` and add these following required icon files in the newly created folder.

`windows.png` (if you want to support Windows desktop): 1024x102zpx, should be transparent.

`linux.png` (if you want to support Linux desktop): 1024x1024px, should be transparent.

`osx.png` (if you want to support OS X): 1024x1024px, should be transparent. [Design Guidelines](https://developer.apple.com/library/mac/documentation/UserExperience/Conceptual/OSXHIGuidelines/IconsGraphics.html#//apple_ref/doc/uid/20000957-CH14-SW1). OS X icon will be the icon displayed on the website.

`ios.png` (if you want to support iOS): 512x512px, should be not transparent and rounded. Rounded corners of the icon will be handled by iOS. [Design Guidelines](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/IconMatrix.html)

`android.png` (if you want to support Android): 512x512px, should be transparent. [Design Guidelines](https://www.google.com/design/spec/style/icons.html)

---

As soon as your pull request is merged and a release tag is set, [Travis CI](https://travis-ci.org) will automatically compile and publish the app on WebCatalog.
