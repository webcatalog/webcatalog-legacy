This section describes all available endpoints related to `/apps`.

### GET /apps?category=:category&page=:page&sort=:sort&order=:order
List all public apps.

#### Optional
- `category`: string. Accepted values:
  ```js
  'books',
  'business',
  'education',
  'entertainment',
  'finance',
  'food+drink',
  'games',
  'heath+fitness',
  'kids',
  'lifestyle',
  'medical',
  'music',
  'navigation',
  'news',
  'photo+video',
  'productivity',
  'reference',
  'shopping',
  'social',
  'sports',
  'travel',
  'utilities',
  'weather',
  ```
- `limit`: number. Default: `24`. Maximum: `100`.
- `page`: number. Default: `1`.
- `sort`: string. Default: `installCount`. Accepted values:
  ```js
  'createdAt',
  'installCount',
  'name',
  ```
- `order`: string. Default: `desc`. Accepted values:
  ```js
  'asc',
  'desc',
  ```


#### Example successful (200) response:
```json
{
    "apps": [
        {
            "id": "248985a8-ce9b-4844-bc8a-de837389042d",
            "slug": "youtube",
            "name": "YouTube",
            "url": "https://www.youtube.com",
            "version": "1493603256056"
        },
        {
            "id": "621434c9-8f4d-4c06-83fa-9b3b99e3820b",
            "slug": "facebook-messenger",
            "name": "Facebook Messenger",
            "url": "https://messenger.com",
            "version": "1493432360916"
        },
    ],
    "totalPage": 21
}
```

---

### GET /apps/:id
Get details about an app

#### Required
- `id`: string. Example: `248985a8-ce9b-4844-bc8a-de837389042d`

#### Example successful (200) response:
```json
{
    "app": {
        "id": "248985a8-ce9b-4844-bc8a-de837389042d",
        "slug": "youtube",
        "name": "YouTube",
        "url": "https://www.youtube.com",
        "category": "entertainment",
        "version": "1493603256056",
        "description": "YouTube is an American video-sharing website headquartered in San Bruno, California. The service was created by three former PayPal employees—Chad Hurley, Steve Chen, and Jawed Karim—in February 2005. Google bought the site in November 2006 for US$1.65 billion; YouTube now operates as one of Google's subsidiaries. The site allows users to upload, view, rate, share, add to favorites, report and comment on videos, subscribe to other users, and it makes use of WebM, H.264/MPEG-4 AVC, and Adobe Flash Video technology to display a wide variety of user-generated and corporate media videos. Available content includes video clips, TV show clips, music videos, short and documentary films, audio recordings, movie trailers and other content such as video blogging, short original videos, and educational videos.\nMost of the content on YouTube has been uploaded by individuals, but media corporations including CBS, the BBC, Vevo, and Hulu offer some of their material via YouTube as part of the YouTube partnership program. Unregistered users can only watch videos on the site, while registered users are permitted to upload an unlimited number of videos and add comments to videos. Videos deemed potentially offensive are available only to registered users affirming themselves to be at least 18 years old.\nYouTube earns advertising revenue from Google AdSense, a program which targets ads according to site content and audience. The vast majority of its videos are free to view, but there are exceptions, including subscription-based premium channels, film rentals, as well as YouTube Red, a subscription service offering ad-free access to the website and access to exclusive content made in partnership with existing users. As of February 2017, there are more than 400 hours of content uploaded to YouTube each minute, and one billion hours of content is watched on YouTube every day. As of April 2017, the website is ranked as the second most popular site in the world by Alexa Internet, a web traffic analysis company.",
        "wikipediaTitle": ""
    }
}
```