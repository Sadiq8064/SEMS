# SEMS — Smart Examination Management System

A university exam-management platform. Universities register, admins create exams, students register for them.

## Stack

- **Backend** (`backend/`) — Node.js, Express, MongoDB (Mongoose), JWT auth, bcryptjs, deployed on Vercel
- **Admin Frontend** (`admin-frontend/`) — React 19 + Vite, axios

## Data model

- `User` — accounts (admins, students)
- `University` — tenant
- `Exam` — exam definitions
- `Registration` — student ↔ exam

## API surface

- `POST /api/auth/*` — login/register
- `GET /api/exam`, `POST /api/exam/create`, `POST /api/exam/register`, `DELETE /api/exam/withdraw`

## Local setup

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in your Mongo URI + JWT secret
npm run dev
```

### Admin frontend

```bash
cd admin-frontend
npm install
npm run dev
```

## Deployment

- Backend: Vercel (`vercel.json` included)
- Frontend: any static host (Vercel / Netlify / Cloudflare Pages)
