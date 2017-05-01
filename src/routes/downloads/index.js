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

downloadsRouter.get('/downloads/:platform(mac|windows|linux)', (req, res, next) => {
  const platform = req.params.platform;
  const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);

  let dockName = 'dock';
  if (platform === 'windows') dockName = 'taskbar';
  if (platform === 'linux') dockName = 'launcher';

  App.findAll({
    where: {
      id: {
        $in: [
          '1eceee7d-fb6c-49ff-ac65-d698842f7135',
          'a2c752cf-ea98-4434-88ea-c23b0cdec645',
          '621434c9-8f4d-4c06-83fa-9b3b99e3820b',
          '69b548b4-1128-4783-b727-453a9358c210',
          '43c2935a-77d9-4e9d-88cd-c603f7bce926',

          '867609d2-6037-441f-a425-79a7032da1fa',
          'c7b88878-7b4d-406e-9a9b-433bddb0b071',
          'f2374bfb-ddc8-4d54-82c8-e3e235528626',
          '0bbee208-4381-4f7b-90fa-ad752d23a4da',
          'e72e14f4-d97f-4b5e-be0e-af7aa63cb1f5',
        ],
      },
      isActive: true,
    },
    attributes: ['id', 'name', 'url'],
    order: [['installCount', 'DESC']],
  })
  .then(topApps => res.render('downloads/index', { version: process.env.VERSION, platform, dockName, topApps, title: `Download WebCatalog for ${platformName}` }))
  .catch(next);
});

module.exports = downloadsRouter;
