# Nexus PC - Local Setup Instructions

Follow these steps to run the Nexus PC application on your computer. This app uses a Node.js backend with SQLite and a React frontend.

## Prerequisites
- [Node.js](https://nodejs.org/) (Version 18 or higher recommended)
- npm (comes with Node.js)

## 1. Project Configuration

1. Open the project folder in your code editor.
2. **Environment Variables**:
   - Both the root directory and the `backend` directory have `.env.example` files.
   - You should create a `.env` file in the `backend` folder based on `.env.example`.
   - **Important**: Add your `GEMINI_API_KEY` to the `backend/.env` file to enable AI features.

   ```env
   PORT=3000
   JWT_SECRET=your_random_secret_string
   GEMINI_API_KEY=your_google_ai_key
   ```

## 2. Installation & Running

You can install all dependencies and run both the frontend and backend using the root commands.

### One-Command Setup (Recommended)
1. Open a terminal in the **root** folder of the project.
2. Run: `npm install`
   - *This will automatically install dependencies for both the frontend and backend.*
3. Run: `npm run dev`
   - *This starts both the backend (port 3000) and the frontend concurrently.*

### Manual Step-by-Step (Optional)
If you prefer to run them separately:

#### A. Backend (The Server)
1. Open a terminal in the `backend` folder.
2. Run: `npm install`
3. Run: `npm start`
   - *The server will automatically create the SQLite database file (`nexus.db`) and tables on the first run.*

#### B. Frontend (The User Interface)
1. Open a **new** terminal in the `frontend` folder.
2. Run: `npm install`
3. Run: `npm run dev`
4. Access the app at the URL provided in the terminal (usually `http://localhost:5173`).

## 3. Database
This application uses **SQLite**, so no external database server (like MySQL or XAMPP) is required. The database file will be created at `backend/database/nexus.db`.

## 4. Admin Access
The **first user** who registers on the site will automatically be granted **Admin** rights. 
1. Navigate to the "Login/Register" page.
2. Create a new account.
3. Once logged in, you will see an "Admin" link in the navigation menu to manage products and inventory.

---
*Nexus PC - Smart PC Building Solutions*
