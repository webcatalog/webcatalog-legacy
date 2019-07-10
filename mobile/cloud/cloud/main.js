Image = require('parse-image');
require('cloud/express.js');

var iconSizes = [512, 152, 144, 76, 72, 180, 114, 57];

Parse.Cloud.beforeSave('WebApp', function(request, response) {
  var webApp = request.object;
  if (!webApp.get('icon512x512')) {
    response.error('Web App must have a icon 512x512px.');
    return;
  }

  if (!webApp.dirty('icon512x512')) {
    // The icon isn't being modified.
    response.success();
    return;
  }

  Parse.Cloud.httpRequest({
   url: webApp.get('icon512x512').url()
  })
  .then(function(response) {
    var promises = [];
    iconSizes.forEach(function(iconSize) {
      var image = new Image();
      // Generate smaller size
      promises.push(
        image.setData(response.buffer)
        .then(function(dImage) {
          return dImage.scale({
            width: iconSize,
            height: iconSize
          });
        })
        .then(function(scaledImage) {
          return scaledImage.setFormat('PNG');
        })
        .then(function(scaledImage) {
          // Get the image data in a Buffer.
          return scaledImage.data();
        })
        .then(function(buffer) {
          // Save the image into a new file.
          var base64 = buffer.toString('base64');
          var scaled = new Parse.File('icon' + iconSize + 'x' + iconSize + '.png', { base64: base64 });
          return scaled.save();
        }).then(function(scaled) {
          // Attach the image file to the original object.
          webApp.set('icon' + iconSize + 'x' + iconSize, scaled);
        })
      )
     });
    // Return a new promise that is resolved when all are finished.
    return Parse.Promise.when(promises);
  })
  .then(function(result) {
    response.success();
  }, function(error) {
    response.error(error);
  });
});

Parse.Cloud.define('increaseInstallCount', function(request, response) {
  var id = request.params.id;
  var WebApp = Parse.Object.extend('WebApp');
  var query = new Parse.Query(WebApp);
  query.get(id, {
    useMasterKey: true,
    success: function(webApp) {
      var downloads = webApp.get('installCount') || 0;
      downloads++;
      webApp.set('installCount', downloads);
      webApp.save(null, { useMasterKey: true });
      response.success();
    },
    error: function(error) {
      response.error(error);
    }
  });
});
