import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Chatbot from '../components/Chatbot';
import WorkoutsChart from '../components/WorkoutChart';
import toast from 'react-hot-toast';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [workouts, setWorkouts] = useState([]);
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [exerciseName, setExerciseName] = useState('');
  const [durationInMinutes, setDurationInMinutes] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const [chartData, setChartData] = useState([]); 
  const [activeTab, setActiveTab] = useState('logWorkout'); 

  const fetchStats = async (token) => {
    try {
      const res = await fetch('http://localhost:5000/api/workouts/stats', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setChartData(data);
    } catch (error) { console.error("Failed to fetch stats: ", error); }
  };

  const fetchWorkouts = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/workouts', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await response.json();
      if (response.ok) setWorkouts(data);
    } catch (error) { console.error("Failed to fetch workouts: ", error); }
  };

  // 🟢 SMART AUTO-SYNC LOGIC (Ye galti se reh gaya tha)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedUser && storedUser !== "undefined" && token) {
      setUser(JSON.parse(storedUser)); 
      
      const fetchFreshProfile = async () => {
        try {
          const res = await fetch('http://localhost:5000/api/users/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const freshData = await res.json();
          if (res.ok) {
            localStorage.setItem('user', JSON.stringify(freshData));
            // 🟢 MAGIC REDIRECT: Agar Admin ne Trainer bana diya hai, toh turant Trainer page par bhejo!
            if (freshData.role === 'trainer') {
               navigate('/trainer-dashboard');
            } else {
               setUser(freshData); // Agar normal user hai, toh Fees UI update kardo
            }
          }
        } catch (error) { console.error("Sync failed", error); }
      };

      fetchFreshProfile();
      fetchWorkouts(token);
      fetchStats(token); 
    } else {
      navigate('/login');
    }
    setIsLoading(false);
  }, [navigate]);

  const handleLogWorkout = async (e) => {
    e.preventDefault();
    setIsLogging(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ dayOfWeek, exerciseName, durationInMinutes: Number(durationInMinutes) })
      });
      if (response.ok) {
        toast.success("Workout saved!");
        fetchWorkouts(token);
        fetchStats(token);
        setExerciseName('');
        setDurationInMinutes('');
      }
    } catch (error) { console.error(error); } finally { setIsLogging(false); }
  };

  const handleDeleteWorkout = async (id) => {
    if (window.confirm("Are you sure you want to delete this workout?")) {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:5000/api/workouts/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          toast.success("Workout deleted!");
          fetchWorkouts(token);
          fetchStats(token);
        }
      } catch (error) { console.error(error); }
    }
  };

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
          <h1 className="welcome-text mb-0">WELCOME BACK, {user.name.toUpperCase()}! 🏋️‍♂️</h1>
        </div>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </header>

      {/* MEMBERSHIP STATUS BANNER */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 20px auto', backgroundColor: '#1e1e1e', padding: '15px 20px', borderRadius: '8px', borderLeft: '5px solid var(--accent-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h4 style={{ margin: 0, color: 'white', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px' }}>MEMBERSHIP STATUS</h4>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Track your gym subscription</p>
        </div>
        <div>
           {user.feeValidUntil && new Date(user.feeValidUntil) > new Date() ? (
             <span style={{ backgroundColor: 'rgba(57, 255, 20, 0.1)', color: 'var(--accent-color)', padding: '8px 15px', borderRadius: '5px', fontWeight: 'bold', border: '1px solid var(--accent-color)' }}>
               Valid until: {new Date(user.feeValidUntil).toLocaleDateString()}
             </span>
           ) : (
             <span style={{ backgroundColor: 'rgba(255, 77, 77, 0.1)', color: '#ff4d4d', padding: '8px 15px', borderRadius: '5px', fontWeight: 'bold', border: '1px solid #ff4d4d' }}>
               Payment Pending / Expired
             </span>
           )}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto 30px auto', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <button className="btn-save" style={{ backgroundColor: activeTab === 'logWorkout' ? 'var(--accent-color)' : '#2a2a2a', color: activeTab === 'logWorkout' ? '#000' : 'white', width: 'auto', padding: '10px 20px' }} onClick={() => setActiveTab('logWorkout')}>📝 LOG & HISTORY</button>
        <button className="btn-save" style={{ backgroundColor: activeTab === 'progress' ? 'var(--accent-color)' : '#2a2a2a', color: activeTab === 'progress' ? '#000' : 'white', width: 'auto', padding: '10px 20px' }} onClick={() => setActiveTab('progress')}>📊 MY PROGRESS</button>
        <button className="btn-save" style={{ backgroundColor: activeTab === 'ai' ? 'var(--accent-color)' : '#2a2a2a', color: activeTab === 'ai' ? '#000' : 'white', width: 'auto', padding: '10px 20px' }} onClick={() => setActiveTab('ai')}>🤖 AI FITNESS COACH</button>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {activeTab === 'logWorkout' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
            <div className="gym-card">
              <h3>LOG YOUR WORKOUT</h3>
              <form onSubmit={handleLogWorkout}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Day</label>
                    <select className="gym-input" value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)}>
                      <option>Monday</option><option>Tuesday</option><option>Wednesday</option>
                      <option>Thursday</option><option>Friday</option><option>Saturday</option><option>Sunday</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Exercise Name</label>
                    <input type="text" className="gym-input" required placeholder="e.g. Bench Press" value={exerciseName} onChange={(e) => setExerciseName(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Duration (mins)</label>
                    <input type="number" className="gym-input" required min="1" value={durationInMinutes} onChange={(e) => setDurationInMinutes(e.target.value)} />
                  </div>
                </div>
                <button type="submit" className="btn-save" disabled={isLogging}>{isLogging ? 'Logging...' : 'SAVE WORKOUT'}</button>
              </form>
            </div>
            <div className="gym-card">
              <h3>YOUR TRAINING HISTORY</h3>
              {workouts.length === 0 ? <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>No workouts logged yet. Put in some work!</p> : (
                <table className="table text-center align-middle">
                  <thead><tr><th>Day</th><th>Exercise</th><th>Duration</th><th>Calories Burned</th><th>Action</th></tr></thead>
                  <tbody>
                    {workouts.map((w) => (
                      <tr key={w._id}>
                        <td style={{ fontWeight: 'bold' }}>{w.dayOfWeek}</td>
                        <td>{w.exerciseName}</td>
                        <td>{w.durationInMinutes}m</td>
                        <td style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>{w.caloriesBurned} kcal</td>
                        <td><button onClick={() => handleDeleteWorkout(w._id)} className="btn-logout" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
        {activeTab === 'progress' && (<div className="gym-card"><h3>MY WEEKLY PERFORMANCE STATS</h3><WorkoutsChart data={chartData} /></div>)}
        {activeTab === 'ai' && (<Chatbot />)}
      </div>
    </div>
  );
}