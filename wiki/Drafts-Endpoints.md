This section describes all available endpoints related to `/drafts`.

### POST /drafts
Submit a new app.

#### Request body example (JSON)
```json
{
	"name": "WebCatalog",
	"url": "https://getwebcatalog.com"
}
```

#### Required
- `name`: string.
- `url`: string.

#### Example successful (200) response:
```json
{
	"success": true
}
```