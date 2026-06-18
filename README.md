# Project Management System

## Project Overview

A full-stack Project Management System that allows users to manage projects and tasks efficiently.

## Features

* User Registration and Login
* JWT Authentication
* Password Hashing using bcrypt
* Create, Update, Delete Projects
* Create, Update, Delete Tasks
* Dashboard Statistics
* Search and Filter Tasks
* Secure Protected Routes

## Tech Stack

* Frontend: React, Vite, Tailwind CSS
* Backend: Node.js, Express.js
* Database: MySQL
* Authentication: JWT, bcrypt

## Installation

```bash
npm install
npm start
```

## Environment Variables

```env
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
PORT=5000
```

## API Endpoints

### Authentication

* POST /api/auth/register
* POST /api/auth/login

### Projects

* GET /api/projects
* POST /api/projects
* PUT /api/projects/:id
* DELETE /api/projects/:id

### Tasks

* GET /api/tasks
* POST /api/tasks
* PUT /api/tasks/:id
* DELETE /api/tasks/:id

### Dashboard

* GET /api/dashboard/stats

## Deployment

* Frontend: Vercel
* Backend: Render
* Database: Railway
