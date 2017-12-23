This section describes all available endpoints related to `/search`.

### POST /search/apps?q=:q&hitsPerPage=:hitsPerPage&page=:page
Retrieve JSON Web Token using email & password

#### Required
- `q`: string. An echo of the query text. See the [query](https://www.algolia.com/doc/api-reference/api-parameters/query/) search parameter.

#### Optional
- `hitsPerPage`: number. Maximum number of hits returned per page. See the [hitsPerPage](https://www.algolia.com/doc/api-reference/api-parameters/hitsPerPage/) search parameter. Default: 48.
- `page`: number. Index of the current page (zero-based). Default: 0.

#### Example successful (200) response:
```json
{
    "hits": [
        {
            "id": "69b548b4-1128-4783-b727-453a9358c210",
            "installCount": 672,
            "slug": "whatsapp",
            "name": "WhatsApp",
            "url": "https://web.whatsapp.com",
            "category": "social",
            "isActive": true,
            "version": "1493535051004",
            "description": "WhatsApp Messenger is a freeware, cross-platform and end-to-end encrypted instant messaging application for smartphones. It uses the Internet to make voice calls, one to one video calls; send text messages, images, GIF, videos, documents, user location, audio files, phone contacts and voice notes to other users using standard cellular mobile numbers. It also incorporates a feature called Status, which allows users to upload photos and videos to a 24-hours-lifetime feed that, by default, are visible to all contacts; similar to Snapchat, Facebook and Instagram Stories.\nWhatsApp Inc., based in Mountain View, California, was acquired by Facebook in February 2014 for approximately US$19.3 billion. By February 2016, WhatsApp had a user base of over one billion, making it the most popular messaging application at the time.",
            "wikipediaTitle": "",
            "updatedAt": "2017-04-30T06:50:53.322Z",
            "createdAt": "2017-04-30T06:50:51.006Z",
            "objectID": "69b548b4-1128-4783-b727-453a9358c210",
            "_highlightResult": {
                "name": {
                    "value": "WhatsApp",
                    "matchLevel": "none",
                    "matchedWords": []
                },
                "url": {
                    "value": "https://web.whatsapp.com",
                    "matchLevel": "none",
                    "matchedWords": []
                },
                "category": {
                    "value": "social",
                    "matchLevel": "none",
                    "matchedWords": []
                },
                "description": {
                    "value": "WhatsApp Messenger is a freeware, cross-platform and end-to-end encrypted instant messaging application for smartphones. It uses the Internet to make voice calls, one to one video calls; send text messages, images, GIF, videos, documents, user location, audio files, phone contacts and voice notes to other users using standard cellular mobile numbers. It also incorporates a feature called Status, which allows users to upload photos and videos to a 24-hours-lifetime feed that, by default, are visible to all contacts; similar to Snapchat, <em>Facebook</em> and Instagram Stories.\nWhatsApp Inc., based in Mountain View, California, was acquired by <em>Facebook</em> in February 2014 for approximately US$19.3 billion. By February 2016, WhatsApp had a user base of over one billion, making it the most popular messaging application at the time.",
                    "matchLevel": "full",
                    "fullyHighlighted": false,
                    "matchedWords": [
                        "facebook"
                    ]
                }
            }
        }
    ],
    "nbHits": 24,
    "page": 0,
    "nbPages": 24,
    "hitsPerPage": 1,
    "processingTimeMS": 1,
    "exhaustiveNbHits": true,
    "query": "facebook",
    "params": "query=facebook&hitsPerPage=1"
}
```