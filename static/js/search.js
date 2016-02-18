$(document).ready(function ($) {
  console.log('shit');
  $.QueryString = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=');
        if (p.length != 2) continue;
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
  })(window.location.search.substr(1).split('&'))

  var q = $.QueryString['q'];
  $('#sq').text(q);

  var $searchBox = $('#search-box');
  var client = algoliasearch("PFL0LPV96S", "2b9f5f768d387b7239ce0b21106373e9");
  index = client.initIndex('apps');
  $searchBox.val(q);

  var $results = $('#results');
  var $loading = $('.is-loading');

  function search(searchQuery) {
    index.search(searchQuery, function searchDone(err, content) {
      if (err) {
        $results.removeClass('columns is-multiline');
        $results.addClass('content');
        $results.html('<p>There is something wrong. Please try again later.</p>');
      }

      $loading.hide();
      if (content.hits.length > 0) {
        $.each(content.hits, function( index, app ) {
          var categoriesHtml = '';
          $.each(app.categories, function(i, category) {
            categoriesHtml += '<a class="tag is-success" href="/categories/'+ category +'">'+ category +'</a>';
          });

          var platformsHtml = '';
          $.each(app.platforms, function(i, platform) {
            platformsHtml += '<a class="tag is-primary" href="/platforms/'+ platform +'">'+ platform +'</a>';
          });

          $results.append('<div class="column is-half">\
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
        $results.removeClass('columns is-multiline');
        $results.addClass('content');
        $results.html('<p>No result.</p>');
      }

    });
  }

  if (q.length > 0) {
    search(q);
  }
});
