# Quick Start Commands

Copy and paste these commands in order to set up the application quickly.

## Windows PowerShell Commands

### 1. Initial Setup (One-time)

```powershell
# Clone repository (if not already cloned)
git clone <your-repository-url>
cd rn-universal

# Create MySQL database
mysql -u root -p
# Then run: CREATE DATABASE hushryd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
# Then run: exit;

# Backend Setup
cd hushryd-backend
copy env.example .env
# Edit .env file with your MySQL password and JWT secret
npm install
npm run setup-database
npm run setup-admin
npm run init-users

# Frontend Setup (in new terminal)
cd ..\hushryd-frontend
npm install
```

### 2. Start Application (Every time)

**Terminal 1 - Backend:**
```powershell
cd hushryd-backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd hushryd-frontend
npm start
```

---

## Linux/Mac Bash Commands

### 1. Initial Setup (One-time)

```bash
# Clone repository (if not already cloned)
git clone <your-repository-url>
cd rn-universal

# Create MySQL database
mysql -u root -p
# Then run: CREATE DATABASE hushryd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
# Then run: exit;

# Backend Setup
cd hushryd-backend
cp env.example .env
# Edit .env file with your MySQL password and JWT secret
npm install
npm run setup-database
npm run setup-admin
npm run init-users

# Frontend Setup (in new terminal)
cd ../hushryd-frontend
npm install
```

### 2. Start Application (Every time)

**Terminal 1 - Backend:**
```bash
cd hushryd-backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd hushryd-frontend
npm start
```

---

## Essential Commands Reference

| Task | Command |
|------|---------|
| Install backend dependencies | `cd hushryd-backend && npm install` |
| Install frontend dependencies | `cd hushryd-frontend && npm install` |
| Setup database tables | `cd hushryd-backend && npm run setup-database` |
| Setup admin system | `cd hushryd-backend && npm run setup-admin` |
| Start backend (dev) | `cd hushryd-backend && npm run dev` |
| Start backend (prod) | `cd hushryd-backend && npm start` |
| Start frontend | `cd hushryd-frontend && npm start` |
| Run frontend on web | `cd hushryd-frontend && npm run web` |
| Run frontend on Android | `cd hushryd-frontend && npm run android` |
| Run frontend on iOS | `cd hushryd-frontend && npm run ios` |
| Test backend API | `cd hushryd-backend && npm run test-api` |

---

## Environment Variables to Configure

Edit `hushryd-backend/.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hushryd
DB_USER=root
DB_PASSWORD=your_mysql_password_here
JWT_SECRET=your_super_secret_jwt_key_here
PORT=3000
```

---

## Ports Used

- **Backend API**: `http://localhost:3000`
- **Frontend (Expo)**: `http://localhost:8081` (default)
- **MySQL**: `localhost:3306` (default)

---

## Quick Troubleshooting

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear Expo cache
cd hushryd-frontend
npx expo start -c

# Check if ports are in use
# Windows: netstat -ano | findstr :3000
# Linux/Mac: lsof -i :3000
```
