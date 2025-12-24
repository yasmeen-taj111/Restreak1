# Restreak - Habit & Sleep Tracker

A full-stack, responsive web application for tracking monthly habits and sleep patterns.

## Features

- **Sleep Tracker**: Track sleep duration (4-7 hours) with visual indicators
- **Habit Tracker**: Track daily habits with streak monitoring
- **Analytics Dashboard**: Weekly and monthly reports with interactive visualizations
- **User Authentication**: Secure email/password authentication
- **Month Navigation**: Switch between months to view historical data

## Tech Stack

- **Frontend**: React, HTML, CSS, JavaScript
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT-based authentication

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. Clone the repository and navigate to the project directory:
```bash
cd restreak
```

2. Install backend dependencies:
```bash
npm run install-server
```

3. Install frontend dependencies:
```bash
npm run install-client
```

Or install all at once:
```bash
npm run install-all
```

4. Set up environment variables:

Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/restreak
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

For MongoDB Atlas, use:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/restreak
```

5. Start the development servers:

```bash
npm run dev
```

This will start both the backend server (port 5000) and frontend development server (port 3000).

### Alternative: Run Separately

Backend only:
```bash
npm run server
```

Frontend only:
```bash
npm run client
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Sleep Tracking
- `GET /api/sleep/:userId?month=YYYY-MM` - Get sleep logs for a month
- `POST /api/sleep` - Create/update sleep log
- `DELETE /api/sleep/:userId/:date` - Delete sleep log

### Habit Tracking
- `GET /api/habits/:userId?month=YYYY-MM` - Get habits and logs for a month
- `POST /api/habits` - Create a new habit
- `PUT /api/habits/:habitId` - Update habit name
- `DELETE /api/habits/:habitId` - Delete a habit
- `POST /api/habits/log` - Create/update habit log (toggle completion)

### Analytics
- `GET /api/analytics/weekly/:userId?week=YYYY-MM-DD` - Get weekly report
- `GET /api/analytics/monthly/:userId?month=YYYY-MM` - Get monthly report

## Project Structure

```
restreak/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── SleepLog.js
│   │   └── HabitLog.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── sleep.js
│   │   ├── habits.js
│   │   └── analytics.js
│   ├── middleware/
│   │   └── auth.js
│   ├── config/
│   │   └── db.js
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
├── package.json
└── README.md
```

## Usage

1. Register a new account or login
2. Navigate to the dashboard
3. Click cells in the Sleep Tracker to log sleep duration
4. Add habits in the Habit Tracker section
5. Click cells to mark habits as completed
6. View analytics and reports in the Analytics section
7. Use the month selector to navigate between months

## Development

The application uses:
- React Hooks for state management
- Express.js for RESTful API
- Mongoose for MongoDB ODM
- JWT for authentication
- Chart.js/Recharts for data visualization

## License

MIT

