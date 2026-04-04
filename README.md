# 🏋️‍♂️ FITNESS-TRACKER-PRO

A **comprehensive MERN Stack Fitness Management System** with advanced AI integration. Designed to help users track workouts, visualize progress, and generate personalized 7-day fitness plans exported directly as PDFs.

---

## 🌟 Overview

**FITNESS-TRACKER-PRO** is a high-performance full-stack web application that elevates the fitness journey. Moving beyond simple logging, it offers an interactive graphical dashboard, role-based access control (Admin/User), and an integrated AI Coach powered by **Google Gemini 2.5 Flash** for real-time advice and custom diet/workout generation.

---

## ✨ Key Features

* 📊 **Interactive Data Visualization**
  A dynamic dashboard using **Recharts** to display weekly fitness progress with bar and line charts.

* 🤖 **AI 7-Day Plan & PDF Generator**
  Generate personalized diet & workout plans using **Gemini 2.5 Flash API**, downloadable as PDFs via `html2pdf.js`.

* 🛡️ **Role-Based Authentication (Admin & User)**
  Secure login system using **JWT** and **Bcrypt.js**, with admin controls for user management.

* 💪 **Workout Management**
  Full CRUD functionality with backend aggregation for accurate analytics.

* ⚡ **Modern UI/UX**
  Responsive frontend built with **React, Vite, and Bootstrap**, featuring a clean tab-based navigation.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* CSS3, Bootstrap 5
* Recharts
* html2pdf.js

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose ODM)
* JWT, Bcrypt.js
* @google/genai (Gemini 2.5 Flash)

---

## 📁 Project Structure

### 🖥️ Backend

```text
backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── server.js
└── .env
```

### 🎨 Frontend

```text
frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js installed
* MongoDB Atlas or local MongoDB
* Google Gemini API Key

---

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

Run backend:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

🌐 App runs at: **[http://localhost:5173](http://localhost:5173)**

---

## 📡 API Endpoints

### 🔐 Authentication & Users

| Method | Endpoint            | Description   | Access |
| ------ | ------------------- | ------------- | ------ |
| POST   | /api/users/register | Register user | Public |
| POST   | /api/users/login    | Login user    | Public |
| GET    | /api/users          | Get all users | Admin  |
| PUT    | /api/users/fee/:id  | Extend fee    | Admin  |
| DELETE | /api/users/:id      | Delete user   | Admin  |

### 🏋️ Workouts

| Method | Endpoint            | Description      | Access  |
| ------ | ------------------- | ---------------- | ------- |
| POST   | /api/workouts       | Add workout      | Private |
| GET    | /api/workouts       | Get workouts     | Private |
| DELETE | /api/workouts/:id   | Delete workout   | Private |
| GET    | /api/workouts/stats | Stats for charts | Private |

### 🤖 AI Coach

| Method | Endpoint              | Description   | Access  |
| ------ | --------------------- | ------------- | ------- |
| POST   | /api/ai/chat          | Ask AI        | Private |
| POST   | /api/ai/generate-plan | Generate plan | Private |

---

## 🤝 Contributing

1. Fork the repo
2. Create branch (`feature/your-feature`)
3. Commit changes
4. Push branch
5. Open PR

---

## 📜 License

MIT License

---

## 👨‍💻 Author

**Shivam**
B.Tech CSE Student
Passionate about Full-Stack Development, Data Analytics & AI Integration 🚀
