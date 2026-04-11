import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Chatbot from '../components/Chatbot';
import WorkoutsChart from '../components/WorkoutChart';
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  // 🟢 Admin Management States
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('management');

  // 🟢 Personal Fitness States
  const [workouts, setWorkouts] = useState([]);
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [exerciseName, setExerciseName] = useState('');
  const [durationInMinutes, setDurationInMinutes] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const [chartData, setChartData] = useState([]);

  const token = localStorage.getItem('token');

  // --- API FETCH FUNCTIONS ---
  const fetchAllUsers = async (activeToken) => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      const data = await response.json();
      if (response.ok) setUsers(data);
    } catch (error) { console.error("Error fetching users:", error); } 
    finally { setIsLoading(false); }
  };

  const fetchStats = async (activeToken) => {
    try {
      const res = await fetch('http://localhost:5000/api/workouts/stats', { headers: { 'Authorization': `Bearer ${activeToken}` } });
      const data = await res.json();
      if (res.ok) setChartData(data);
    } catch (error) { console.error("Failed to fetch stats: ", error); }
  };

  const fetchWorkouts = async (activeToken) => {
    try {
      const response = await fetch('http://localhost:5000/api/workouts', { headers: { 'Authorization': `Bearer ${activeToken}` } });
      const data = await response.json();
      if (response.ok) setWorkouts(data);
    } catch (error) { console.error("Failed to fetch workouts: ", error); }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== "undefined" && token) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'admin') {
        navigate('/dashboard');
      } else {
        setAdminInfo(parsedUser);
        fetchAllUsers(token);
        // 🟢 Fetch Admin's Personal Data
        fetchWorkouts(token);
        fetchStats(token);
      }
    } else {
      navigate('/login');
    }
  }, [navigate, token]);

  // --- ADMIN MANAGEMENT FUNCTIONS ---
  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/update-role', {
        method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ userId, newRole })
      });
      if (res.ok) { toast.success(`Role updated to ${newRole}!`); fetchAllUsers(token); }
    } catch (error) { toast.error("Error updating role"); }
  };

  const handleAssignPT = async (userId, trainerId) => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/assign-trainer', {
        method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ userId, trainerId: trainerId || null })
      });
      if (res.ok) { toast.success("Trainer assigned!"); fetchAllUsers(token); }
    } catch (error) { toast.error("Error assigning PT"); }
  };

  const handleSpecializationUpdate = async (userId, spec) => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/update-specialization', {
        method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ userId, specialization: spec })
      });
      if (res.ok) { toast.success("Specialization updated!"); fetchAllUsers(token); }
    } catch (error) { toast.error("Failed to update specialization"); }
  };

  const handleExtendFee = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}/fee`, {
        method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) { toast.success("Fee extended by 1 month!"); fetchAllUsers(token); } 
      else { toast.error(data.message || "Failed to update fee."); }
    } catch (error) { toast.error("Server connection error: " + error.message); }
  };

  const handleSalaryUpdate = async (userId, salaryAmount, salaryStatus) => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/update-salary', {
        method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ userId, salaryAmount: Number(salaryAmount), salaryStatus })
      });
      const data = await res.json();
      if (res.ok) { toast.success("Salary updated!"); fetchAllUsers(token); } 
      else { toast.error(data.message || "Failed to update salary"); }
    } catch (error) { toast.error("Server connection error: " + error.message); }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Permanently delete ${userName}?`)) {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
          method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) { toast.success(`${userName} deleted!`); fetchAllUsers(token); }
      } catch (error) { toast.error("Server error"); }
    }
  };

  // --- PERSONAL WORKOUT FUNCTIONS ---
  const handleLogWorkout = async (e) => {
    e.preventDefault();
    setIsLogging(true);
    try {
      const response = await fetch('http://localhost:5000/api/workouts', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ dayOfWeek, exerciseName, durationInMinutes: Number(durationInMinutes) })
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Workout saved!");
        fetchWorkouts(token);
        fetchStats(token);
        setExerciseName('');
        setDurationInMinutes('');
      } else {
        toast.error(data.message || 'Failed to save workout');
        console.error('Save error:', data);
      }
    } catch (error) { 
      toast.error('Network error: ' + error.message);
      console.error(error); 
    } finally { 
      setIsLogging(false); 
    }
  };

  const handleDeleteWorkout = async (id) => {
    if (window.confirm("Are you sure you want to delete this workout?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/workouts/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }});
        if (response.ok) { toast.success("Workout deleted!"); fetchWorkouts(token); fetchStats(token); }
      } catch (error) { console.error(error); }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const normalUsers = users.filter(u => u.role === 'user');
  const gymTrainers = users.filter(u => u.role === 'trainer');

  if (isLoading) return null;

  return (
    <div className="gym-app-wrapper" style={{ padding: '20px' }}>
      
      <header className="dashboard-header">
        <div className="header-brand">
          <img src="/fitness-app.png" alt="Gym Logo" className="header-logo" />
          <h1 className="header-title">ADMIN COMMAND CENTER</h1>
        </div>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </header>

      {/* 🟢 TABS NAVIGATION */}
      <div className="tab-nav">
        <button className={`tab-btn ${activeTab === 'management' ? 'tab-btn-active' : 'tab-btn-inactive'}`} onClick={() => setActiveTab('management')}>👑 MANAGE USERS</button>
        <button className={`tab-btn ${activeTab === 'logWorkout' ? 'tab-btn-active' : 'tab-btn-inactive'}`} onClick={() => setActiveTab('logWorkout')}>📝 MY WORKOUTS</button>
        <button className={`tab-btn ${activeTab === 'progress' ? 'tab-btn-active' : 'tab-btn-inactive'}`} onClick={() => setActiveTab('progress')}>📊 MY PROGRESS</button>
        <button className={`tab-btn ${activeTab === 'ai' ? 'tab-btn-active' : 'tab-btn-inactive'}`} onClick={() => setActiveTab('ai')}>🤖 AI COACH</button>
      </div>

      <div className="content-grid">
        
        {/* 🟢 TAB 1: ADMIN MANAGEMENT */}
        {activeTab === 'management' && (
          <>
            <div className="gym-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ border: 'none', margin: 0 }}>Active Gym Users</h3>
                <span className="status-badge status-badge-success">{normalUsers.length} Users</span>
              </div>
              <table className="table text-center align-middle">
                <thead><tr><th>Name</th><th>Fee Status</th><th>Change Role</th><th>Assign Trainer</th><th>Action</th></tr></thead>
                <tbody>
                  {normalUsers.map((u) => (
                    <tr key={u._id}>
                      <td style={{ fontWeight: 'bold' }}>{u.name}</td>
                      <td>
                        {u.feeValidUntil && new Date(u.feeValidUntil) > new Date() ? (
                          <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>{new Date(u.feeValidUntil).toLocaleDateString()}</span>
                        ) : ( <span style={{ color: '#ff4d4d', fontWeight: 'bold' }}>Not Paid</span> )}
                      </td>
                      <td>
                        <select className="gym-input form-select-sm mx-auto" style={{width: '120px'}} onChange={(e) => handleRoleChange(u._id, e.target.value)} value={u.role}>
                          <option value="user">User</option><option value="trainer">Make Trainer</option>
                        </select>
                      </td>
                      <td>
                        <select className="gym-input form-select-sm mx-auto" style={{width: '140px', borderColor: 'var(--accent-color)'}} value={u.assignedTrainer || ""} onChange={(e) => handleAssignPT(u._id, e.target.value)}>
                          <option value="">No Trainer</option>
                          {gymTrainers.map(t => ( <option key={t._id} value={t._id}>{t.name}</option> ))}
                        </select>
                      </td>
                      <td style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button className="btn-save" style={{ padding: '5px 10px', fontSize: '0.8rem', width: 'auto' }} onClick={() => handleExtendFee(u._id)}>+1 Month Fee</button>
                        <button className="btn-logout" style={{ padding: '5px 10px', fontSize: '0.8rem' }} onClick={() => handleDeleteUser(u._id, u.name)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="gym-card">
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ border: 'none', margin: 0 }}>Gym Trainers Team</h3>
                <span className="status-badge status-badge-success">{gymTrainers.length} Trainers</span>
              </div>
              <table className="table text-center align-middle">
                <thead><tr><th>Name</th><th>Specialization</th><th>Salary Status (₹)</th><th>Action</th></tr></thead>
                <tbody>
                  {gymTrainers.map((t) => (
                    <tr key={t._id}>
                      <td>
                        <div style={{ fontWeight: 'bold' }}>{t.name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t.email}</div>
                      </td>
                      <td>
                        <input type="text" className="gym-input form-control-sm mx-auto text-center" style={{width: '150px'}} placeholder="e.g. Yoga" defaultValue={t.specialization || ""} onBlur={(e) => handleSpecializationUpdate(t._id, e.target.value)} />
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', alignItems: 'center' }}>
                          <input type="number" className="gym-input form-control-sm text-center" style={{width: '90px', borderColor: '#4cd137'}} placeholder="Amount" defaultValue={t.salaryAmount || 0} onBlur={(e) => handleSalaryUpdate(t._id, e.target.value, t.salaryStatus)} />
                          <select className="gym-input form-select-sm" style={{width: '100px', borderColor: t.salaryStatus === 'Paid' ? '#4cd137' : '#ffc107', color: t.salaryStatus === 'Paid' ? '#4cd137' : '#ffc107', fontWeight: 'bold'}} defaultValue={t.salaryStatus || 'Pending'} onChange={(e) => handleSalaryUpdate(t._id, t.salaryAmount, e.target.value)}>
                            <option value="Pending" style={{color: '#ffc107'}}>Pending</option>
                            <option value="Paid" style={{color: '#4cd137'}}>Paid</option>
                          </select>
                        </div>
                      </td>
                      <td>
                        <div style={{display: 'flex', gap: '5px', justifyContent: 'center'}}>
                          <button className="btn-logout" style={{ padding: '5px 10px', fontSize: '0.8rem', borderColor: '#e1b12c', color: '#e1b12c' }} onClick={() => handleRoleChange(t._id, 'user')}>Demote</button>
                          <button className="btn-logout" style={{ padding: '5px 10px', fontSize: '0.8rem' }} onClick={() => handleDeleteUser(t._id, t.name)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* 🟢 TAB 2: LOG WORKOUTS */}
        {activeTab === 'logWorkout' && (
          <>
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
                <button type="submit" className="btn-save" disabled={isLogging} style={{ width: '100%', marginTop: '10px' }}>
                  {isLogging ? 'Logging...' : 'SAVE WORKOUT'}
                </button>
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
                        <td className="text-calories">{w.caloriesBurned} kcal</td>
                        <td><button onClick={() => handleDeleteWorkout(w._id)} className="btn-logout" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* 🟢 TAB 3: PROGRESS */}
        {activeTab === 'progress' && (<div className="gym-card"><h3>MY WEEKLY PERFORMANCE STATS</h3><WorkoutsChart data={chartData} /></div>)}
        
        {/* 🟢 TAB 4: AI COACH */}
        {activeTab === 'ai' && (<Chatbot />)}
      </div>
    </div>
  );
}