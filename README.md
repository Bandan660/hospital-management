# 🏥 Hospital Management System

Full-stack hospital management platform — React + Node.js + PostgreSQL.

---

## Prerequisites

- Node.js v18+
- PostgreSQL v15+
- Git

---

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/hospital-management.git
cd hospital-management
```

---

### 2. Backend Setup

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

### 3. Frontend Setup

```bash
cd ../frontend
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



---

## Demo Credentials

| Email | Password |
|-------|----------|
| admin@hospital.com | admin123 |

---

## API Reference

**Base URL:** `http://localhost:5000/api`

All routes except `/auth/login` require:
```
Authorization: Bearer <token>
```

---

### 🔐 Auth

#### POST `/auth/login`
Login and receive a JWT token.

**Request:**
```json
{
  "email": "admin@hospital.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGci...",
  "user": {
    "id": 1,
    "email": "admin@hospital.com",
    "role": "admin"
  }
}
```

---

### 🧑‍⚕️ Patients

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/patients` | Get all patients |
| GET | `/patients/:id` | Get patient by ID |
| POST | `/patients` | Create new patient |
| PUT | `/patients/:id` | Update patient |

#### POST `/patients` — Request Body
```json
{
  "name": "John Doe",
  "age": 35,
  "gender": "Male",
  "phone": "9876543210",
  "email": "john@example.com",
  "address": "Bhubaneswar, Odisha"
}
```



---

### 👨‍⚕️ Doctors

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/doctors` | Get all doctors |
| POST | `/doctors` | Add new doctor |
| PUT | `/doctors/:id` | Update doctor |


#### POST `/doctors` — Request Body
```json
{
  "name": "Dr. Priya Sharma",
  "specialization": "Cardiology",
  "phone": "9876543211",
  "email": "priya@hospital.com",
  "available": true
}
```

#### PUT `/doctors/:id` — Toggle Availability
```json
{
  "available": false
}
```

---

### 📅 Appointments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/appointments` | Get all appointments |
| GET | `/appointments?doctor_id=1&date=2025-04-10` | Filter by doctor / date |
| POST | `/appointments` | Book new appointment |
| PATCH | `/appointments/:id/status` | Update status |

#### POST `/appointments` — Request Body
```json
{
  "patientId": 1,
  "doctorId": 2,
  "appointmentDate": "2025-04-10",
  "timeSlot": "10:00 AM",
  "notes": "Routine checkup"
}
```

#### PATCH `/appointments/:id/status` — Request Body
```json
{
  "status": "COMPLETED"
}
```

> **Status values:** `SCHEDULED` | `COMPLETED` | `CANCELLED`

> ⚠️ Returns `409 Conflict` if same doctor + date + time slot is already booked.

---

### 📊 Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/stats` | Get stats + recent appointments |

#### GET `/dashboard/stats` — Response
```json
{
  "totalPatients": 120,
  "totalDoctors": 15,
  "totalAppointments": 340,
  "todayAppointments": 8,
  "recentAppointments": [
    {
      "id": 45,
      "patient": "John Doe",
      "doctor": "Dr. Priya Sharma",
      "appointmentDate": "2025-04-10",
      "timeSlot": "10:00 AM",
      "status": "SCHEDULED"
    }
  ]
}
```
> Built with ❤️ using React + Node.js + PostgreSQL
