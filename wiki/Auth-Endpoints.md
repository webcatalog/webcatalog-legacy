This section describes all available endpoints related to `/auth`.

### POST /auth
Retrieve JSON Web Token using email & password

#### Request body example (JSON)
```json
{
	"email": "quang@call-em-all.com",
	"password": "password"
}
```

#### Required
- `email`: string.
- `password`: string.

#### Example successful (200) response:
```json
{
	"jwt": "token"
}
```

#### Additional error codes
| Header                | Description                                               |
|-----------------------|-----------------------------------------------------------|
| WrongPassword        | Incorrect password.                                       |
| NoPassword           | User doesn't have password (Google OAuth.                 |
| UserNotFound        | User doesn't exist.                                       |