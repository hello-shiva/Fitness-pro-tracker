# 🏋️‍♂️ FitTrack Pro - Frontend

FitTrack Pro is a modern, high-energy fitness tracking application designed with a sleek dark gym aesthetic. Built using the MERN stack, it empowers users to log their daily workouts, track their progress, and get personalized advice from an integrated AI Fitness Coach.

## ✨ Key Features

* 🔒 **Secure Authentication:** Dedicated Login and Registration flows for user access.
* 📊 **Interactive Dashboard:** Log workouts by selecting the day, exercise name, and duration with an instant history view.
* 🤖 **AI Fitness Coach:** A built-in chat interface to ask fitness, diet, and workout-related questions.
* 🛠️ **Admin Command Center:** A specialized admin panel to monitor system statistics, total users, and activity logs.
* 🌙 **Custom Dark Theme:** A visually striking "garage gym" aesthetic featuring neon green accents and smooth transition effects.
* 📱 **Optimized Layout:** Clean, centered UI components designed for focus and productivity.

## 🚀 Tech Stack

* **Core Framework:** [React 18](https://react.dev/) (Vite)
* **Routing:** `react-router-dom` for seamless page navigation.
* **Styling:** Pure Custom CSS (`index.css`) with CSS Variables for consistent dark-mode theming.
* **Notifications:** `react-hot-toast` for sleek, non-intrusive alert messages.
* **Typography:** Google Fonts (Bebas Neue & Poppins).

## 📂 Project Structure

```text
frontend/
├── public/               # Static assets (favicons, logos)
├── src/
│   ├── components/       # Reusable UI components (e.g., Chatbot.jsx)
│   ├── pages/            # Core application views
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── UserDashboard.jsx
│   │   └── AdminDashboard.jsx
│   ├── App.jsx           # Root component and Routing configuration
│   ├── main.jsx          # Entry point for the React application
│   └── index.css         # Master Stylesheet (Custom Gym Theme)
├── package.json          # Dependencies and scripts
└── vite.config.js        # Vite build configuration

🛠️ Installation & Setup
Follow these steps to run the frontend on your local machine:

Prerequisites
Ensure you have Node.js installed.

1. Clone the repository
Bash
git clone <your-github-repo-link>
2. Navigate to the directory
Bash
cd frontend
3. Install dependencies
Bash
npm install
4. Start the development server
Bash
npm run dev
The app will be available at http://localhost:5173.

📝 License
This project is open-source and available under the MIT License