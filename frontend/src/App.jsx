import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { Toaster } from 'react-hot-toast';
import TrainerDashboard from './pages/TrainerDashboard';
// import './index.css';

function App() {
  return (
    <Router>
      <div className="gym-app-wrapper">
        <Toaster 
          position="top-center" 
          reverseOrder={false} 
          toastOptions={{
            style: {
              background: '#1e1e1e', // Dark panel background
              color: '#ffffff',      // White text
              border: '1px solid #39FF14', // Neon accent border (change if you picked orange/blue)
              fontFamily: "'Montserrat', sans-serif"
            },
          }}
        />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            
            <Route path="/login" element={<Login />} />
            <Route path='/register' element={<Register/>}/>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;