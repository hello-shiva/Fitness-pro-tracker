# 🏋️‍♂️ FITNESS-TRACKER-PRO

A **comprehensive MERN Stack Fitness Management System with AI Integration** designed to help users track workouts, monitor progress, and receive intelligent fitness guidance.

---

## 🌟 Overview

**FITNESS-TRACKER-PRO** is a high-performance full-stack web application that enables users to manage their fitness journey efficiently. From logging workouts to interacting with an AI-powered assistant, the platform delivers a modern and scalable experience.

---

## ✨ Key Features

* 🔐 **Secure Authentication**
  User registration and login with **JWT** and **Bcrypt.js** password hashing.

* 💪 **Workout Management**
  Full CRUD functionality to create, read, update, and delete workout logs.

* 🤖 **AI Fitness Assistant**
  Integrated chatbot for exercise tips, diet suggestions, and recovery advice.

* 🛡️ **Protected Routes**
  Custom authentication middleware ensures data privacy and security.

* ⚡ **Modern UI**
  Fast and responsive frontend built using **React** and **Vite**.

* 🏗️ **Scalable Architecture**
  Clean separation using Controllers, Models, Routes, and Services.

---

## 🛠️ Tech Stack

### Frontend

* **Library:** React.js
* **Build Tool:** Vite
* **Styling:** CSS3
* **State Management:** Context API / Hooks

### Backend

* **Environment:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Security:** JSON Web Tokens (JWT)
* **AI Integration:** OpenAI / Gemini APIs

---

## 📁 Project Structure

### 🖥️ Backend

```
backend/
├── config/         # Database configuration
├── controllers/    # Business logic
├── middleware/     # Authentication middleware
├── models/         # Mongoose schemas
├── routes/         # API endpoints
├── services/       # External API integrations
├── server.js       # Entry point
└── .env            # Environment variables
```

### 🎨 Frontend

```
frontend/
├── src/
│   ├── assets/       # Static files
│   ├── components/   # Reusable UI components
│   ├── pages/        # Application pages
│   ├── App.jsx       # Main component
│   └── main.jsx      # Entry file
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js installed
* MongoDB Atlas account or local MongoDB
* AI API Key (OpenAI / Gemini)

---

### 1️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
AI_API_KEY=your_ai_key
```

Run the backend:

```bash
npm run dev
```

---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

🌐 Application runs at: **[http://localhost:5173](http://localhost:5173)**

---

## 📡 API Endpoints

| Method | Endpoint            | Description                   | Access  |
| ------ | ------------------- | ----------------------------- | ------- |
| POST   | /api/users/register | Register new user             | Public  |
| POST   | /api/users/login    | Login & get token             | Public  |
| GET    | /api/workouts       | Get all workouts              | Private |
| POST   | /api/workouts       | Add new workout               | Private |
| POST   | /api/ai/chat        | AI fitness assistant response | Private |

---

## 🤝 Contributing

Contributions are welcome and appreciated!

1. Fork the repository
2. Create a new branch (`feature/your-feature`)
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Shivam**
B.Tech CSE Student
SRM Institute of Science and Technology (Delhi NCR)

---

## ❤️ Acknowledgment

Built with passion to help people stay consistent and motivated in their fitness journey.
