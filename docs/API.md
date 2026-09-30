# Todo API Documentation

## Overview

The Todo API is an Express REST API for registering users, signing in, and managing each user's todos. The current implementation stores data in process memory, so users and todos are reset when the server restarts.

## Base URL

```text
http://localhost:5000
```

The server uses `PORT` from the environment and defaults to `5000`.

## Requirements

- Node.js 18 or newer
- npm
- A configured `.env` file

Example local configuration:

```env
PORT=5000
SALT_ROUNDS=12
JWT_SECRET=replace-this-with-a-long-random-secret
```

Start the server:

```bash
npm install
node src/server.js
```

## Authentication

1. Register a user with `POST /api/auth/register`.
2. Log in with `POST /api/auth/login`.
3. Send the returned JWT to every todo endpoint:

```http
Authorization: Bearer <token>
```

The token expires after one hour. The authorization middleware expects the token as the second space-delimited value in the `Authorization` header.

## Endpoint Summary

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Register a user |
| `POST` | `/api/auth/login` | Public | Log in and receive a JWT |
| `GET` | `/api/auth/view` | Public, legacy | View all stored users |
| `POST` | `/api/todos` | Authenticated | Create a todo |
| `GET` | `/api/todos` | Authenticated | List the current user's todos |
| `GET` | `/api/todos/:id` | Authenticated | Get one owned todo |
| `PUT` | `/api/todos/:id` | Authenticated | Update one owned todo |
| `DELETE` | `/api/todos/:id` | Authenticated | Delete one owned todo |

## Data Models

### Todo

```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Buy milk and bread",
  "completed": false,
  "userId": 1,
  "createdAt": "2026-01-15T10:30:00.000Z"
}
```

- `id` and `userId` are integers.
- `title` is required when creating a todo.
- `description` is optional.
- `completed` starts as `false` and is normally a boolean.
- `createdAt` is an ISO date-time string.
- A user can only access todos whose `userId` matches the authenticated user's ID.

## Authentication Endpoints

### Register a user

**Request:** `POST /api/auth/register`

Headers:

```http
Content-Type: application/json
```

Body:

```json
{
  "fullName": "Ada Lovelace",
  "email": "ada@example.com",
  "phone": "+15550100001",
  "password": "correct-horse-battery-staple"
}
```

Example:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Ada Lovelace",
    "email": "ada@example.com",
    "phone": "+15550100001",
    "password": "correct-horse-battery-staple"
  }'
```

Responses:

- `201 Created`

  ```json
  {
    "status": "successful",
    "message": "You have registered successfully"
  }
  ```

- `400 Bad Request` when a field is missing:

  ```json
  {
    "status": "error",
    "message": "All fields are required"
  }
  ```

- `409 Conflict` when the email is already registered:

  ```json
  {
    "status": "error",
    "message": "This email already exists"
  }
  ```

### Log in

**Request:** `POST /api/auth/login`

Body:

```json
{
  "email": "ada@example.com",
  "password": "correct-horse-battery-staple"
}
```

Example:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ada@example.com",
    "password": "correct-horse-battery-staple"
  }'
```

Response on success (`200 OK`):

```json
{
  "status": "successful",
  "message": "You have been successfully logged in",
  "token": "<JWT>"
}
```

Error responses:

- `400 Bad Request` when email or password is missing:
  `{ "status": "error", "message": "Email and password are required" }`
- `401 Unauthorized` when the credentials are incorrect:
  `{ "status": "error", "message": "Invalid email or password" }`

### View all users (legacy/debug)

**Request:** `GET /api/auth/view`

This endpoint currently returns all in-memory users without authentication. The response includes each user's bcrypt password hash, so it must remain local and must not be exposed in production.

Response (`200 OK`):

```json
{
  "viewAll": [
    {
      "id": 1,
      "fullName": "Ada Lovelace",
      "email": "ada@example.com",
      "phone": "+15550100001",
      "password": "<bcrypt-hash>"
    }
  ]
}
```

## Todo Endpoints

All todo endpoints require:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

### Create a todo

**Request:** `POST /api/todos`

Body:

```json
{
  "title": "Buy groceries",
  "description": "Buy milk and bread"
}
```

Example:

```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries",
    "description": "Buy milk and bread"
  }'
```

Response (`201 Created`):

```json
{
  "status": "successful",
  "message": "Todo created successfully",
  "todo": {
    "id": 1,
    "title": "Buy groceries",
    "description": "Buy milk and bread",
    "completed": false,
    "userId": 1,
    "createdAt": "2026-01-15T10:30:00.000Z"
  }
}
```

Errors:

- `400 Bad Request` when `title` is missing:
  `{ "status": "error", "message": "Title is required" }`
- `401 Unauthorized` when the JWT is missing or invalid.

### List todos

**Request:** `GET /api/todos`

```bash
curl http://localhost:5000/api/todos \
  -H "Authorization: Bearer <token>"
```

Response (`200 OK`):

```json
{
  "status": "successful",
  "todos": [
    {
      "id": 1,
      "title": "Buy groceries",
      "description": "Buy milk and bread",
      "completed": false,
      "userId": 1,
      "createdAt": "2026-01-15T10:30:00.000Z"
    }
  ]
}
```

Only todos owned by the authenticated user are returned. There is currently no pagination, search, or completion filter.

### Get a todo

**Request:** `GET /api/todos/:id`

```bash
curl http://localhost:5000/api/todos/1 \
  -H "Authorization: Bearer <token>"
```

Response (`200 OK`):

```json
{
  "status": "successful",
  "todo": {
    "id": 1,
    "title": "Buy groceries",
    "description": "Buy milk and bread",
    "completed": false,
    "userId": 1,
    "createdAt": "2026-01-15T10:30:00.000Z"
  }
}
```

If the todo does not exist or belongs to another user, the API returns `404 Not Found`:

```json
{
  "status": "error",
  "message": "Todo not found"
}
```

### Update a todo

**Request:** `PUT /api/todos/:id`

Only properties included in the body are updated. The current handler allows `title`, `description`, and `completed`.

```bash
curl -X PUT http://localhost:5000/api/todos/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries and household supplies",
    "description": "Milk, bread, and eggs",
    "completed": true
  }'
```

Response (`200 OK`):

```json
{
  "status": "successful",
  "message": "Todo updated successfully",
  "todo": {
    "id": 1,
    "title": "Buy groceries and household supplies",
    "description": "Milk, bread, and eggs",
    "completed": true,
    "userId": 1,
    "createdAt": "2026-01-15T10:30:00.000Z"
  }
}
```

A missing or unowned todo returns `404 Not Found` with the same `Todo not found` error shape.

### Delete a todo

**Request:** `DELETE /api/todos/:id`

```bash
curl -X DELETE http://localhost:5000/api/todos/1 \
  -H "Authorization: Bearer <token>"
```

Response (`200 OK`):

```json
{
  "status": "successful",
  "message": "Todo deleted successfully"
}
```

A missing or unowned todo returns `404 Not Found` with the same `Todo not found` error shape.

## Error Format

Handled errors use JSON:

```json
{
  "status": "error",
  "message": "Human-readable error message"
}
```

Possible authentication messages for todo endpoints are:

- `Authentication token is required`
- `Invalid authorization format`
- `Invalid or expired token`

## Ownership and Data Behavior

- Todo reads and writes are filtered by the authenticated user's `userId`.
- Requesting another user's todo returns `404`, not a different ownership error.
- Users and todos are kept in JavaScript arrays and are not persisted to a database.
- IDs are assigned from the current array length and are not globally durable across restarts.
- The current input handlers check required fields by presence/truthiness; they do not enforce comprehensive type, format, or length validation.
- The public `/api/auth/view` route is retained for compatibility and should be removed or protected before production use.

## Swagger/OpenAPI

The OpenAPI 3.0 specification is at [`openapi.yaml`](./openapi.yaml). Import it into Swagger Editor, Swagger UI, or any OpenAPI-compatible tool. The spec is compatible with Swagger tools and includes schemas, examples, authentication, parameters, and response definitions.

## Postman

Import [`todo-api.postman_collection.json`](../postman/todo-api.postman_collection.json) into Postman.

Recommended order:

1. Set the collection variables `baseUrl`, `email`, and `password` if needed.
2. Run **Register user**.
3. Run **Login user**; its test script stores the JWT in `{{token}}`.
4. Run **Create todo**; its test script stores the new ID in `{{todoId}}`.
5. Run the list, get, update, and delete requests in any convenient order.

The collection defaults to `http://localhost:5000`. The Todo folder applies the bearer token automatically after login.
