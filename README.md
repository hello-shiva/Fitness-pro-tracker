🏋️‍♂️ FITNESS-TRACKER-PRO
A complete Full-Stack (MERN) application to track your fitness journey, log workouts, and get advice from an AI-powered fitness assistant. This project was built to provide a seamless experience for users to manage their health and fitness goals.

🌟 Features
User Authentication: Secure sign-up and login using JWT (JSON Web Tokens) with password hashing via bcrypt.

Workout Management: Create, read, update, and delete workout logs (CRUD operations).

AI Fitness Assistant: Integrated chatbot to answer fitness, workout, and nutrition-related questions.

Secure API: Protected routes using custom authentication middleware.

Clean Architecture: Well-organized project structure separating concerns into controllers, models, routes, and services.

Responsive UI: A modern and responsive frontend built with React and Vite.

🛠️ Tech Stack
Frontend:

React.js

Vite (Build tool)

CSS for styling

Backend:

Node.js & Express.js (Web Framework)

MongoDB (Database)

Mongoose (ODM)

JWT (for security)

📁 Project Structure
This project is divided into two main folders: frontend and backend.

Backend Structure (backend/)
Referencing image_0.png:

Plaintext
backend/
├── config/             # Database connection configuration
│   └── db.js           # Connects to MongoDB
├── controllers/        # Request handling logic
│   ├── aiController.js # Logic for AI requests
│   ├── authController.js # Logic for login/register
│   └── workoutController.js # Logic for CRUD operations on workouts
├── middleware/         # Custom middleware
│   └── authMiddleware.js # Middleware to verify JWT tokens
├── models/             # Database schemas
│   ├── User.js         # User model schema
│   └── Workout.js      # Workout model schema
├── routes/             # API route definitions
│   ├── aiRoutes.js     # Routes for AI assistant
│   ├── userRoutes.js   # Routes for user authentication
│   └── workoutRoutes.js # Routes for workout operations
├── services/           # External service integrations
│   └── aiService.js    # Communicates with external AI APIs
├── .env                # Environment variables (private)
├── .gitignore          # Files to exclude from Git
├── server.js           # Entry point for the backend application
└── package.json        # Dependencies and scripts
Frontend Structure (frontend/)
Referencing image_1.png:

Plaintext
frontend/
├── src/                # Source files
│   ├── assets/         # Images and other static files
│   │   └── fitness-app.png
│   ├── components/      # Reusable UI components
│   │   └── Chatbot.jsx # Component for the AI chat interface
│   ├── pages/           # Page components
│   ├── App.jsx          # Main App component
│   ├── index.css        # Global styles
│   └── main.jsx         # Entry point for React
├── eslint.config.js    # Linter configuration
├── index.html          # Main HTML file
└── vite.config.js      # Configuration for Vite
🚀 Getting Started
Prerequisites
Node.js installed on your machine.

A MongoDB Atlas account (or local MongoDB setup).

An API key for the AI service used in aiService.js (e.g., OpenAI API key).

1. Backend Setup
Open a terminal and navigate to the backend folder:

Bash
cd backend
Install dependencies:

Bash
npm install
Create a .env file in the backend root folder and populate it with your configuration:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
AI_API_KEY=your_ai_api_key_if_applicable
Run the backend server in development mode (using nodemon):

Bash
npm run dev
# or if not using nodemon
node server.js
2. Frontend Setup
Open a new terminal and navigate to the frontend folder:

Bash
cd frontend
Install dependencies:

Bash
npm install
Run the frontend development server:

Bash
npm run dev
The application will typically start at http://localhost:5173.

📡 API Endpoints
User Routes (/api/users)
POST /register: Create a new user account.

POST /login: Authenticate a user and return a token.

Workout Routes (/api/workouts) - Protected, requires JWT
GET /: Get all workouts for the logged-in user.

POST /: Add a new workout.

PATCH /:id: Update a specific workout.

DELETE /:id: Delete a specific workout.

AI Routes (/api/ai) - Protected, requires JWT
POST /chat: Send a user prompt to the AI fitness assistant.

🤝 Contributing
Contributions are welcome! If you have suggestions or find bugs, feel free to open an issue or create a pull request.

📜 License
This project is licensed under the MIT License.

Developed with ❤️ by Shivam.
