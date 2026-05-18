# Nexus PC - Local Setup Instructions

Follow these steps to run the Nexus PC application on your computer. This app uses a Node.js backend with MySQL (recommended) or SQLite fallback, and a React frontend.

## Prerequisites
- [Node.js](https://nodejs.org/) (Version 18 or higher recommended)
- [XAMPP](https://www.apachefriends.org/) (For MySQL)
- npm (comes with Node.js)

## 1. Database Setup (MySQL with XAMPP)

1. Start **XAMPP Control Panel**.
2. Start the **MySQL** module.
3. Open **phpMyAdmin** (usually `http://localhost/phpmyadmin`).
4. Create a new database named `nexus_pc`.
   - *The application will automatically create tables and seed data upon first connection.*

## 2. Project Configuration

1. Open the project folder in your code editor.
2. **Environment Variables**:
   - Create a `.env` file in the root folder (or `backend` folder) based on `.env.example`.
   - **Important**: Add your `GEMINI_API_KEY` to enable AI features.

   ```env
   PORT=3000
   JWT_SECRET=your_random_secret_string
   GEMINI_API_KEY=your_google_ai_key
   
   # MySQL Configuration (XAMPP Defaults)
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=nexus_pc
   ```

## 3. Installation & Running

You can install all dependencies and run both the frontend and backend using the root commands.

### Option A: One-Command Setup (Recommended)
1. Open a terminal in the **root** folder of the project.
2. Run: `npm install`
   - *This will automatically install dependencies for both the frontend and backend.*
3. Run: `npm run dev`
   - *This starts both the backend (port 5000) and the frontend (port 3000) concurrently.*
4. Access the app at `http://localhost:3000`.

### Option B: Separate Terminals (For Debugging)
If you prefer to see logs for each service separately:

**1. Start the Backend:**
- Open a terminal in the `backend` folder.
- Ensure you have a `.env` file in the `backend` folder (copy from `.env.example`).
- Run: `npm install` (first time)
- Run: `npm start`
- *Backend will run on http://localhost:5000*

**2. Start the Frontend:**
- Open a **new** terminal window in the `frontend` folder.
- Run: `npm install` (first time)
- Run: `npm run dev`
- *Frontend will run on http://localhost:3000*
- Access the app at `http://localhost:3000` (Vite will proxy API calls to port 5000).

## 4. SQLite Fallback
If MySQL is not available, the app will automatically fall back to **SQLite**. The database file will be created at `backend/database/nexus_v8.db`.

## 5. Admin Access
The **first user** who registers on the site will automatically be granted **Admin** rights. 
1. Navigate to the "Login/Register" page.
2. Create a new account.
3. Once logged in, you will see an "Admin" link in the navigation menu to manage products and inventory.

---
*Nexus PC - Smart PC Building Solutions*
