<!-- https://raw.githubusercontent.com/electron/electron-apps/master/readme.md --->

# webcatalog-apps [![Build Status](https://travis-ci.org/webcatalog/webcatalog-apps.svg?branch=master)](https://travis-ci.org/webcatalog/webcatalog-apps)

A collection of apps for [WebCatalog](https://github.com/webcatalog/webcatalog).

## Adding your app

If you have an web application you'd like to see added,
please read the [contributing](CONTRIBUTING.md) doc.

## How it Works

This package is a joint effort between humans and robots.

First, a human adds an app:

```
apps
└── hyper
    ├── hyper-icon.png
    └── hyper.yml
```

The yml file requires just a few fields:

```yml
name: Hyper
url: 'https://hyper.is'
category: 'Developer Tools'
```

The human then opens a PR. Tests pass, the PR gets merged. Yay!

Later, a bot comes along and generate additional files. Lastly, the bot publishes a new release to S3.

## License

MIT
