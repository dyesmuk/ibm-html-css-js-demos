# Node.js FSD — Modules 09–16

This repository contains two fully implemented Node.js applications
built progressively across Modules 09–16 of the Java Full Stack Developer curriculum.

---

## Projects

| Project | Modules | Description |
|---------|---------|-------------|
| `task-app` | 09–15 | Full-featured REST API with MongoDB, JWT auth, file uploads, emails, testing |
| `chat-app` | 16 | Real-time multi-room chat application using Socket.io |

---

## task-app

### Setup

```bash
cd task-app
npm install
cp .env.example .env        # fill in your values
npm run dev                 # development (nodemon)
npm start                   # production
npm test                    # Jest + Supertest
```

### Environment Variables (.env)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default 3000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `SENDGRID_API_KEY` | SendGrid API key for emails |
| `APP_URL` | Base URL of the app (e.g. http://localhost:3000) |

### API Endpoints

#### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login |
| POST | /api/auth/logout | Yes | Logout current device |
| POST | /api/auth/logout-all | Yes | Logout all devices |

#### Tasks
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/tasks | Yes | Create task |
| GET | /api/tasks | Yes | Get tasks (filter/sort/paginate) |
| GET | /api/tasks/:id | Yes | Get single task |
| PATCH | /api/tasks/:id | Yes | Update task |
| DELETE | /api/tasks/:id | Yes | Delete task |

#### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/users/me | Yes | Get profile |
| PATCH | /api/users/me | Yes | Update profile |
| DELETE | /api/users/me | Yes | Delete account |
| POST | /api/users/me/avatar | Yes | Upload avatar |
| GET | /api/users/:id/avatar | No | Get avatar |
| DELETE | /api/users/me/avatar | Yes | Delete avatar |

#### Task Query Params (GET /api/tasks)

```
?completed=true
?priority=high
?search=groceries
?sortBy=createdAt:desc
?limit=10&page=2
```

---

## chat-app

### Setup

```bash
cd chat-app
npm install
npm start       # runs on port 3001
```

Open `http://localhost:3001` in your browser, enter a username and room name to join.

### Features
- Multiple named rooms
- Real-time messaging
- Live location sharing (GPS)
- Room member list updates on join/leave

---

## Module Map

| Module | Topic | Location |
|--------|-------|----------|
| 09 | MongoDB & Promises | `task-app/src/db/`, `task-app/src/models/` |
| 10 | REST APIs & Mongoose | `task-app/src/routes/tasks.js` |
| 11 | Auth & Security | `task-app/src/middleware/auth.js`, `task-app/src/routes/auth.js` |
| 12 | Sorting, Pagination, Filtering | `task-app/src/routes/tasks.js` (GET handler) |
| 13 | File Uploads | `task-app/src/middleware/upload.js`, `task-app/src/routes/users.js` |
| 14 | Sending Emails | `task-app/src/services/email.js` |
| 15 | Testing | `task-app/tests/` |
| 16 | Socket.io Chat | `chat-app/` |
