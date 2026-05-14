# School Bus Tracking System

A comprehensive transit management system with real-time tracking, student management, and parent notifications.

## Project Structure

- **/Backend**: Node.js/Express server with PostgreSQL (Sequelize) and Firebase Admin SDK.
- **/Frontend**: React (Vite) PWA with Leaflet maps and Framer Motion UI.

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Firebase Project

### Installation

1. Clone the repository
2. Setup Backend:
   ```bash
   cd Backend
   npm install
   cp .env.example .env # Then fill in your credentials
   npm run dev
   ```
3. Setup Frontend:
   ```bash
   cd Frontend
   npm install
   cp .env.example .env # Then fill in your API URL
   npm run dev
   ```

## Key Features
- **Live Tracking**: Real-time bus location updates using Leaflet.
- **Admin Dashboard**: Manage schools, buses, students, and drivers.
- **Parent PWA**: Notifications and live trip tracking for parents.
- **Secure Access**: JWT-based authentication for admins and parents.

## Technologies
- **Frontend**: React, Vite, Tailwind CSS, Lucide React, Framer Motion, Leaflet.
- **Backend**: Node.js, Express, Sequelize (PostgreSQL), Firebase Admin, Nodemailer.
