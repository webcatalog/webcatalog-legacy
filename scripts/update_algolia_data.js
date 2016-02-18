var fs = require('fs');
var yamlFront = require('yaml-front-matter');
var request = require('request');

var dirname = 'content/app/';

fs.readdir(dirname, function(err, filenames) {
  if (err) {
    return;
  }
  var data = {};
  data.requests = [];
  filenames.forEach(function(filename) {
    var text = fs.readFileSync(dirname + filename,'utf8');
    var json = yamlFront.loadFront(text, 'description');
    json.objectID = json.id;
    delete json.id;
    data.requests.push({
      action: 'updateObject',
      body: json
    });
  });

  request({
    url: 'https://' + process.env.ALGOLIA_APPLICATION_ID + '.algolia.net/1/indexes/apps/batch',
    method: 'POST',
    headers: {
      'X-Algolia-API-Key': process.env.ALGOLIA_API_KEY,
      'X-Algolia-Application-Id': process.env.ALGOLIA_APPLICATION_ID
    },
    json: true,
    body: data
  }, function (error, response, body){
    if (error) {
      console.log(error);
      return;
    }
    console.log(body);
  });
});
