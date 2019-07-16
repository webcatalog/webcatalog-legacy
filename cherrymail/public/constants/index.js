const isDev = require('electron-is-dev');
const path = require('path');

const REACT_PATH = isDev ? 'http://localhost:3000' : `file://${path.resolve(__dirname, '..', '..', 'build', 'index.html')}`;

const EMAIL_SERVICES = {
  gmail: {
    name: 'Gmail',
    url: 'https://mail.google.com',
    mailtoHandler: 'https://mail.google.com/mail/?extsrc=mailto&url=%s',
  },
  yahoo: {
    name: 'Yahoo Mail',
    url: 'https://mail.yahoo.com',
    mailtoHandler: 'https://compose.mail.yahoo.com/?To=%s',
  },
  yandex: {
    name: 'Yandex.Mail',
    url: 'https://mail.yandex.com',
    mailtoHandler: 'https://mail.yandex.com/compose?mailto=%s',
  },
  outlook: {
    name: 'Outlook',
    url: 'https://outlook.live.com/owa/',
    mailtoHandler: 'https://outlook.live.com/owa/?path=/mail/action/compose&to=%s',
  },
  office365: {
    name: 'Office 365',
    url: 'https://outlook.live.com/owa/',
    mailtoHandler: 'https://outlook.live.com/owa/?path=/mail/action/compose&to=%s',
  },
  zoho: {
    name: 'Zoho Mail',
    url: 'https://mail.zoho.com',
    mailtoHandler: 'https://mail.zoho.com/mail/compose.do?extsrc=mailto&mode=compose&tp=zb&ct=%s',
  },
  fastmail: {
    name: 'FastMail',
    url: 'https://fastmail.com',
    mailtoHandler: 'http://www.fastmail.fm/action/compose/?mailto=%s',
  },
  icloud: {
    name: 'iCloud',
    url: 'https://www.icloud.com/#mail',
    mailtoHandler: 'https://www.icloud.com/message/current/en-us/#compose?to=%s',
  },
};

module.exports = {
  REACT_PATH,
  EMAIL_SERVICES,
};
