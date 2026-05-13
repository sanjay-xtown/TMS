# Bus Tracking System - SuperAdmin Module

This project is a complete SuperAdmin module for a Bus Tracking System, featuring a Node.js/Express/PostgreSQL backend and a React (Vite) frontend with a premium UI.

## 🚀 Installation & Setup

### 1. Prerequisites
- **Node.js** (v16+)
- **PostgreSQL** installed and running
- **npm** or **yarn**

---

### 2. Backend Setup
1. Open a terminal and navigate to the `Backend` folder:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Backend` directory and add your database credentials:
   ```env
   PORT=5000
   DB_NAME=bus_tracking
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   DB_HOST=localhost
   JWT_SECRET=super_secret_key_123
   ```
   *Note: Ensure the database `bus_tracking` exists in your PostgreSQL.*

4. Start the backend:
   ```bash
   npm run dev
   ```

---

### 3. Frontend Setup
1. Open a new terminal and navigate to the `Frontend` folder:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend:
   ```bash
   npm run dev
   ```
4. Open your browser at `http://localhost:5173`.

---

## 🛠 API Testing Guide (Postman)

### 1. Register SuperAdmin
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/superadmin/register`
- **Body (JSON):**
  ```json
  {
    "email": "admin@example.com",
    "password": "password123"
  }
  ```

### 2. Login SuperAdmin
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/superadmin/login`
- **Body (JSON):**
  ```json
  {
    "email": "admin@example.com",
    "password": "password123"
  }
  ```
- **Response:** You will receive a `token`. Copy this for protected routes.

### 3. Get Profile (Protected)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/superadmin/profile`
- **Headers:** 
  - `Authorization`: `Bearer YOUR_JWT_TOKEN_HERE`

---

## 🎨 UI Features
- **Modern Auth Pages:** Glassmorphism effects, smooth transitions, and input validation.
- **Responsive Dashboard:** Sidebar navigation, statistical overview cards, and professional color palette (Slate & Indigo).
- **Protected Routing:** Prevents unauthorized access to the dashboard.
