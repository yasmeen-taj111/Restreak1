# Restreak - Habit & Sleep Tracker

A full-stack, responsive web application for tracking daily habits and sleep patterns with comprehensive analytics and beautiful visualizations. Inspired by paper-based habit trackers, this app provides a digital solution for monitoring your wellness journey throughout the year.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.2.3-blue.svg)
![MongoDB](https://img.shields.io/badge/mongodb-8.0+-green.svg)

## ✨ Features

### 🛌 Sleep Tracker

- **Visual Grid Interface**: Click-to-select sleep duration (4-7 hours) for each day
- **Color-Coded Indicators**:
  - 🔴 4 hours (Red)
  - 🟡 5 hours (Yellow)
  - 🟢 6 hours (Green)
  - 🔵 7 hours (Blue)
- **One Selection Per Day**: Toggle between durations or clear selection
- **Hover Tooltips**: See date and sleep hours on hover

### ✅ Habit & Goals Tracker

- **Custom Habits**: Add, edit, and delete personal habits
- **Daily Completion**: Click cells to mark habits as complete (✔)
- **Streak Tracking**: Visual indicators for daily habit streaks
- **Editable Names**: Click habit names to edit inline
- **Real-time Updates**: Instant synchronization across all devices

### 📈 Analytics & Insights

- **Sleep Trend Chart**: Interactive line chart showing sleep patterns over time
- **Habit Completion Bar Chart**: Visual representation of habit completion percentages
- **Monthly Activity Heatmap**: Color-coded grid showing daily activity levels
- **Circular Progress Indicators**: Quick view of sleep quality, habits, and productivity scores
- **Monthly Wrap-up Report**:
  - Average sleep duration
  - Longest streak tracking
  - Most consistent habit
  - Productivity score
  - Most productive day insights

### 🔐 User Features

- **Secure Authentication**: JWT-based email/password authentication
- **User-Specific Data**: All data is isolated per user account
- **Month Navigation**: Switch between months seamlessly
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile devices
- **Dark Theme UI**: Modern, minimal interface with Tailwind CSS

## 🛠️ Tech Stack

### Frontend

- **React 19.2.3** - UI library
- **React Router 7.11.0** - Client-side routing
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Chart.js 4.5.1** - Data visualization
- **Axios 1.13.2** - HTTP client
- **React ChartJS 2** - React wrapper for Chart.js

### Backend

- **Node.js** - Runtime environment
- **Express 5.2.1** - Web framework
- **MongoDB** - Database (via Mongoose 9.0.2)
- **JWT** - Authentication (jsonwebtoken 9.0.3)
- **bcryptjs 3.0.3** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **MongoDB** (v8.0+ or MongoDB Atlas account)

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/tracker.git
cd tracker
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```bash
MONGO_URI=mongodb+srv://<credentials>@<cluster-url>/<database-name>
JWT_SECRET=your-strong-secret-key-here
PORT=5001
NODE_ENV=development
```

**Note**:

- For MongoDB Atlas, use your connection string: mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER_URL>/<DB_NAME>
- Use a strong, random `JWT_SECRET` in production
- Port 5001 is used because port 5000 is often occupied by macOS Control Center

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

The frontend is pre-configured to connect to `http://localhost:5001/api`. To override, create a `.env` file:

```bash
REACT_APP_API_URL=http://localhost:5001/api
```

## 🏃 Running the Application

### Start MongoDB

**Local MongoDB:**

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**MongoDB Atlas:**

- No local setup needed, just use your connection string in `.env`

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5001`

### Start Frontend Development Server

```bash
cd frontend
npm start
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

## 📖 Usage Guide

### Getting Started

1. **Register/Login**: Create an account or log in with existing credentials
2. **Select Month**: Use the month selector in the header to navigate between months
3. **Track Sleep**: Click cells in the sleep tracker grid to log sleep hours (4-7 hrs)
4. **Add Habits**: Enter habit names in the input field and click "Add"
5. **Mark Habits Complete**: Click cells in the habit tracker to toggle completion
6. **View Analytics**: Scroll down to see charts and monthly insights

### Tips

- **Sleep Tracker**: Click the same cell again to remove a sleep log
- **Habit Editing**: Click on a habit name to edit it inline
- **Habit Deletion**: Click the ✕ button next to a habit name to delete it
- **Month Navigation**: All data is month-specific, switch months to see different periods

## 🔌 API Documentation

### Authentication

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Sleep Logs

#### Get Sleep Logs (Month)

```http
GET /api/sleep?month=1&year=2025
Authorization: Bearer <token>
```

#### Create/Update Sleep Log

```http
POST /api/sleep
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2025-01-15T00:00:00.000Z",
  "sleepHours": 7
}
```

### Habits

#### Get All Habits

```http
GET /api/habits
Authorization: Bearer <token>
```

#### Create Habit

```http
POST /api/habits
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Exercise daily"
}
```

#### Update Habit

```http
PUT /api/habits/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated habit name"
}
```

#### Delete Habit

```http
DELETE /api/habits/:id
Authorization: Bearer <token>
```

### Habit Logs

#### Get Habit Logs (Month)

```http
GET /api/habits/logs?month=1&year=2025
Authorization: Bearer <token>
```

#### Toggle Habit Completion

```http
POST /api/habits/logs
Authorization: Bearer <token>
Content-Type: application/json

{
  "habitId": "habit_id_here",
  "date": "2025-01-15T00:00:00.000Z",
  "completed": true
}
```

### Analytics

#### Weekly Analytics

```http
GET /api/analytics/weekly?month=1&year=2025
Authorization: Bearer <token>
```

#### Monthly Analytics

```http
GET /api/analytics/monthly?month=1&year=2025
Authorization: Bearer <token>
```

## 📁 Project Structure

```
tracker/
├── backend/
│   ├── controllers/       # Business logic (if needed)
│   ├── middleware/        # Auth middleware
│   ├── models/            # MongoDB schemas
│   │   ├── User.js
│   │   ├── SleepLog.js
│   │   ├── Habit.js
│   │   └── HabitLog.js
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── sleep.js
│   │   ├── habits.js
│   │   └── analytics.js
│   ├── index.js           # Express server entry point
│   └── package.json
│
├── frontend/
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── SleepTrackerGrid.js
│   │   │   ├── HabitTrackerGrid.js
│   │   │   ├── AnalyticsCharts.js
│   │   │   ├── MonthSelector.js
│   │   │   └── ErrorBoundary.js
│   │   ├── pages/        # Page components
│   │   │   ├── LoginPage.js
│   │   │   └── DashboardPage.js
│   │   ├── auth/         # Authentication context
│   │   ├── utils/        # Utility functions
│   │   ├── App.js        # Main app component
│   │   └── index.js      # React entry point
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
```

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **User Data Isolation**: All queries filtered by userId
- **Input Validation**: Server-side validation on all endpoints
- **CORS Configuration**: Proper cross-origin setup
- **Environment Variables**: Sensitive data stored in `.env`

## 🧪 Testing

```bash
# Backend tests (when implemented)
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚢 Building for Production

### Frontend Build

```bash
cd frontend
npm run build
```

The production build will be in the `frontend/build` directory.

### Backend Production

```bash
cd backend
NODE_ENV=production npm start
```

**Important**: Set `NODE_ENV=production` and use a strong `JWT_SECRET` in production.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👤 Author

**Yasmeen Taj**

- Email: yasmeentaj.6042@gmail.com
- GitHub: [yasmeen-taj111](https://github.com/yasmeen-taj111)

## 🙏 Acknowledgments

- Inspired by paper-based habit trackers
- Built with React, Express, and MongoDB
- UI components styled with Tailwind CSS
- Charts powered by Chart.js

## 📸 Screenshots

<p align="center">
  <img src="https://github.com/yasmeen-taj111/images/blob/main/t1.jpeg?raw=true" width="45%" />
  <img src="https://github.com/yasmeen-taj111/images/blob/main/t2.jpeg?raw=true" width="45%" />
</p>

<p align="center">
  <img src="https://github.com/yasmeen-taj111/images/blob/main/t3.jpeg?raw=true" width="45%" />
  <img src="https://github.com/yasmeen-taj111/images/blob/main/t4.jpeg?raw=true" width="45%" />
</p>

## 🐛 Known Issues

- None at the moment. Please report any issues you encounter!

## 🔮 Future Enhancements

- [ ] Weekly view option
- [ ] Habit categories/tags
- [ ] Export data to CSV/PDF
- [ ] Mobile app (React Native)
- [ ] Social features (share progress)
- [ ] Reminder notifications
- [ ] Dark/Light theme toggle
- [ ] Multi-language support

---

⭐ If you find this project helpful, please consider giving it a star!
