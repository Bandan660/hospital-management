# 🏥 Hospital Management System

Full-stack hospital management platform — React + Node.js + PostgreSQL.

---

## Prerequisites

- Node.js v18+
- PostgreSQL v15+

---

## Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hospital_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=hospital_super_secret_jwt_key
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@hospital.com
ADMIN_PASSWORD=admin123
```

Create database:
```bash
psql -U postgres
CREATE DATABASE hospital_db;
\q
```

Start server:
```bash
npm run dev
```
> Runs on `http://localhost:5000`

---

## Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

Start app:
```bash
npm run dev
```
> Runs on `http://localhost:5173`

---

## Demo Credentials

| Email | Password |
|-------|----------|
| admin@hospital.com | admin123 |