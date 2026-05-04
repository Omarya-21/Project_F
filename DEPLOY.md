# Deployment Guide

This project is configured to be hosted as a split architecture:

## 1. Backend (Railway)
1. **GitHub**: Push this repository to GitHub.
2. **Railway**: create a new service from your GitHub repo.
3. **Environment Variables**:
   - `JWT_SECRET`: (Random string)
   - `FRONTEND_URL`: Your Netlify URL (e.g., `https://nexus-hardware.netlify.app`)
   - `PORT`: (Managed by Railway, usually 3000)

## 2. Frontend (Netlify)
1. **GitHub**: Same repo.
2. **Netlify**: "Import from Git".
3. **Build Settings**:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
4. **Environment Variables**:
   - `VITE_API_URL`: Your Railway Service URL (e.g., `https://nexus-backend.up.railway.app/api`)

## Local Development
- Run `npm install`
- Run `npm run dev`
- Access at `http://localhost:3000`
