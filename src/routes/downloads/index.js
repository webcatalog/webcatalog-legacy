import express from 'express';

import App from '../../models/App';

const downloadsRouter = express.Router();

downloadsRouter.get(['/', '/downloads'], (req, res) => {
  const ua = req.headers['user-agent'];
  if (/(Intel|PPC) Mac OS X/.test(ua)) {
    res.redirect('/downloads/mac');
  } else if (/(Linux x86_64|Linux i686)/.test(ua)) {
    res.redirect('/downloads/linux');
  } else {
    res.redirect('/downloads/windows');
  }
});

downloadsRouter.get('/downloads/:platform(mac|windows|linux)', (req, res) => {
  const platform = req.params.platform;
  const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);

  let dockName = 'dock';
  if (platform === 'windows') dockName = 'taskbar';
  if (platform === 'linux') dockName = 'launcher';

  App.findAll({
    where: { isActive: true },
    limit: 10,
    order: [['installCount', 'DESC']],
  })
  .then((topApps) => {
    res.render('downloads/index', { version: process.env.VERSION, platform, dockName, topApps, title: `Download WebCatalog for ${platformName}` });
  });
});

module.exports = downloadsRouter;
