# API Documentation

## Authentication

### Register

POST /api/auth/register

Request:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Login

POST /api/auth/login

Request:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

---

## Projects

### Get Projects

GET /api/projects

### Create Project

POST /api/projects

Request:

```json
{
  "name": "My Project",
  "description": "Project Description"
}
```

### Update Project

PUT /api/projects/:id

### Delete Project

DELETE /api/projects/:id

---

## Tasks

### Get Tasks

GET /api/tasks

### Create Task

POST /api/tasks

Request:

```json
{
  "title": "Task 1",
  "status": "todo",
  "priority": "high"
}
```

### Update Task

PUT /api/tasks/:id

### Delete Task

DELETE /api/tasks/:id

---

## Dashboard

### Statistics

GET /api/dashboard/stats

Response:

```json
{
  "totalProjects": 5,
  "totalTasks": 20,
  "completedTasks": 10,
  "pendingTasks": 10,
  "projectsInProgress": 3
}
```
