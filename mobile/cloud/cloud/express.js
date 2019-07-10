express = require('express');
app = express();

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'jade');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body
var parseExpressHttpsRedirect = require('parse-express-https-redirect');
app.use(parseExpressHttpsRedirect());

const categoryList = [
	{
		id: 'books',
		name: 'Books'
	},
	{
		id: 'business',
		name: 'Business'
	},
	{
		id: 'catalogs',
		name: 'Catalogs'
	},
	{
		id: 'education',
		name: 'Education'
	},
	{
		id: 'entertainment',
		name: 'Entertainment'
	},
	{
		id: 'finance',
		name: 'Finance'
	},
	{
		id: 'food-drink',
		name: 'Food & Drink'
	},
	{
		id: 'games',
		name: 'Games'
	},
	{
		id: 'health-fitness',
		name: 'Health & Fitness'
	},
	{
		id: 'kids',
		name: 'Kids'
	},
	{
		id: 'lifestyle',
		name: 'Lifestyle'
	},
	{
		id: 'magazines-newspapers',
		name: 'Magazine & Newspapers'
	},
	{
		id: 'medical',
		name: 'Medical'
	},
	{
		id: 'music',
		name: 'Music'
	},
	{
		id: 'navigation',
		name: 'Navigation'
	},
	{
		id: 'news',
		name: 'News'
	},
	{
		id: 'photo-video',
		name: 'Photo & Video'
	},
	{
		id: 'productivity',
		name: 'Productivity'
	},
	{
		id: 'reference',
		name: 'Reference'
	},
	{
		id: 'shopping',
		name: 'Shopping'
	},
	{
		id: 'social',
		name: 'Social Networking'
	},
	{
		id: 'sports',
		name: 'Sports'
	},
	{
		id: 'travel',
		name: 'Travel'
	},
	{
		id: 'utilities',
		name: 'Utilities'
	},
	{
		id: 'weather',
		name: 'Weather'
	}
];
const categoryIdList = categoryList.map(function(category) {
  return category.id;
});

// path and HTTP verb using the Express routing API.
app.get('/submit-new-app', function(req, res) {
	if (req.query.success == '1') {
		res.render('submit-new-app', {
			categories: categoryList,
			successMessage: 'Your app have been submitted successfully. It will be availalbe on WebStores soon after we approve it.'
		});
	}
	else {
  	res.render('submit-new-app', { categories: categoryList });
	}
});

app.post('/submit-new-app', function(req, res) {
  var errorMessage = null;
  if ((!req.body.name) || (!req.body.url) || (!req.body.icon512x512) || (!req.body.category)) {
    errorMessage = 'You need to fill in all required fields';
  }
  else if (categoryIdList.indexOf(req.body.category) < 0) {
    errorMessage = 'Don\'t hack, please';
  }
	else if (['default', 'black', 'black-translucent'].indexOf(req.body.statusBarStyle) < 0) {
		errorMessage = 'Don\'t hack, please';
	}

  if (errorMessage) {
    res.render('submit-new-app', {
      categories: categoryList,
      name: req.body.name,
      url: req.body.url,
      contactEmail: req.body.contactEmail,
      errorMessage: errorMessage
    });
  }
  else {
    var WebApp = Parse.Object.extend("WebApp");
    var webApp = new WebApp();
    webApp.set('name', req.body.name);
    webApp.set('shortName', req.body.shortName);
		webApp.set('developer', req.body.developer);
		webApp.set('description', req.body.description);
    webApp.set('url', req.body.url);
    webApp.set('contactEmail', req.body.contactEmail);
    webApp.set('category', req.body.category);

    var icon512x512ParseFile = new Parse.File("icon512x512.png", {
      base64: req.body.icon512x512
    });

    webApp.set('icon512x512', icon512x512ParseFile);

		var approved = (req.body.contactEmail == 'quang.lam2807@gmail.com');
    webApp.set('approved', approved);

    webApp.save(null, {
      useMasterKey: true,
      success: function(webAppId) {
				res.redirect('/submit-new-app?success=1');
      },
      error: function(webApp, error) {
        res.render('submit-new-app', {
          categories: categoryList,
          name: req.body.name,
          url: req.body.url,
          contactEmail: req.body.contactEmail,
          errorMessage: 'Failed to submit new app, with error code: ' + error.message
        });
      }
    });

  }
});

app.get('/web-app/:id', function(req, res) {
  var WebApp = Parse.Object.extend("WebApp");
  var query = new Parse.Query(WebApp);
	query.select('name', 'shortName', 'url', 'icon152x152', 'icon144x144', 'icon76x76', 'icon72x72', 'icon180x180', 'icon114x114', 'icon57x57', 'statusBarStyle');
  query.get(req.params.id, {
    success: function(webApp) {
			Parse.Cloud.httpRequest({ url: webApp.get('icon180x180').url() }).then(function(response) {
				res.render('web-app', {
					id: webApp.id,
	        name: webApp.get('name'),
	        shortName: webApp.get('shortName') || webApp.get('name'),
	        url: webApp.get('url'),
	        icon152x152: webApp.get('icon152x152').url(),
	        icon144x144: webApp.get('icon144x144').url(),
	        icon76x76: webApp.get('icon76x76').url(),
	        icon72x72: webApp.get('icon72x72').url(),
	        icon180x180: webApp.get('icon180x180').url(),
	        icon114x114: webApp.get('icon114x114').url(),
	        icon57x57: webApp.get('icon57x57').url(),
					statusBarStyle: webApp.get('statusBarStyle') || 'default',
					displayIcon: 'data:image/png;base64,' + response.buffer.toString('base64')
	      });
			});

    },
    error: function(object, error) {
      res.status('404');
      res.send('Not Found');
    }
  });
});

app.get('/web-app/:id/appcache.manifest', function(req, res) {
	var WebApp = Parse.Object.extend("WebApp");
	var query = new Parse.Query(WebApp);
	query.get(req.params.id, {
		success: function(webApp) {
			res.setHeader('Content-Type', 'text/cache-manifest');
			var cacheManifest = 'CACHE MANIFEST' + '\n' + '/images/favicon.png';
			cacheManifest += '\n' + '/web-app/' + webApp.id;
			res.send(cacheManifest);
		},
		error: function(object, error) {
			res.status('404');
			res.send('Not Found');
		}
	});
});

// Attach the Express app to Cloud Code.
app.listen();
