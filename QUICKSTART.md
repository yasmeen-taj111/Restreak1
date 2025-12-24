# Quick Start Guide

## Prerequisites Check

1. **Node.js**: Make sure you have Node.js v14+ installed
   ```bash
   node --version
   ```

2. **MongoDB**: Ensure MongoDB is running
   ```bash
   # Check if MongoDB is running
   pgrep mongod
   
   # If not running, start it:
   # macOS (Homebrew): brew services start mongodb-community
   # Or use MongoDB Atlas (cloud) - update MONGODB_URI in .env
   ```

## Start the Application

### Option 1: Start both servers together (Recommended)
```bash
npm run dev
```

### Option 2: Start servers separately

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

## Access the Application

Once started, open your browser to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

## First Time Setup

1. Register a new account at http://localhost:3000
2. Login with your credentials
3. Start tracking your sleep and habits!

## Expected Output

### Backend Server Output:
```
MongoDB connected
Server running on port 5000
```

### Frontend Server Output:
```
Compiled successfully!

You can now view restreak in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running: `pgrep mongod`
- Check your `.env` file has the correct `MONGODB_URI`
- For MongoDB Atlas, use: `mongodb+srv://username:password@cluster.mongodb.net/restreak`

### Port Already in Use
- Backend (5000): Change `PORT` in `.env` file
- Frontend (3000): The React dev server will ask if you want to use a different port

### Dependencies Not Installed
```bash
npm run install-all
```

