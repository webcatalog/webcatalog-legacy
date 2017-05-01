import express from 'express';

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

  res.render('downloads/index', {
    version: process.env.VERSION,
    platform,
    dockName,
    title: `Download WebCatalog for ${platformName}`,
  });
});

module.exports = downloadsRouter;
