import express from 'express';
import errors from 'throw.js';
import index from '../algolia-index';

const appsRouter = express.Router();

const generatePageList = (currentPage, totalPage) => {
  const pages = [currentPage];

  if (currentPage - 1 >= 1) pages.unshift(currentPage - 1);

  if (currentPage + 1 <= totalPage) pages.push(currentPage + 1);

  if (currentPage + 2 === totalPage) pages.push(totalPage);
  if (currentPage + 3 <= totalPage) pages.push(0, totalPage);

  if (currentPage - 2 === 1) pages.unshift(1);
  else if (currentPage - 3 >= 1) pages.unshift(1, 0);

  return pages;
};

const extractDomain = (url) => {
  try {
    const matches = url.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
    const domain = matches && matches[1];
    return domain.replace('www.', '');
  } catch (err) {
    return null;
  }
};

appsRouter.get('/', (req, res) => {
  res.redirect('/directory/search');
});

appsRouter.get('/search', (req, res, next) => {
  const currentPage = parseInt(req.query.page, 10) || 1;
  const limit = 36;
  const query = req.query.q || '';

  return index.search(query, { page: currentPage - 1, hitsPerPage: limit })
    .then(({ hits, nbPages }) =>
      res.render('directory/search', {
        title: query.length > 0 ? `${query} - Directory` : 'All Apps - Directory',
        apps: hits,
        currentPage,
        pages: generatePageList(currentPage, nbPages),
        totalPage: nbPages,
        searchQuery: query,
      }))
    .catch(next);
});

appsRouter.get('/app/:id', (req, res, next) => {
  index.getObject(req.params.id)
    .then((app) => {
      if (!app) throw new errors.NotFound();

      let description = `${app.name} for Mac, Windows & Linux.`;
      if (app.description) description += ` ${app.description.split('. ')[0]}.`;

      const ua = req.headers['user-agent'];
      let platform = 'mobile';
      if (/(Intel|PPC) Mac OS X/.test(ua)) {
        platform = 'mac';
      } else if (/(Linux x86_64|Linux i686)/.test(ua)) {
        platform = 'linux';
      } else {
        platform = 'windows';
      }

      res.render('directory/app', {
        title: `${app.name} for Mac, Windows & Linux`,
        description,
        app,
        extractDomain,
        platform,
        version: process.env.VERSION,
      });
    })
    .catch(next);
});

export default appsRouter;
