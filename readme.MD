Build a Todo REST API

Build a Todo REST API using Node.js and Express.js.

Requirements

Authentication

Create:

POST /api/auth/register
POST /api/auth/login

Users should be able to register and log in.

Use JWT authentication and bcrypt for password hashing.

⸻

Todo CRUD

Create the following endpoints:

POST /api/todos
GET /api/todos
GET /api/todos/:id
PUT /api/todos/:id
DELETE /api/todos/:id

Users should be able to:

* Create a Todo.
* View their Todos.
* View a single Todo.
* Update a Todo.
* Delete a Todo.

⸻

Authentication & Authorization

All Todo routes must be protected.

A user must be authenticated before performing any Todo operation.

Users must only be able to access and modify their own Todos.

A user must not be able to view, update, or delete another user’s Todo.

⸻

Todo Fields

Each Todo should contain at least:

id
title
description
completed
userId
createdAt

⸻

Security

* Hash passwords with bcrypt.
* Use JWT for authentication.
* Store sensitive configuration in .env.
* Validate incoming data.
* Use appropriate HTTP status codes.
* Do not expose passwords or sensitive information.
* Implement proper error responses.

Bonus

Add:

* Rate limiting.
* Request logging.
* Global error-handling middleware
* Todo search.
* Filter Todos by completion status.

Deliverables

* Complete source code.
* Working authentication system.
* JWT authentication middleware.
* Todo CRUD API.
* User ownership/authorization.
* Input validation.
* .env configuration.
* Postman or Thunder Client testing.
* README with setup and usage instructions.