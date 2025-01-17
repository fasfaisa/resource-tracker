# Resource Allocation and Tracking System

A web-based application for managing and tracking resource allocation within an organization.

## Features

- Resource management with status tracking
- Project allocation system
- Resource utilization visualization
- Responsive design
- Real-time status updates

## Tech Stack

- Frontend: React, Tailwind CSS, Recharts
- Backend: Node.js, Express.js
- Database: MySQL

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

## Installation

### Database Setup

1. Create a MySQL database:
```bash
mysql -u root -p
CREATE DATABASE resource_tracker;
```

2. Import the schema:
```bash
mysql -u root -p resource_tracker < schema.sql
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file with your configuration:
```
PORT=5000
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=resource_tracker
```

4. Start the server:
```bash
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```
<div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
  <img alt="Screenshot 1" width="200" src="Screenshot (373).png">
  <img alt="Screenshot 2" width="200" src="Screenshot (374).png">
  <img alt="Screenshot 3" width="200" src="Screenshot (375).png">
  <img alt="Screenshot 4" width="200" src="Screenshot (376).png">
  <img alt="Screenshot 5" width="200" src="Screenshot (377).png">
   <img alt="Screenshot 5" width="200" src="Screenshot (378).png">
</div>
