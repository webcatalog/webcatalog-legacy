<!-- https://raw.githubusercontent.com/electron/electron-apps/master/contributing.md -->

# Contributing

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

This project adheres to the Contributor Covenant [code of conduct](https://github.com/webcatalog/webcatalog/blob/master/CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code. Please report unacceptable
behavior to support@webcatalog.io.

The following is a set of guidelines for contributing to `webcatalog-apps`.
These are just guidelines, not rules. Use your best judgment and feel free to
propose changes to this document in a pull request.

## Adding your app

If you have an web application you'd like to see added, please
[open a pull request](https://help.github.com/articles/creating-a-pull-request/)!
All that's required is a basic YML file and a PNG icon.

### Adding your app by hand 💪

An easy way to add a new app is to copy an existing app and edit its metadata.

To do so, create a new directory in the `apps` directory and include a `.yml`
file and `.png` icon file. The directory can only contain numbers,
lowercase letters, and dashes, and the yml and icon files should be named
like so:

```
apps
└── my-cool-app
    ├── my-cool-app-icon.png
    └── my-cool-app.yml
```

### YML File Rules

- `name` is required.
- `url` is required, and must be a fully-qualified URL.
- `category` is required.
- No fields should be left blank.

### Categories

`category` is required and must be one of the following values:

* Books
* Business
* Catalogs
* Developer Tools
* Education
* Entertainment
* Finance
* Food & Drink
* Games
* Health & Fitness
* Graphics & Design
* Lifestyle
* Kids
* Magazines & Newspapers
* Medical
* Music
* Navigation
* News
* Photo & Video
* Productivity
* Reference
* Shopping
* Social Networking
* Sports
* Travel
* Utilities

### Icons

- Must be a `.png`
- Must be a square
- Must be at least 256px by 256px. Should be at 1024px by 1024px.
- Must **not** be a copy of another company's or application's icon (see submission guidelines below)

### Company Logos and Names

We disallow apps that are using the names of _other_ companies or icons that we find too similar to the logos of other companies without verifying their permission to do so.

### Submission Guidelines

Some things to keep in mind when preparing your app for submission. Heavily inspired by the [awesome-electron](https://github.com/sindresorhus/awesome-electron) submission guidelines.

- **The pull request should have a useful title and include a link to the thing you're submitting and why it should be included.**
- If you just created something, wait at least 20 days before submitting.
- Check your spelling and grammar.


## Testing

On Travis CI, the `npm test` command is run, which only tests human-submitted data.
