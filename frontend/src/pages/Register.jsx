import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));

      navigate('/dashboard');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="gym-app-wrapper" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="gym-card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        
        {/* 🟢 Naya Logo Yahan Add Kiya Hai */}
        <img src="/fitness-app.png" alt="Fitness Pro Logo" style={{ width: '80px', marginBottom: '15px', filter: 'drop-shadow(0 0 10px var(--accent-color))' }} />
        
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '2px', color: 'white', marginBottom: '25px' }}>JOIN FITNESS PRO</h2>
        
        {error && <div style={{ backgroundColor: 'rgba(255, 77, 77, 0.1)', color: '#ff4d4d', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontWeight: 'bold' }}>{error}</div>}

        <form onSubmit={handleRegister}>
          <div style={{ textAlign: 'left', marginBottom: '15px' }}>
            <label style={{ color: 'var(--text-muted)', fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Full Name</label>
            <input 
              type="text" 
              className="gym-input" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
          <div style={{ textAlign: 'left', marginBottom: '15px' }}>
            <label style={{ color: 'var(--text-muted)', fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Email Address</label>
            <input 
              type="email" 
              className="gym-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div style={{ textAlign: 'left', marginBottom: '25px' }}>
            <label style={{ color: 'var(--text-muted)', fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Password</label>
            <input 
              type="password" 
              className="gym-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              minLength="6"
            />
          </div>
          <button type="submit" className="btn-save" style={{ width: '100%' }} disabled={isLoading}>
            {isLoading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
          </button>
        </form>

        <div style={{ marginTop: '20px', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: 'bold' }}>Log In</Link>
        </div>
      </div>
    </div>
  );
}