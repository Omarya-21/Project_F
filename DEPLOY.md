# Deployment Guide (Split Architecture)

This project has been restructured into two main directories: `client` and `backend`.

## 1. Backend (Railway)
1. **Source**: Push the contents of the `backend/` folder (or the whole repo if you prefer mono-repo) to GitHub.
2. **Railway**: create a new service. If using a mono-repo, set the "Root Directory" to `backend`.
3. **Command**: Run `npm install && npm start`.
4. **Environment Variables**:
   - `JWT_SECRET`: (A secure random string)
   - `FRONTEND_URL`: Your Netlify URL (e.g., `https://nexus-hardware.netlify.app`)
   - `PORT`: 3000 (Railway will override this)

## 2. Frontend (Netlify)
1. **Source**: Push the `client/` folder to GitHub.
2. **Netlify**: "Import from Git". Set the "Base directory" to `client`.
3. **Build Settings**:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
4. **Environment Variables**:
   - `VITE_API_URL`: Your Railway Service URL (e.g., `https://nexus-backend.up.railway.app/api`)

## Local Development
- Root folder: `npm install`
- Root folder: `npm run dev` (This will start the backend which also handles frontend proxying in dev)
- Or run them separately:
  - `cd backend && npm install && npm start`
  - `cd client && npm install && npm run dev`
