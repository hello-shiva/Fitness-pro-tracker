import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Chatbot from '../components/Chatbot';
import WorkoutsChart from '../components/WorkoutChart'; // Component import kiya

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
  const [activeTab, setActiveTab] = useState('overview');

  const fetchStats = async (token) => {
    try {
      const res = await fetch('http://localhost:5000/api/workouts/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setChartData(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats: ", error);
    }
  };

  const fetchWorkouts = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/workouts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setWorkouts(data);
      }
    } catch (error) {
      console.error("Failed to fetch workouts: ", error);
    }
  };

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (storedUser && storedUser !== "undefined" && token) {
        setUser(JSON.parse(storedUser));
        fetchWorkouts(token);
        fetchStats(token); // 2. Yahan data mangwana start kiya!
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error("Error reading local storage:", error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleLogWorkout = async (e) => {
    e.preventDefault();
    setIsLogging(true);
    const token = localStorage.getItem('token');

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
        fetchWorkouts(token);
        fetchStats(token);
        setExerciseName('');
        setDurationInMinutes('');
      }
    } catch (error) {
      console.error("Error logging workout:", error);
    } finally {
      setIsLogging(false);
    }
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
          fetchWorkouts(token);
          fetchStats(token);
        }
      } catch (error) {
        console.error("Error deleting workout:", error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (!user) return null;

  return (
    <div className="container-fluid pt-3 vh-100 d-flex flex-column overflow-hidden">
      <div className="d-flex justify-content-between align-items-center mb-3 bg-dark text-white p-3 rounded shadow-sm">
        <h3 className="mb-0">Welcome back, {user.name}! 🏋️‍♂️</h3>
        <button onClick={handleLogout} className="btn btn-outline-light btn-sm fw-bold">
          Logout
        </button>
      </div>
      <ul className="nav nav-pills nav-fill mb-3 p-2 bg-white rounded shadow-sm border">
        <li className="nav-item">
          <button 
            className={`nav-link fw-bold ${activeTab === 'overview' ? 'active bg-primary' : 'text-dark'}`} 
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link fw-bold ${activeTab === 'workouts' ? 'active bg-success' : 'text-dark'}`} 
            onClick={() => setActiveTab('workouts')}
          >
            📝 Log & History
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link fw-bold ${activeTab === 'ai' ? 'active bg-dark' : 'text-dark'}`} 
            onClick={() => setActiveTab('ai')}
          >
            🤖 AI Fitness Coach
          </button>
        </li>
      </ul>
      <div className="tab-content flex-grow-1 overflow-auto pb-3">
        {activeTab === 'overview' && (
          <div className="row fade-in h-100">
            <div className="col-12">
              <WorkoutsChart data={chartData} />
            </div>
          </div>
        )}
        {activeTab === 'workouts' && (
          <div className="row fade-in">
            <div className="col-lg-4 mb-4">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-success text-white fw-bold">
                  Log a New Workout
                </div>
                <div className="card-body">
                  <form onSubmit={handleLogWorkout}>
                    <div className="mb-3">
                      <label className="form-label text-muted fw-bold">Day</label>
                      <select className="form-select" value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)}>
                        <option>Monday</option><option>Tuesday</option><option>Wednesday</option>
                        <option>Thursday</option><option>Friday</option><option>Saturday</option><option>Sunday</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-muted fw-bold">Exercise Name</label>
                      <input type="text" className="form-control" required placeholder="e.g. Running, Yoga" 
                        value={exerciseName} onChange={(e) => setExerciseName(e.target.value)} />
                    </div>
                    <div className="mb-4">
                      <label className="form-label text-muted fw-bold">Duration (mins)</label>
                      <input type="number" className="form-control" required min="1" 
                        value={durationInMinutes} onChange={(e) => setDurationInMinutes(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-success w-100 fw-bold" disabled={isLogging}>
                      {isLogging ? 'Calculating...' : 'Save Workout'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white fw-bold">Your History</div>
                <div className="card-body p-0" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {workouts.length === 0 ? (
                    <p className="text-center text-muted p-4 mb-0">No workouts logged yet. Get moving!</p>
                  ) : (
                    <table className="table table-hover mb-0 text-center align-middle">
                      <thead className="table-light sticky-top">
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
                            <td className="fw-bold">{workout.dayOfWeek}</td>
                            <td>{workout.exerciseName}</td>
                            <td>{workout.durationInMinutes}m</td>
                            <td className="text-danger fw-bold">{workout.caloriesBurned} kcal</td>
                            <td>
                              <button onClick={() => handleDeleteWorkout(workout._id)} className="btn btn-outline-danger btn-sm">
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
            </div>
          </div>
        )}
        {activeTab === 'ai' && (
          <div className="row fade-in justify-content-center h-100">
            <div className="col-lg-8 h-100">
              <div className="shadow-lg rounded h-100">
                <Chatbot />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}