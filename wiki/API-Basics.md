Our API is exposed as an HTTP/1 and HTTP/2 service over SSL.

All **production** endpoints live under the URL https://getwebcatalog.com/api and then generally follow the REST architecture.

All **staging** endpoints live under the URL https://webcatalog-server-staging.herokuapp.com/api and then generally follow the REST architecture.

### Content Type
Most requests must be encoded as JSON with the `Content-Type: application/json` header. 
Most responses, including errors, are encoded exclusively as JSON as well.

### Authentication
Provide your API token as part of the `Authorization` header.
```
Authorization: JWT token
```

If the authentication is unsuccessful, the status code **403** is returned.

### Errors
All errors have the following format:

```
{
  "error": {
    "code": "ErrorCode",
    "message": "An english description of the error that just occurred",
   }
}
```

The possible `error_code` values are documented on a per-endpoint basis.
Since the `message` is bound to change over time, we recommend you do not pass it along directly to end-users of your application.

#### Generic error codes
| Code           | Description                                               |
|-----------------------|-----------------------------------------------------------|
| AdminOnly             | Request is only accessible by admin.                      |
| NotFound              | Page not found.                                           |
| BadRequest           | Some required parameters were not present or were invalid.|
| InternalServerError	| An unexpected server error occurred.                      |
| Unauthorized	| Unauthorized.                      |