$(document).ready(function ($) {
  var client = algoliasearch("PFL0LPV96S", "2b9f5f768d387b7239ce0b21106373e9");
  index = client.initIndex('apps');

  var search = function(query) {
    if (query.length < 1) {
      $('#search-page').hide();
      return;
    }
    $('#search-page').show();
    $('#sq').text(query);
    $('#search-input').val(query);
    $('.is-loading').show();
    index.search(query, function searchDone(err, content) {
      if (err) {
        $('#results').removeClass('columns is-multiline');
        $('#results').addClass('content');
        $('#results').html('<p>There is something wrong. Please try again later.</p>');
      }

      $('.is-loading').hide();
      $('#results').empty();
      if (content.hits.length > 0) {
        $.each(content.hits, function( index, app ) {
          var categoriesHtml = '';
          $.each(app.categories, function(i, category) {
            categoriesHtml += '<a class="tag is-success" href="/categories/'+ category +'">'+ category +'</a> ';
          });

          var platformsHtml = '';
          $.each(app.platforms, function(i, platform) {
            platformsHtml += '<a class="tag is-primary" href="/platforms/'+ platform +'">'+ platform +'</a> ';
          });

          $('#results').append('<div class="column is-half">\
            <div class="card app-card">\
              <div class="card-content">\
                <div class="media">\
                  <div class="media-left">\
                    <figure class="image is-32x32">\
                      <img src="/app/'+ app.objectID +'/osx.64.png" alt="{{ .Title }}">\
                    </figure>\
                  </div>\
                  <div class="media-content">\
                    <p class="title is-5"><a href="/app/'+ app.objectID +'">'+ app.title +'</a></p>\
                    <p>' +
                      categoriesHtml + platformsHtml
                    + '</p>\
                  </div>\
                </div>\
                <div class="content">\
                  '+ app.description.substring(0, 120) +'...\
                </div>\
              </div>\
            </div>\
          </div>');
        });
      }
      else {
        $('#results').removeClass('columns is-multiline');
        $('#results').addClass('content');
        $('#results').html('<p>No result.</p>');
      }
    });
  }

  search(window.location.hash.substr(1));

  window.onhashchange = function () {
    search(window.location.hash.substr(1));
  };
});
