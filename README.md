# 🏠 Zepnest — Service Request Application

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Author](#-author)

---

## 🏡 About the Project

Zepnest is a home-services platform — *Home Care, At a Tap*. This mini-project mirrors that workflow at a small scale.

Users can **register**, **log in**, **raise service requests** (plumbing, cleaning, electrical, etc.), **track their status**, and **manage** them end-to-end — exactly how a real home-care platform operates.

> **Focus:** Clean, working end-to-end flow with proper authentication, RESTful API design, and a responsive UI.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **User Auth** | Secure registration & login using JWT + bcrypt password hashing |
| 📝 **Create Requests** | Submit requests with title, description, category, address, preferred time |
| 📋 **View Requests** | Dashboard with stats + full list with status filtering |
| 🔄 **Update Status** | Transition: `Pending → In Progress → Completed / Cancelled` |
| 🗑️ **Delete Requests** | Permanently remove requests you own |
| 📸 **Image Upload** | Optionally attach a reference photo (Multer, max 5MB) |
| 🛡️ **Route Protection** | All request APIs require a valid JWT token |
| 📱 **Responsive UI** | Works on desktop and mobile |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React.js (Vite) | UI framework |
| React Router v6 | Client-side routing |
| Axios | HTTP requests to backend |
| Custom CSS | Styling with CSS variables |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime |
| Express.js | Web framework / REST API |
| mysql2 | MySQL database driver |
| jsonwebtoken | JWT creation & verification |
| bcryptjs | Password hashing |
| Multer | File/image upload handling |
| cors | Cross-origin resource sharing |
| dotenv | Environment variable management |

### Database & Infrastructure
| Technology | Purpose |
|------------|---------|
| MySQL 8.x | Relational database |
| Railway | Hosted MySQL (production) |
| Render | Backend hosting |
| Vercel | Frontend hosting |

---

## 📁 Project Structure

```
zepnest-app/
│
├── backend/
│   ├── config/
│   │   └── db.js                  # MySQL connection pool
│   ├── controllers/
│   │   ├── authController.js      # Register & Login logic
│   │   └── requestController.js   # CRUD operations
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT token verification
│   ├── routes/
│   │   ├── authRoutes.js          # POST /api/auth/*
│   │   └── requestRoutes.js       # CRUD /api/requests/*
│   ├── uploads/                   # Stored images (local dev)
│   ├── .env.example               # Environment variable template
│   ├── .gitignore
│   ├── package.json
│   └── server.js                  # Express app entry point
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/
│       │   └── axios.js           # Axios instance + interceptors
│       ├── components/
│       │   └── Navbar.jsx         # Top navigation bar
│       ├── pages/
│       │   ├── Login.jsx          # Login page
│       │   ├── Register.jsx       # Registration page
│       │   ├── Dashboard.jsx      # Stats + recent requests
│       │   ├── RequestList.jsx    # All requests + filters
│       │   ├── CreateRequest.jsx  # New request form
│       │   └── EditRequest.jsx    # Update request status
│       ├── App.jsx                # Routes & protected route logic
│       ├── main.jsx               # React entry point
│       ├── index.css              # Global styles + CSS variables
│       ├── .env.example
│       └── package.json
│
├── schema.sql                     # Full database schema
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:
- [Node.js](https://nodejs.org/) v18 or higher
- [MySQL](https://dev.mysql.com/downloads/) 8.x
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/kiranmaipujala71/zepnest.git
cd zepnest-service-app
```

### 2. Set Up the Database

Open your MySQL terminal or MySQL Workbench and run:

```bash
mysql -u root -p < schema.sql
```

Or copy and paste the contents of `schema.sql` directly into MySQL Workbench.

### 3. Configure & Run the Backend

```bash
cd backend

# Copy environment variable template
cp .env.example .env

# Open .env and fill in your MySQL credentials
# (See Environment Variables section below)

# Install dependencies
npm install

# Start development server (auto-restarts on save)
npm run dev
```

✅ Backend runs at: `http://localhost:5000`  
✅ You should see: `🚀 Zepnest backend running` and `✅ MySQL Connected Successfully`

### 4. Configure & Run the Frontend

Open a **new terminal** tab:

```bash
cd frontend

# Copy environment variable template
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend runs at: `http://localhost:5173`

### 5. Open in Browser

Navigate to `http://localhost:5173` — you'll see the login page. Register a new account to get started!

---

## 🌍 Environment Variables

### Backend — `backend/.env`

```env
# Server
PORT=5000

# MySQL Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=zepnest_db

# JWT Secret — use a long random string, keep it private!
JWT_SECRET=your_super_secret_jwt_key_change_this

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### Frontend — `frontend/.env`

```env
# Backend API base URL
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ Never commit `.env` files to GitHub. They are listed in `.gitignore`.

---

## 🗄️ Database Schema

```sql
-- Users table
CREATE TABLE users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(150)  NOT NULL UNIQUE,
  password    VARCHAR(255)  NOT NULL,           -- bcrypt hashed
  created_at  DATETIME      DEFAULT NOW(),
  updated_at  DATETIME      DEFAULT NOW() ON UPDATE NOW()
);

-- Service requests table
CREATE TABLE service_requests (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  user_id        INT           NOT NULL,
  title          VARCHAR(200)  NOT NULL,
  description    TEXT          NOT NULL,
  category       VARCHAR(100)  NOT NULL,
  address        VARCHAR(300)  NOT NULL,
  preferred_time VARCHAR(150)  NOT NULL,
  status         ENUM('Pending','In Progress','Completed','Cancelled') DEFAULT 'Pending',
  image_url      VARCHAR(500)  DEFAULT NULL,
  created_at     DATETIME      DEFAULT NOW(),
  updated_at     DATETIME      DEFAULT NOW() ON UPDATE NOW(),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status  (status)
);
```

**Relationship:** One user → Many service requests (One-to-Many)

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Auth Required | Description |
|--------|----------|:-------------:|-------------|
| `POST` | `/api/auth/register` | ❌ | Register a new user |
| `POST` | `/api/auth/login` | ❌ | Login and receive JWT token |

**Register request body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login request body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

### Service Requests

All endpoints below require the `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/requests` | Create a new service request |
| `GET` | `/api/requests` | Get all requests for the logged-in user |
| `GET` | `/api/requests/:id` | Get a single request by ID |
| `PATCH` | `/api/requests/:id/status` | Update the status of a request |
| `DELETE` | `/api/requests/:id` | Delete a request |

**Create request body** (multipart/form-data):
```
title         = Fix leaking bathroom pipe
description   = The pipe under the sink has been dripping
category      = Plumbing
address       = 42 MG Road, Hyderabad
preferred_time = Saturday 10am–12pm
image         = (optional file)
```

**Update status body:**
```json
{ "status": "In Progress" }
```

Valid status values: `Pending` | `In Progress` | `Completed` | `Cancelled`

---

### Sample Responses

**Successful login:**
```json
{
  "success": true,
  "message": "Login successful!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "name": "John Doe", "email": "john@example.com" }
}
```

**Get all requests:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "title": "Fix leaking pipe",
      "category": "Plumbing",
      "status": "Pending",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

## 🚢 Deployment

### Database → Railway
1. Create a free account at [railway.app](https://railway.app)
2. New Project → Provision MySQL
3. Copy connection credentials from the Connect tab
4. Run the `schema.sql` queries in the Railway Query tab

### Backend → Render
1. Create a free account at [render.com](https://render.com)
2. New → Web Service → Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. **Build:** `npm install` | **Start:** `npm start`
5. Add all environment variables from `backend/.env` (using Railway DB values)

### Frontend → Vercel
1. Create a free account at [vercel.com](https://vercel.com)
2. New Project → Import your GitHub repo
3. Set **Root Directory** to `frontend`
4. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
5. Deploy!

---

## 📸 Screenshots

> Add screenshots of your running application here.

| Login Page | Dashboard | Request List |
|:----------:|:---------:|:------------:|
| *(screenshot)* | *(screenshot)* | *(screenshot)* |

| Create Request | Edit Status |
|:--------------:|:-----------:|
| *(screenshot)* | *(screenshot)* |

*To add screenshots: take screenshots of your app, upload them to a `/screenshots` folder in your repo, and replace the placeholder text with `![Login](screenshots/login.png)` etc.*

---

## 🏗️ Architecture Overview

```
Browser (React + Axios)
        │
        │  HTTP Requests + JWT Bearer Token
        ▼
Express.js Server
        ├── authMiddleware  →  verifies JWT on protected routes
        ├── /api/auth       →  authController  (register, login)
        └── /api/requests   →  requestController (CRUD)
                │
                │  SQL Queries (mysql2 connection pool)
                ▼
          MySQL Database
                ├── users
                └── service_requests (FK → users.id)
```

---

## 👤 Author

**Your Name**

- GitHub: [Pujala Kiranmai](https://github.com/kiranmaipujala71)
- Email: kiranmaipujala71@gmail.com

---

## 📄 License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

