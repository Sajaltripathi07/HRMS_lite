# HRMS Lite

A lightweight Human Resource Management System for managing employee records and tracking daily attendance.

## Features

- Add, view, and delete employees
- Mark daily attendance (Present / Absent) per employee
- Update attendance if already marked for a date
- View per-employee attendance history with totals
- Filter attendance records by employee and/or date
- Dashboard with summary statistics
- Search employees by name, ID, department, or email
- Full validation and error handling

## Tech Stack

| Layer     | Technology                      |
|-----------|---------------------------------|
| Frontend  | React 18, React Router v6, Vite |
| Backend   | Node.js, Express                |
| Database  | MongoDB (Mongoose ODM)          |
| Deploy FE | Vercel                          |
| Deploy BE | Render                          |


## Local Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas connection string)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and set your MONGODB_URI
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# .env already points to http://localhost:5000/api for local dev
npm run dev
```

Frontend will run on `http://localhost:5173`

## API Endpoints

### Employees

| Method | Endpoint              | Description           |
|--------|-----------------------|-----------------------|
| GET    | /api/employees        | List all employees    |
| POST   | /api/employees        | Create employee       |
| DELETE | /api/employees/:id    | Delete employee       |
| GET    | /api/employees/stats  | Dashboard stats       |

### Attendance

| Method | Endpoint                     | Description                     |
|--------|------------------------------|---------------------------------|
| GET    | /api/attendance              | List all (supports ?employeeId= ?date=) |
| POST   | /api/attendance              | Mark/update attendance          |
| GET    | /api/attendance/employee/:id | Records + totals for one employee |


## Assumptions & Limitations

- Single admin user — no authentication layer
- Leave management, payroll, and advanced HR features are out of scope
- Attendance records are uniquely constrained per employee per date (marking twice updates the record)
- Employee ID must be unique and is manually entered (not auto-generated)
