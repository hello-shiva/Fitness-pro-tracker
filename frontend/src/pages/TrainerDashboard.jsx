import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Chatbot from '../components/Chatbot';
import WorkoutsChart from '../components/WorkoutChart';
import toast from 'react-hot-toast';

export default function TrainerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [activeTab, setActiveTab] = useState('clients'); 
  const [workouts, setWorkouts] = useState([]);

  const fetchMyClients = async (token) => {
    try {
      const res = await fetch('http://localhost:5000/api/workouts/my-clients', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setClients(data);
    } catch (error) { console.error(error); }
  };

  const fetchStats = async (token) => {
    try {
      const res = await fetch('http://localhost:5000/api/workouts/stats', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setChartData(data);
    } catch (error) { console.error(error); }
  };

  const fetchWorkouts = async (token) => {
    try {
      const res = await fetch('http://localhost:5000/api/workouts', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setWorkouts(data);
    } catch (error) { console.error(error); }
  };

  // 🟢 SMART AUTO-SYNC LOGIC
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedUser && storedUser !== "undefined" && token) {
      setUser(JSON.parse(storedUser)); 
      
      const fetchFreshProfile = async () => {
        try {
          const res = await fetch('http://localhost:5000/api/users/trainer', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const freshData = await res.json();
          if (res.ok) {
            localStorage.setItem('user', JSON.stringify(freshData));
            // Agar Admin ne ise demote karke wapas user bana diya, toh User page par bhejo
            if (freshData.role === 'user') {
               navigate('/dashboard');
            } else {
               setUser(freshData); // Salary aur Status automatic update hoga
            }
          }
        } catch (error) { console.error(error); }
      };

      fetchFreshProfile();
      fetchMyClients(token);
      fetchStats(token);
      fetchWorkouts(token);
    } else {
      navigate('/login');
    }
    setIsLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (isLoading || !user) return null;

  return (
    <div className="gym-app-wrapper" style={{ padding: '20px' }}>
      
      <header className="dashboard-header" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src="/fitness-app.png" alt="Gym Logo" style={{ width: '50px', height: '50px', filter: 'drop-shadow(0 0 5px var(--accent-color))' }} />
          <h1 className="welcome-text mb-0">COACH: {user.name.toUpperCase()} <span style={{ color: 'var(--accent-color)', fontSize: '1.5rem' }}>[ TRAINER ]</span></h1>
        </div>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </header>

      {/* 🟢 SALARY STATUS BANNER */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 20px auto', backgroundColor: '#1e1e1e', padding: '15px 20px', borderRadius: '8px', borderLeft: '5px solid #4cd137', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h4 style={{ margin: 0, color: 'white', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px' }}>MONTHLY PAYOUT</h4>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Your trainer salary details</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ backgroundColor: '#2a2a2a', border: '1px solid #444', color: 'white', padding: '8px 15px', borderRadius: '5px', fontWeight: 'bold' }}>
             Amount: ₹{user.salaryAmount || 0}
           </span>
           <span style={{ backgroundColor: user.salaryStatus === 'Paid' ? 'rgba(57, 255, 20, 0.1)' : 'rgba(255, 193, 7, 0.1)', color: user.salaryStatus === 'Paid' ? 'var(--accent-color)' : '#ffc107', padding: '8px 15px', borderRadius: '5px', fontWeight: 'bold', border: `1px solid ${user.salaryStatus === 'Paid' ? 'var(--accent-color)' : '#ffc107'}` }}>
             Status: {user.salaryStatus || 'Pending'}
           </span>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto 30px auto', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <button className="btn-save" style={{ backgroundColor: activeTab === 'clients' ? 'var(--accent-color)' : '#2a2a2a', color: activeTab === 'clients' ? '#000' : 'white', width: 'auto', padding: '10px 20px' }} onClick={() => setActiveTab('clients')}>👥 MY CLIENTS (PT)</button>
        <button className="btn-save" style={{ backgroundColor: activeTab === 'workouts' ? 'var(--accent-color)' : '#2a2a2a', color: activeTab === 'workouts' ? '#000' : 'white', width: 'auto', padding: '10px 20px' }} onClick={() => setActiveTab('workouts')}>📝 LOG & HISTORY</button>
        <button className="btn-save" style={{ backgroundColor: activeTab === 'overview' ? 'var(--accent-color)' : '#2a2a2a', color: activeTab === 'overview' ? '#000' : 'white', width: 'auto', padding: '10px 20px' }} onClick={() => setActiveTab('overview')}>📊 MY PROGRESS</button>
        <button className="btn-save" style={{ backgroundColor: activeTab === 'ai' ? 'var(--accent-color)' : '#2a2a2a', color: activeTab === 'ai' ? '#000' : 'white', width: 'auto', padding: '10px 20px' }} onClick={() => setActiveTab('ai')}>🤖 AI COACH</button>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {activeTab === 'clients' && (
          <div className="gym-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ border: 'none', margin: 0 }}>ASSIGNED PT CLIENTS</h3>
              <span style={{ backgroundColor: 'var(--accent-color)', color: '#000', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold' }}>{clients.length} Active</span>
            </div>
            {clients.length === 0 ? <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>No clients assigned yet.</p> : (
              <table className="table text-center">
                <thead><tr><th>Client Name</th><th>Email</th><th>Current Status</th></tr></thead>
                <tbody>
                  {clients.map(c => (
                    <tr key={c._id}>
                      <td style={{ fontWeight: 'bold' }}>{c.name}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{c.email}</td>
                      <td style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>In Training</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        
        {/* LOG HISTORY TAB FOR TRAINER */}
        {activeTab === 'workouts' && (
          <div className="gym-card">
            <h3>YOUR TRAINING HISTORY</h3>
            {workouts.length === 0 ? <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>No workouts logged yet. Put in some work!</p> : (
              <table className="table text-center align-middle">
                <thead><tr><th>Day</th><th>Exercise</th><th>Duration</th><th>Calories Burned</th></tr></thead>
                <tbody>
                  {workouts.map((w) => (
                    <tr key={w._id}>
                      <td style={{ fontWeight: 'bold' }}>{w.dayOfWeek}</td>
                      <td>{w.exerciseName}</td>
                      <td>{w.durationInMinutes}m</td>
                      <td style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>{w.caloriesBurned} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'overview' && (<div className="gym-card"><h3>PERSONAL PERFORMANCE STATS</h3><WorkoutsChart data={chartData} /></div>)}
        {activeTab === 'ai' && (<Chatbot />)}
      </div>
    </div>
  );
}