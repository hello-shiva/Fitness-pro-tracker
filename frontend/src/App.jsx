import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { Toaster } from 'react-hot-toast';
import TrainerDashboard from './pages/TrainerDashboard';


function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <div className="gym-app-wrapper">
          <Toaster 
            position="top-center" 
            reverseOrder={false} 
            toastOptions={{
              style: {
                background: '#1e1e1e',
                color: '#ffffff',
                border: '1px solid #39FF14',
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
    </GoogleOAuthProvider>
  );
}

export default App;