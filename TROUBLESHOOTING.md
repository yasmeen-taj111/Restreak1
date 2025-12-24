# Troubleshooting Guide

## Network Error When Logging In / Registering

### Common Causes and Solutions

#### 1. Backend Server Not Running
**Symptom**: Network error or "Cannot connect to server"

**Solution**:
```bash
# Check if backend is running
lsof -i:5001

# Start the backend server
npm run server

# Or start both servers
npm run dev
```

You should see:
```
MongoDB connected
Server running on port 5001
```

#### 2. Wrong Port Configuration
**Symptom**: Connection refused errors

**Check**:
- Backend is configured to run on port 5001 (default)
- Frontend is configured to connect to `http://localhost:5001/api`

**Fix**: 
- Check `frontend/.env` file (if exists):
  ```
  REACT_APP_API_URL=http://localhost:5001/api
  ```
- Or check `backend/server.js` - PORT should be 5001 (or match your .env)

#### 3. MongoDB Not Running
**Symptom**: Backend crashes or shows MongoDB connection errors

**Solution**:
```bash
# Check if MongoDB is running
pgrep mongod

# Start MongoDB (macOS Homebrew)
brew services start mongodb-community

# Or check MongoDB connection string in .env
```

#### 4. CORS Issues
**Symptom**: CORS errors in browser console

**Solution**: CORS is already configured in `backend/server.js` with `app.use(cors())`. If you see CORS errors, check:
- Backend server is actually running
- Correct port (5001) is being used
- No firewall blocking localhost connections

#### 5. Browser Console Errors
**Check**: Open browser DevTools (F12) and look at:
- Console tab for error messages
- Network tab to see if requests are being made
- Check if requests show "Failed" or "Pending"

### Quick Diagnostic Steps

1. **Test Backend Manually**:
```bash
curl http://localhost:5001/api/health
```
Should return: `{"status":"OK","message":"Server is running"}`

2. **Test Registration Endpoint**:
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test"}'
```

3. **Check Frontend Console**:
- Open browser DevTools (F12)
- Look for "API Base URL: http://localhost:5001/api" in console
- Check Network tab for failed requests

4. **Verify Both Servers Running**:
```bash
# Should see both processes
ps aux | grep -E "node.*server|react-scripts"
```

### Reset Everything

If nothing works, try:
```bash
# Stop all servers (Ctrl+C)

# Restart MongoDB
brew services restart mongodb-community  # macOS

# Clear node_modules and reinstall
rm -rf node_modules frontend/node_modules
npm run install-all

# Restart servers
npm run dev
```

### Still Having Issues?

1. Check the exact error message in browser console
2. Verify MongoDB is running: `mongosh` should connect
3. Verify backend logs show "MongoDB connected" and "Server running on port 5001"
4. Check if port 5001 is already in use: `lsof -i:5001`

