# 🏋️‍♂️ FITNESS TRACKER PRO

> **A Professional MERN Stack Fitness Management System with AI Integration**

A comprehensive full-stack web application designed for modern gym management and personal fitness tracking. Features role-based access control, AI-powered coaching, real-time progress analytics, and complete gym operations management.

![Built with](https://img.shields.io/badge/Built%20with-MERN%20Stack-61dafb?style=flat-square)
![Node Version](https://img.shields.io/badge/Node-v16%2B-339933?style=flat-square)
![License](https://img.shields.io/badge/License-ISC-green?style=flat-square)

---

## ✨ Key Features

* 📊 **Interactive Data Visualization**
  Dynamic weekly progress dashboard using **Recharts** displaying calories burned and workout duration with combined bar and line charts.

* 🤖 **AI 7-Day Plan & PDF Generator**
  Generate personalized 7-day diet & workout plans using **Google Gemma-3-27B-IT**, downloadable as PDFs via `html2pdf.js`.

* 🛡️ **Role-Based Authentication (User/Trainer/Admin)**
  3-tier access control with secure JWT-based authentication, Bcrypt password hashing, and role-specific dashboards.

* 💪 **Workout Management**
  Full CRUD functionality with AI-powered calorie estimation, automatic progress tracking, and weekly statistics aggregation.

* 👥 **Admin Command Center**
  Comprehensive user management, trainer assignment, salary tracking, fee processing, and role-based access control.

* 🎯 **Trainer Dashboard**
  Personal trainer features including client management, salary tracking, workout logging, and AI coaching.

* ⚡ **Modern UI/UX**
  Responsive frontend built with **React, Vite, and Bootstrap 5**, featuring tabbed navigation, real-time error handling, and automatic API retry logic.

---

## 🛠️ Tech Stack

### Frontend

* **React.js** (v19.2.4) - UI library
* **Vite** (v8.0.1) - Fast build tool & dev server
* **React Router DOM** (v7.14.0) - Client-side routing
* **Bootstrap 5** (v5.3.8) - Responsive CSS framework
* **Recharts** (v3.8.1) - Interactive charts & graphs
* **html2pdf.js** (v0.14.0) - PDF generation from HTML
* **React Hot Toast** (v2.6.0) - Toast notifications
* **@react-oauth/google** - Google OAuth 2.0 authentication

### Backend

* **Node.js** - JavaScript runtime
* **Express.js** (v5.2.1) - REST API framework
* **MongoDB** (via Mongoose v9.3.3) - NoSQL database
* **Google Generative AI** (v0.24.1) - Gemma-3-27B-IT model for AI coaching
* **Passport.js** - Authentication middleware
* **passport-google-oauth20** - Google OAuth strategy
* **express-session** - Session management
* **JWT** (jsonwebtoken v9.0.3) - Secure token-based authentication
* **Bcrypt.js** (v3.0.3) - Password hashing & security
* **CORS** (v2.8.6) - Cross-Origin Resource Sharing
* **Dotenv** (v17.4.0) - Environment variable management
* **Nodemon** (dev) - Auto-reload development server

---

## 📁 Project Structure

### 🖥️ Backend

```
backend/
├── config/
│   ├── db.js                 # MongoDB connection
│   └── passport.js           # Google OAuth strategy configuration
├── controllers/
│   ├── adminController.js    # Admin operations (roles, trainer assignment, salary)
│   ├── aiController.js       # AI coaching & plan generation
│   ├── authController.js     # User registration & login
│   ├── oauthController.js    # Google OAuth handler
│   └── workoutController.js  # Workout CRUD & statistics
├── middleware/
│   └── authMiddleware.js     # JWT verification & role-based access
├── models/
│   ├── User.js               # User schema (User/Trainer/Admin roles, OAuth fields)
│   └── Workout.js            # Workout schema
├── routes/
│   ├── adminRoutes.js        # Admin endpoints
│   ├── aiRoutes.js           # AI endpoints
│   ├── userRoutes.js         # Authentication & user endpoints
│   ├── workoutRoutes.js      # Workout endpoints
│   └── oauthRoutes.js        # Google OAuth endpoints
├── services/
│   └── aiService.js          # AI-powered calorie estimation
├── server.js                 # Express app initialization
└── .env                      # Environment variables (DO NOT COMMIT)
```

### 🎨 Frontend

```
frontend/
├── public/
│   └── fitness-app.png       # Logo
├── src/
│   ├── components/
│   │   ├── Chatbot.jsx       # AI 7-day plan generator with PDF export
│   │   └── WorkoutChart.jsx  # Weekly progress visualization
│   ├── pages/
│   │   ├── Login.jsx         # User login
│   │   ├── Register.jsx      # User registration
│   │   ├── UserDashboard.jsx # User dashboard (workout log, progress, AI coach)
│   │   ├── TrainerDashboard.jsx # Trainer dashboard (client management, salary)
│   │   └── AdminDashboard.jsx   # Admin command center (user & trainer management)
│   ├── App.jsx               # Main routing
│   ├── index.css             # Global styles
│   ├── main.jsx              # React entry point
│   ├── vite.config.js        # Vite configuration
│   └── eslint.config.js      # Linting rules
└── package.json              # Dependencies
```

---

## 🚀 Getting Started

### Prerequisites

* **Node.js** (v16+) installed
* **MongoDB** (local or MongoDB Atlas)
* **Google Gemini API Key** (get from [Google AI Studio](https://aistudio.google.com/app/apikey))

---

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_change_this
GEMINI_API_KEY=your_google_gemini_api_key
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret_key_change_this
```

### 🔐 Google OAuth Setup (Optional but Recommended)

To enable Google Sign-In/Sign-Up:

1. **Get Google OAuth Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable "Google+ API"
   - Create OAuth 2.0 credentials (Web application type)

2. **Configure Redirect URIs:**
   In Google Cloud Console, add these redirect URIs:
   - `http://localhost:5000/api/oauth/google/callback` (development)
   - `http://localhost:5173/login` (frontend)
   - Your production URLs (when deploying)

3. **Add to .env:**
   ```env
   GOOGLE_CLIENT_ID=your_client_id_from_google_console
   GOOGLE_CLIENT_SECRET=your_client_secret_from_google_console
   ```

4. **Add to frontend/.env:**
   ```env
   VITE_GOOGLE_CLIENT_ID=your_client_id_from_google_console
   ```

**Without Google OAuth:** The app works fine with email/password authentication. OAuth is optional.

Start the backend server:

```bash
npm run dev
```

✅ Backend runs on: **http://localhost:5000**

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file in the `frontend` directory:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

Then start the frontend:

```bash
npm run dev
```

🌐 Frontend runs on: **http://localhost:5173**

---

## ⚠️ Important - Environment Variables

**NEVER** commit your `.env` files to GitHub! They contain sensitive credentials.

- ✅ Copy from `.env.example` files in both `backend/` and `frontend/` directories
- ✅ Add your actual credentials locally
- ✅ `.env` files are already in `.gitignore`

The `.env` files are **already ignored** by Git, but make sure you never commit them accidentally.

## 🎯 User Roles & Features

### 👤 User (Regular Member)
- ✅ Register & Login
- ✅ Log daily workouts
- ✅ View weekly progress charts
* ✅ Generate AI 7-day fitness plans with PDF export
- ✅ Track gym membership status
- ✅ Assigned trainer info (if applicable)

### 🏆 Trainer (Personal Trainer)
- ✅ All user features
- ✅ Manage assigned clients
- ✅ View client list & status
- ✅ Log personal workouts
- ✅ View salary & payment status
- ✅ Personal performance dashboard

### 🔐 Admin (Gym Manager)
- ✅ Complete user management
- ✅ Upgrade/downgrade user roles
- ✅ Assign trainers to users
- ✅ Extend user gym membership
- ✅ Manage trainer salaries & payment status
- ✅ Update trainer specialization
- ✅ Delete users/trainers
- ✅ View all members & trainers

---

## 📡 API Endpoints

### 🔐 Authentication & Users (`/api/users`)

| Method | Endpoint         | Description                | Access | Role        |
| ------ | ---------------- | -------------------------- | ------ | ----------- |
| POST   | `/register`      | Register new user          | Public | -           |
| POST   | `/login`         | Login user                 | Public | -           |
| GET    | `/`              | Get all users              | Private| Admin       |
| GET    | `/me`            | Get current user profile   | Private| User/Trainer|
| GET    | `/trainer`       | Get trainer profile        | Private| Trainer     |
| PUT    | `/:id/fee`       | Extend user gym membership | Private| Admin       |
| DELETE | `/:id`           | Delete user                | Private| Admin       |

### 🏋️ Workouts (`/api/workouts`)

| Method | Endpoint      | Description                    | Access | Role     |
| ------ | ------------- | ------------------------------ | ------ | -------- |
| POST   | `/`           | Log new workout                | Private| User/Trainer |
| GET    | `/`           | Get user workouts              | Private| User/Trainer |
| GET    | `/stats`      | Get weekly stats for chart     | Private| User/Trainer |
| GET    | `/my-clients` | Get assigned clients (trainer) | Private| Trainer  |
| DELETE | `/:id`        | Delete workout                 | Private| User/Trainer |

### 🤖 AI Coach (`/api/ai`)

| Method | Endpoint        | Description              | Access | Role |
| ------ | --------------- | ------------------------ | ------ | ---- |
| POST   | `/`             | Chat with AI coach       | Private| User/Trainer |
| POST   | `/generate-plan`| Generate 7-day plan PDF | Private| User/Trainer |

### ⚙️ Admin Management (`/api/admin`)

| Method | Endpoint                  | Description              | Access | Role |
| ------ | ------------------------- | ------------------------ | ------ | ---- |
| PUT    | `/update-role`            | Change user role         | Private| Admin |
| PUT    | `/assign-trainer`         | Assign trainer to user   | Private| Admin |
| PUT    | `/update-specialization`  | Update trainer specialty | Private| Admin |
| PUT    | `/update-salary`          | Update trainer salary    | Private| Admin |

---

## 🔄 AI Features & Error Handling

### ✨ AI Capabilities
- **AI Chat Coach:** Real-time fitness advice and guidance
- **7-Day Plan Generation:** Custom workout & diet plans
- **Calorie Estimation:** AI-powered calorie burn calculation per exercise
- **Automatic Retry Logic:** 3 automatic retries with exponential backoff for API timeouts

### 🛡️ Error Handling
- Graceful 503 handling with user-friendly messages
- Automatic retry mechanism for temporary API unavailability
- Fallback calorie estimation (5 calories/minute) if AI fails
- JWT token-based secure authentication
- Role-based access control on all protected routes

---

## 📋 Environment Variables Guide

### Backend `.env` Template

```env
# Server Configuration
PORT=5000

# Database Configuration
MONGO_URL=mongodb://localhost:27017/fitness-tracker-db

# JWT Configuration
JWT_SECRET=change_this_to_a_strong_secret_key

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_from_google_ai_studio
```

### Important Notes:
- **MONGO_URL**: Use `mongodb://localhost:27017/fitness-tracker-db` for local MongoDB
- **JWT_SECRET**: Use a long, random string in production (at least 32 characters)
- **GEMINI_API_KEY**: Get free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

---

## 🧪 Testing the Application

### 1. Test User Registration
- Navigate to **Register** page
- Create account with email & password

### 2. Test User Dashboard
- Log in as user
- Log workouts (select day, exercise, duration)
- View weekly statistics chart
- Generate AI 7-day plan and download PDF

### 3. Test Admin Features (After creating test trainer)
- Make a user a trainer via Admin Dashboard
- Assign trainer to other users
- Extend gym membership
- Update trainer salary & specialization

### 4. Test Trainer Dashboard
- Log in as trainer
- View assigned clients
- Log personal workouts
- Check salary status

---

## ⚡ Performance Optimization

- **Frontend:** Vite provides instant HMR (Hot Module Replacement)
- **Backend:** Nodemon auto-restarts on file changes
- **Database:** MongoDB indexed queries for fast lookups
- **AI:** Gemma-3-27B-IT model for optimal speed/accuracy balance
- **Caching:** JWT tokens reduce database queries

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution:** 
- Ensure MongoDB is running locally: `mongod`
- Or update MONGO_URL in `.env` with Atlas connection string

### Issue: "AI service temporarily unavailable (503)"
**Solution:** 
- This is normal - Google API occasionally gets busy
- Wait 1-2 minutes and try again
- Our retry logic automatically handles this

### Issue: "Invalid API key"
**Solution:** 
- Verify your GEMINI_API_KEY in `.env`
- Check for spaces before/after the key
- Generate new key from Google AI Studio

### Issue: "Port 5000 already in use"
**Solution:** 
- Kill process: `lsof -ti:5000 | xargs kill -9`
- Or change PORT in `.env`

### Issue: "JWT token expired"
**Solution:** 
- Clear localStorage and log in again
- Token expires after 30 days

---

## 📚 Development Notes

### Key Design Decisions:
1. **Three-tier role system** for comprehensive gym management (User/Trainer/Admin)
2. **AI-powered calorie calculation** for accurate workout tracking
3. **Exponential backoff retry logic** for reliability during API spikes
4. **JWT + Bcrypt** for secure authentication
5. **Mongoose ODM** for type-safety with MongoDB
6. **React Hooks + Context** for state management

### Code Organization:
- Controllers handle business logic
- Routes define API structure  
- Middleware handles auth & validation
- Services contain reusable AI logic
- Models define data schemas

---

## 🚀 Deployment Guide

### Backend (Node.js)
- Deploy to: Heroku, Railway, Render, or AWS EC2
- Set production environment variables
- Use managed MongoDB (Atlas recommended)
- Enable HTTPS/SSL certificate

### Frontend (React + Vite)
- Build: `npm run build`
- Deploy to: Vercel, Netlify, AWS S3, or any static host
- Update API URL for production in code

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines:
- Follow existing code style
- Add comments for complex logic
- Test all features before submitting PR
- Update README if adding new features

---

## 📜 License

MIT License - You are free to use this project for personal or commercial purposes.

---

## 👨‍💻 Author

**Shivam Kumar**  
B.Tech Computer Science Engineering Student  
Passionate about Full-Stack Development, AI Integration, and Building Scalable Applications 🚀

### Connect:
- Email: shivamsingj648@gmail.com
- GitHub: [https://github.com/hello-shiva](https://github.com)
- LinkedIn: [https://www.linkedin.com/in/shivam-kumar-datanova](https://linkedin.com)

---

## 🙏 Acknowledgments

- **Google Generative AI** for Gemini 2.5 Flash API
- **React** & **Vite** communities
- **Bootstrap 5** for responsive design
- **Recharts** for beautiful data visualization
- All contributors and users of this project

---

## 📞 Support

If you encounter any issues or have questions:
1. Check the **Troubleshooting** section
2. Review error messages in browser console
3. Check backend logs for detailed errors
4. Open an issue on GitHub with detailed description

**Happy Coding! 💪**
