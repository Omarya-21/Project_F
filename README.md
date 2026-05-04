# Nexus Hardware - E-Commerce Platform

A high-performance e-commerce platform for computer hardware, built with a modern full-stack architecture.

## Tech Stack

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS & Framer Motion (for animations)
- **State Management**: React Context API
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (SQL-based storage)
- **Authentication**: JWT (JSON Web Tokens) with Bcrypt password hashing
- **File Uploads**: Multer

## Features
- **Global Inventory**: Real-time stock tracking and management.
- **Admin Dashboard**: Comprehensive analytics, order registry, and hardware catalog control.
- **User Experience**: Smooth transitions, responsive design, and secure checkout flow.
- **Security**: Protected admin routes and encrypted user credentials.

## Environment Variables
Refer to `.env.example` for the required configuration. Key variables include:
- `JWT_SECRET`: Security salt for authentication.
- `VITE_API_URL`: Backend endpoint for the frontend client.

## Project Structure
- `/client`: Frontend source code and assets.
- `/backend`: Server logic, API routes, and database configuration.
