# Setup Guide - HushRyd Application

This guide provides step-by-step instructions to set up and run the HushRyd application on a new system.

## Prerequisites

Before starting, ensure you have the following installed:

1. **Node.js** (v16.0.0 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **MySQL Database** (v5.7 or higher)
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use XAMPP/WAMP which includes MySQL
   - Verify installation: `mysql --version`

3. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

4. **Git** (for cloning the repository)
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

5. **For Mobile Development (Optional)**:
   - **Expo CLI**: `npm install -g expo-cli`
   - **Android Studio** (for Android development)
   - **Xcode** (for iOS development - macOS only)

---

## Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd rn-universal
```

---

## Step 2: Database Setup

### 2.1 Create MySQL Database

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE hushryd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Exit MySQL
exit;
```

### 2.2 Configure Backend Environment Variables

```bash
# Navigate to backend directory
cd hushryd-backend

# Copy environment example file
copy env.example .env
# On Linux/Mac: cp env.example .env

# Edit .env file with your database credentials
# Update these values:
# - DB_HOST=localhost
# - DB_PORT=3306
# - DB_NAME=hushryd
# - DB_USER=root
# - DB_PASSWORD=your_mysql_password
# - JWT_SECRET=your_super_secret_jwt_key_here
```

---

## Step 3: Backend Setup

### 3.1 Install Backend Dependencies

```bash
# Make sure you're in hushryd-backend directory
cd hushryd-backend

# Install dependencies
npm install
```

### 3.2 Initialize Database Tables

```bash
# Setup database tables
npm run setup-database

# Setup admin system
npm run setup-admin

# Initialize users table
npm run init-users
```

### 3.3 Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm start
```

The backend server will run on `http://localhost:3000` (or the PORT specified in .env)

**Keep this terminal window open!**

---

## Step 4: Frontend Setup

### 4.1 Install Frontend Dependencies

Open a **new terminal window** and navigate to the frontend directory:

```bash
# Navigate to frontend directory
cd hushryd-frontend

# Install dependencies
npm install
```

### 4.2 Configure Frontend Environment (if needed)

Check if there's a `.env` file in the frontend directory. If the frontend needs backend API URL configuration, create/update it:

```bash
# Create .env file if needed
# Add API URL if required:
# API_BASE_URL=http://localhost:3000/api
```

### 4.3 Start Frontend Development Server

```bash
# Start Expo development server
npm start

# OR run on specific platform:
npm run web      # Web browser
npm run android  # Android emulator/device
npm run ios      # iOS simulator (macOS only)
```

The Expo development server will start and show a QR code. You can:
- Press `w` to open in web browser
- Press `a` to open in Android emulator
- Press `i` to open in iOS simulator
- Scan QR code with Expo Go app on your phone

---

## Quick Start Commands Summary

### Complete Setup (First Time)

```bash
# 1. Clone repository
git clone <your-repository-url>
cd rn-universal

# 2. Setup database
mysql -u root -p
CREATE DATABASE hushryd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;

# 3. Backend setup
cd hushryd-backend
copy env.example .env
# Edit .env with your database credentials
npm install
npm run setup-database
npm run setup-admin
npm run init-users

# 4. Frontend setup (in new terminal)
cd hushryd-frontend
npm install

# 5. Start backend (Terminal 1)
cd hushryd-backend
npm run dev

# 6. Start frontend (Terminal 2)
cd hushryd-frontend
npm start
```

### Daily Development (After Initial Setup)

```bash
# Terminal 1 - Start Backend
cd hushryd-backend
npm run dev

# Terminal 2 - Start Frontend
cd hushryd-frontend
npm start
```

---

## Troubleshooting

### Backend Issues

1. **Database Connection Error**
   - Verify MySQL is running: `mysql -u root -p`
   - Check `.env` file has correct database credentials
   - Ensure database `hushryd` exists

2. **Port Already in Use**
   - Change `PORT` in `.env` file
   - Or kill the process using the port:
     - Windows: `netstat -ano | findstr :3000` then `taskkill /PID <PID> /F`
     - Linux/Mac: `lsof -ti:3000 | xargs kill`

3. **Module Not Found**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

### Frontend Issues

1. **Expo Not Starting**
   - Clear Expo cache: `npx expo start -c`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

2. **Cannot Connect to Backend**
   - Verify backend is running on `http://localhost:3000`
   - Check CORS settings in backend `.env`
   - Ensure API_BASE_URL in frontend matches backend URL

3. **Metro Bundler Issues**
   - Clear watchman: `watchman watch-del-all` (if installed)
   - Reset Metro cache: `npx react-native start --reset-cache`

---

## Testing the Setup

### Test Backend API

```bash
# In hushryd-backend directory
npm run test-api
npm run test-auth
npm run test-admin
```

### Test Database Connection

```bash
# In hushryd-backend directory
node -e "require('./config/database').testConnection()"
```

---

## Project Structure

```
rn-universal/
├── hushryd-backend/     # Node.js/Express backend API
│   ├── server.js        # Main server file
│   ├── routes/          # API routes
│   ├── models/          # Database models
│   ├── scripts/         # Setup scripts
│   └── .env            # Environment variables
│
└── hushryd-frontend/    # React Native/Expo frontend
    ├── app/            # App screens and navigation
    ├── components/     # Reusable components
    └── package.json    # Frontend dependencies
```

---

## Default Admin Credentials

After running `npm run setup-admin`, you can login with:
- **Email**: `admin@hushryd.com` (or as configured in `.env`)
- **Password**: `admin123` (or as configured in `.env`)

**⚠️ Important**: Change these credentials in production!

---

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

---

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed correctly
3. Ensure database is running and accessible
4. Check that all environment variables are set correctly

---

**Happy Coding! 🚀**
