import gmailIcon from '../images/gmail.png';
import yahooIcon from '../images/yahoo.png';
import yandexIcon from '../images/yandex.png';
import outlookIcon from '../images/outlook.png';
import office365Icon from '../images/office365.png';
import fastmailIcon from '../images/fastmail.png';
import zohoIcon from '../images/zoho.png';
import icloudIcon from '../images/icloud.png';

const EMAIL_SERVICES = {
  gmail: {
    name: 'Gmail',
    url: 'https://mail.google.com',
    mailtoHandler: 'https://mail.google.com/mail/?extsrc=mailto&url=%s',
    icon: gmailIcon,
  },
  yahoo: {
    name: 'Yahoo Mail',
    url: 'https://mail.yahoo.com',
    mailtoHandler: 'https://compose.mail.yahoo.com/?To=%s',
    icon: yahooIcon,
  },
  outlook: {
    name: 'Outlook',
    url: 'https://outlook.live.com/owa/',
    mailtoHandler: 'https://outlook.live.com/owa/?path=/mail/action/compose&to=%s',
    icon: outlookIcon,
  },
  office365: {
    name: 'Office 365',
    url: 'https://outlook.live.com/owa/',
    mailtoHandler: 'https://outlook.live.com/owa/?path=/mail/action/compose&to=%s',
    icon: office365Icon,
  },
  zoho: {
    name: 'Zoho Mail',
    url: 'https://mail.zoho.com',
    mailtoHandler: 'https://mail.zoho.com/mail/compose.do?extsrc=mailto&mode=compose&tp=zb&ct=%s',
    icon: zohoIcon,
  },
  fastmail: {
    name: 'FastMail',
    url: 'https://fastmail.com',
    mailtoHandler: 'http://www.fastmail.fm/action/compose/?mailto=%s',
    icon: fastmailIcon,
  },
  icloud: {
    name: 'iCloud',
    url: 'https://www.icloud.com/#mail',
    mailtoHandler: 'https://www.icloud.com/message/current/en-us/#compose?to=%s',
    icon: icloudIcon,
  },
  yandex: {
    name: 'Yandex.Mail',
    url: 'https://mail.yandex.com',
    mailtoHandler: 'https://mail.yandex.com/compose?mailto=%s',
    icon: yandexIcon,
  },
};

export default EMAIL_SERVICES;
