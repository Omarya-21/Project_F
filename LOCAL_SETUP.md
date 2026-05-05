# Omar's PC - Local Setup Instructions (XAMPP & MySQL)

Follow these steps to run the application on your computer using XAMPP and MySQL.

## Prerequisites
- [Node.js](https://nodejs.org/) (Version 16 or higher)
- [XAMPP](https://www.apachefriends.org/index.html) (For MySQL)

## 1. Database Setup (MySQL)
1. Start **XAMPP Control Panel**.
2. Start the **MySQL** module.
3. Open your browser and go to `http://localhost/phpmyadmin`.
4. Click on **New** to create a new database.
5. Name the database `omar_pc` and click **Create**.

## 2. Server Configuration
1. Open the project folder in your code editor.
2. Navigate to the `backend` folder.
3. Copy the `.env.example` file and rename it to `.env`.
4. Open the `.env` file and verify the settings:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=omar_pc
   PORT=3000
   JWT_SECRET=your_random_secret_string
   GEMINI_API_KEY=your_google_ai_key
   ```
   *Note: If you have a different MySQL user/password in XAMPP, update them here.*

## 3. Installation
Open your terminal in the root project folder and run:
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

## 4. Running the Application
Return to the root folder and run:
```bash
npm run dev
```
Wait a few seconds until you see both servers start.
- Frontend will be at: `http://localhost:5173` (or similar)
- Backend will be at: `http://localhost:3000`

## 5. Admin Access
The **first user** who registers on the site will automatically be granted **Admin** rights. 
1. Go to the "Logon" page.
2. Create your account.
3. You will see an "Admin" link in the navbar to manage products.

---
*Developed by Omar's PC Systems*
