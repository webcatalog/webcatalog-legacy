const path = require('path');
const settings = require('electron-settings');
const { app, ipcMain } = require('electron');

const sendToAllWindows = require('./send-to-all-windows');
const extractHostname = require('./extract-hostname');

const MAILTO_URLS = require('../constants/mailto-urls');

const appJson = require('../app.json');

const getDefaultDownloadsPath = () => path.join(app.getPath('home'), 'Downloads');

const getDefaultPauseNotificationsByScheduleFrom = () => {
  const d = new Date();
  d.setHours(23);
  d.setMinutes(0);
  return d.toString();
};

const getDefaultPauseNotificationsByScheduleTo = () => {
  const d = new Date();
  d.setHours(7);
  d.setMinutes(0);
  return d.toString();
};

const getDefaultSpellCheckerLanguages = () => {
  // language code extracted from https://github.com/electron/electron/releases/download/v8.0.0-beta.3/hunspell_dictionaries.zip
  const supportedLangs = [
    'af-ZA',
    'bg-BG',
    'ca-ES',
    'cs-CZ',
    'cy-GB',
    'da-DK',
    'de-DE',
    'el-GR',
    'en-US', 'en-AU', 'en-CA', 'en-GB', // default to en-US
    'es-ES',
    'et-EE',
    'fa-IR',
    'fo-FO',
    'fr-FR',
    'he-IL',
    'hi-IN',
    'hr-HR',
    'hu-HU',
    'hy',
    'id-ID',
    'it-IT',
    'ko',
    'lt-LT',
    'lv-LV',
    'nb-NO',
    'nl-NL',
    'pl-PL',
    'pt-PT', 'pt-BR', // default Portugese (Portugal)
    'ro-RO',
    'ru-RU',
    'sh',
    'sk-SK',
    'sl-SI',
    'sq',
    'sr',
    'sv-SE',
    'ta-IN',
    'tg-TG',
    'tr-TR',
    'uk-UA',
    'vi-VN',
  ];

  const locale = app.getLocale();

  if (!locale) return null;

  if (supportedLangs.indexOf('locale') > -1) return [locale];

  // find first identical language (same language code, different country code)
  const identicalLang = supportedLangs
    .find((lang) => locale.substring(0, 2) === lang.substring(0, 2));
  if (identicalLang) return [identicalLang];

  return ['en-US'];
};

// scope
const v = '2018.2';

const defaultPreferences = {
  askForDownloadPath: true,
  attachToMenubar: false,
  autoCheckForUpdates: true,
  cssCodeInjection: null,
  downloadPath: getDefaultDownloadsPath(),
  jsCodeInjection: null,
  lastCheckForUpdates: 0,
  navigationBar: false,
  pauseNotifications: null,
  pauseNotificationsBySchedule: false,
  pauseNotificationsByScheduleFrom: getDefaultPauseNotificationsByScheduleFrom(),
  pauseNotificationsByScheduleTo: getDefaultPauseNotificationsByScheduleTo(),
  rememberLastPageVisited: false,
  shareWorkspaceBrowsingData: false,
  sidebar: Boolean(MAILTO_URLS[extractHostname(appJson.url)]),
  spellChecker: true,
  spellCheckerLanguages: null,
  swipeToNavigate: true,
  themeSource: process.platform === 'darwin' ? 'system' : 'light',
  unreadCountBadge: true,
};

const getPreferences = () => {
  // cannot init at launch as app.getLocale() is undefined before app.on('ready')
  if (defaultPreferences.spellCheckerLanguages == null) {
    defaultPreferences.spellCheckerLanguages = getDefaultSpellCheckerLanguages();
  }
  return { ...defaultPreferences, ...settings.get(`preferences.${v}`) };
};

const getPreference = (name) => {
  if (settings.has(`preferences.${v}.${name}`)) {
    return settings.get(`preferences.${v}.${name}`);
  }
  // cannot init at launch as app.getLocale() is undefined before app.on('ready')
  if (name === 'spellCheckerLanguages' && defaultPreferences.spellCheckerLanguages == null) {
    defaultPreferences.spellCheckerLanguages = getDefaultSpellCheckerLanguages();
  }
  return defaultPreferences[name];
};

const setPreference = (name, value) => {
  settings.set(`preferences.${v}.${name}`, value);
  sendToAllWindows('set-preference', name, value);

  if (name.startsWith('pauseNotifications')) {
    ipcMain.emit('request-update-pause-notifications-info');
  }
};

const resetPreferences = () => {
  settings.deleteAll();

  const preferences = getPreferences();
  Object.keys(preferences).forEach((name) => {
    sendToAllWindows('set-preference', name, preferences[name]);
  });
};

module.exports = {
  getPreference,
  getPreferences,
  resetPreferences,
  setPreference,
};
