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
  
  // 🟢 Naye States Workout ke liye
  const [workouts, setWorkouts] = useState([]);
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [exerciseName, setExerciseName] = useState('');
  const [durationInMinutes, setDurationInMinutes] = useState('');
  const [isLogging, setIsLogging] = useState(false);

  const [activeTab, setActiveTab] = useState('clients'); 

  const getFreshToken = () => localStorage.getItem('token');

  // --- API FETCH FUNCTIONS ---
  const fetchMyClients = async () => {
    const token = getFreshToken();
    try {
      const res = await fetch('http://localhost:5000/api/workouts/my-clients', {
      headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setClients(data);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    }
  };

  const fetchStats = async () => {
    const token = getFreshToken();
    try {
      const res = await fetch('http://localhost:5000/api/workouts/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setChartData(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const fetchWorkouts = async () => {
    const token = getFreshToken();
    try {
      const response = await fetch('http://localhost:5000/api/workouts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setWorkouts(data);
    } catch (error) {
      console.error("Failed to fetch workouts: ", error);
    }
  };

  // --- WORKOUT LOGIC ---
  const handleLogWorkout = async (e) => {
    e.preventDefault();
    setIsLogging(true);
    const token = getFreshToken();

    try {
      const response = await fetch('http://localhost:5000/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ dayOfWeek, exerciseName, durationInMinutes: Number(durationInMinutes) })
      });

      if (response.ok) {
        toast.success("Workout saved successfully!");
        fetchWorkouts();
        fetchStats();
        setExerciseName('');
        setDurationInMinutes('');
      } else {
        toast.error("Failed to save workout.");
      }
    } catch (error) {
      console.error("Error logging workout:", error);
      toast.error("Error connecting to server.");
    } finally {
      setIsLogging(false);
    }
  };

  const handleDeleteWorkout = async (id) => {
    if (window.confirm("Delete this workout log?")) {
      const token = getFreshToken();
      try {
        const response = await fetch(`http://localhost:5000/api/workouts/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          toast.success("Workout deleted!");
          fetchWorkouts();
          fetchStats();
        }
      } catch (error) {
        console.error("Error deleting workout:", error);
      }
    }
  };

  useEffect(() => {
    const token = getFreshToken();
    const storedUser = localStorage.getItem('user');
    
    if (storedUser && storedUser !== "undefined" && token) {
      const parsedUser = JSON.parse(storedUser);
      
      if (parsedUser.role !== 'trainer') {
        toast.error("Access Denied: Trainers Only!");
        navigate('/dashboard');
      } else {
        setUser(parsedUser);
        fetchMyClients();
        fetchStats();
        fetchWorkouts(); // 🟢 Trainer ke workouts fetch karein
      }
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
      
      {/* 🟢 TOP HEADER */}
      <header className="dashboard-header" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <h1 className="welcome-text">
          Coach: {user.name} <span style={{ color: 'var(--accent-color)', fontSize: '1.5rem' }}>[ TRAINER ]</span>
        </h1>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </header>

      {/* 🟢 NAVIGATION TABS */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 30px auto', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <button 
          className="btn-save" 
          style={{ backgroundColor: activeTab === 'clients' ? 'var(--accent-color)' : '#2a2a2a', color: activeTab === 'clients' ? '#000' : 'white', width: 'auto' }}
          onClick={() => setActiveTab('clients')}>👥 My Clients (PT)
        </button>
        <button 
          className="btn-save" 
          style={{ backgroundColor: activeTab === 'workouts' ? 'var(--accent-color)' : '#2a2a2a', color: activeTab === 'workouts' ? '#000' : 'white', width: 'auto' }}
          onClick={() => setActiveTab('workouts')}>📝 Log & History
        </button>
        <button 
          className="btn-save" 
          style={{ backgroundColor: activeTab === 'overview' ? 'var(--accent-color)' : '#2a2a2a', color: activeTab === 'overview' ? '#000' : 'white', width: 'auto' }}
          onClick={() => setActiveTab('overview')}>📊 My Progress
        </button>
        <button 
          className="btn-save" 
          style={{ backgroundColor: activeTab === 'ai' ? 'var(--accent-color)' : '#2a2a2a', color: activeTab === 'ai' ? '#000' : 'white', width: 'auto' }}
          onClick={() => setActiveTab('ai')}>🤖 AI Coach
        </button>
      </div>

      {/* 🟢 MAIN CONTENT AREA */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        
        {/* TAB 1: CLIENTS */}
        {activeTab === 'clients' && (
          <div className="gym-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ border: 'none', margin: 0 }}>Assigned PT Clients</h3>
              <span style={{ backgroundColor: 'var(--accent-color)', color: '#000', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold' }}>
                {clients.length} Active
              </span>
            </div>
            
            {clients.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>No clients assigned yet. Ask Admin to link users.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Client Name</th>
                    <th>Email</th>
                    <th>Current Status</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map(client => (
                    <tr key={client._id}>
                      <td style={{ fontWeight: 'bold' }}>{client.name}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{client.email}</td>
                      <td style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>In Training</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* 🟢 TAB 2: WORKOUTS LOG & HISTORY (Naya Section) */}
        {activeTab === 'workouts' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
            
            {/* Form Card */}
            <div className="gym-card">
              <h3>Log Your Workout</h3>
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
                    <input type="text" className="gym-input" required placeholder="e.g. Bench Press" 
                      value={exerciseName} onChange={(e) => setExerciseName(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Duration (mins)</label>
                    <input type="number" className="gym-input" required min="1" 
                      value={durationInMinutes} onChange={(e) => setDurationInMinutes(e.target.value)} />
                  </div>
                </div>
                <button type="submit" className="btn-save" disabled={isLogging}>
                  {isLogging ? 'Logging...' : 'Save Workout'}
                </button>
              </form>
            </div>

            {/* History Table Card */}
            <div className="gym-card">
              <h3>Your Training History</h3>
              {workouts.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>No workouts logged yet. Set an example for your clients!</p>
              ) : (
                <table className="table text-center align-middle">
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Exercise</th>
                      <th>Duration</th>
                      <th>Calories</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workouts.map((workout) => (
                      <tr key={workout._id}>
                        <td style={{ fontWeight: 'bold' }}>{workout.dayOfWeek}</td>
                        <td>{workout.exerciseName}</td>
                        <td>{workout.durationInMinutes}m</td>
                        <td style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>{workout.caloriesBurned} kcal</td>
                        <td>
                          <button onClick={() => handleDeleteWorkout(workout._id)} className="btn-logout" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: CHART */}
        {activeTab === 'overview' && (
          <div className="gym-card">
             <h3>Personal Performance Stats</h3>
             <WorkoutsChart data={chartData} />
          </div>
        )}

        {/* TAB 4: AI COACH */}
        {activeTab === 'ai' && (
           <Chatbot />
        )}

      </div>
    </div>
  );
}