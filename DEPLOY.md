# Deployment Guide

This project is configured as a full-stack application with a React frontend and Express backend.

## 1. Backend (Railway/Render)
1. **Source**: Connect your GitHub repository.
2. **Root Directory**: `.` (Root)
3. **Start Command**: `npm start`
4. **Environment Variables**:
   - `JWT_SECRET`: (A secure random string)
   - `FRONTEND_URL`: Your production frontend URL.
   - `PORT`: 3000

## 2. Frontend (Netlify/Vercel)
1. **Build Command**: `npm run build`
2. **Publish Directory**: `dist`
3. **Environment Variables**:
   - `VITE_API_URL`: Your server's URL (e.g., `https://your-api.com/api`)

## Local Development
- `npm install`
- `npm run dev` (Starts backend; frontend can be proxyed or run separately via `npx vite`)
