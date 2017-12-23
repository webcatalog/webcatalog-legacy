This section describes all available endpoints related to `/user`.

### GET /user
Get authenticated user information

#### Example successful (200) response:
```json
{
    "user": {
        "id": "7b0c23f9-2267-4d0f-bd19-264c0dd0948b",
        "email": "quang.lam2807@gmail.com",
        "displayName": "Quang Lam",
        "profilePicture": "https://lh5.googleusercontent.com/-dt_-sjZV8Q8/AAAAAAAAAAI/AAAAAAAAvEs/IYdTE4mcSM0/photo.jpg?sz=50",
        "intercomUserHash": "c1c7a7fc7c3734cb85812703c2c106de90f8fa2598644da45549204eea214b91",
        "hasPassword": true
    }
}
```

---

### POST /user
Create new account. No `JWT` is needed.

#### Request body example (JSON)
```json
{
	"email": "hello@gmail.com",
	"password": "something",
}
```

#### Required
- `email`: string.
- `password`: string. Minimum 6 characters.

#### Example successful (200) response:
```json
{
    "user": {
        "id": "7b0c23f9-2267-4d0f-bd19-264c0dd0948b",
        "email": "hello@gmail.com",
        "displayName": "Quang Lam",
        "profilePicture": "https://lh5.googleusercontent.com/-dt_-sjZV8Q8/AAAAAAAAAAI/AAAAAAAAvEs/IYdTE4mcSM0/photo.jpg?sz=50",
        "intercomUserHash": "c1c7a7fc7c3734cb85812703c2c106de90f8fa2598644da45549204eea214b91",
        "hasPassword": true
    }
}
```

#### Additional error codes
| Code                | Description                                               |
|-----------------------|-----------------------------------------------------------|
| EmailTaken           | The email is already taken.                               |

---

### PATCH /user
Update authenticated user information

#### Request body example (JSON)
```json
{
	"email": "hello@gmail.com",
}
```

#### Optional
- `email`: string.
- `displayName`: string.

#### Example successful (200) response:
```json
{
    "user": {
        "id": "7b0c23f9-2267-4d0f-bd19-264c0dd0948b",
        "email": "hello@gmail.com",
        "displayName": "Quang Lam",
        "profilePicture": "https://lh5.googleusercontent.com/-dt_-sjZV8Q8/AAAAAAAAAAI/AAAAAAAAvEs/IYdTE4mcSM0/photo.jpg?sz=50",
        "intercomUserHash": "c1c7a7fc7c3734cb85812703c2c106de90f8fa2598644da45549204eea214b91",
        "hasPassword": true
    }
}
```

---

### PATCH /user/password
Update password

#### Request body example (JSON)
```json
{
	"currentPassword": "yay",
	"password": "something",
}
```

#### Required
- `currentPassword`: string. If `user.hasPassword === false`, it should be left `undefined`.
- `password`: string. Minimum 6 characters.

#### Example successful (200) response:
```json
{
    "success": true
}
```

#### Additional error codes
| Code                | Description                                               |
|-----------------------|-----------------------------------------------------------|
| WrongPassword        | Incorrect password.                                       |