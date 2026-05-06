# Nanotech Portfolio Website - Development Guide

## Project Overview
MERN stack application for a nanotech portfolio website with admin panel and public profile page.

## Technology Stack
- **Frontend:** React + React Router + Axios
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Authentication:** JWT tokens

## Project Structure
```
project_1/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## Setup Instructions
1. Install backend dependencies: `cd backend && npm install`
2. Install frontend dependencies: `cd frontend && npm install`
3. Create `.env` file in backend with MongoDB URI and JWT secret
4. Start backend: `npm start` (from backend folder)
5. Start frontend: `npm start` (from frontend folder)

## API Routes
- `GET /api/profile` - Get portfolio profile
- `POST /api/login` - Admin login
- `PUT /api/profile` - Update profile (admin)
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project (admin)
- `PUT /api/projects/:id` - Update project (admin)
- `DELETE /api/projects/:id` - Delete project (admin)

## Admin Credentials
Default credentials are set in the initial data setup.
