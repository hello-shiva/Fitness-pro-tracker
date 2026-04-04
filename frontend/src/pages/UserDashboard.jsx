import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Chatbot from '../components/Chatbot';

export default function UserDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [workouts,setWorkouts] = useState([]);
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [exerciseName, setExerciseName] = useState('');
  const [durationInMinutes, setDurationInMinutes] = useState('');
  const [isLogging, setIsLogging] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const token =localStorage.getItem('token');
      if (storedUser && storedUser !== "undefined" &&token) {
        setUser(JSON.parse(storedUser));
        fetchWorkouts(token);
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

  const fetchWorkouts = async (token) =>{
    try{
      const response = await fetch('http://localhost:5000/api/workouts',{
        headers: {'Authorization': `Bearer ${token}`}
      });
      const data = await response.json();
      if(response.ok){
          setWorkouts(data);
      }
    } catch (error){
      console.error("Failed to fetch workouts: ",error);
    }
  };
  const handleLogWorkout =async(e)=>{
    e.preventDefault();
    setIsLogging(true);
    const token =localStorage.getItem('token');

    try{
      const response =await fetch('http://localhost:5000/api/workouts', {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body:JSON.stringify({dayOfWeek,exerciseName, durationInMinutes : Number(durationInMinutes)})
      });

      if(response.ok){
        fetchWorkouts(token);
        setExerciseName('');
        setDurationInMinutes('');
      }
    } catch (error){
      console.error("Error logging workout:",error);
    } finally{
      setIsLogging(false);
    }
  };
  const handleDeleteWorkout = async(id)=>{
    if(window.confirm("Are you sure you want to delete this workout?")){
      const token = localStorage.getItem('token');
      try{
        const response = await fetch(`http://localhost:5000/api/workouts/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if(response.ok){
          fetchWorkouts(token);
        }
      } catch(error){
        console.error("Error deleting workout:",error);
        
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
    <div className="row mt-4">
      <div className="col-md-8">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Welcome back, {user.name}! 🏋️‍♂️</h2>
          <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">Logout</button>
        </div>
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-success text-white fw-bold">Log a New Workout</div>
          <div className="card-body">
            <form onSubmit={handleLogWorkout} className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Day</label>
                <select className="form-select" value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)}>
                  <option>Monday</option><option>Tuesday</option><option>Wednesday</option>
                  <option>Thursday</option><option>Friday</option><option>Saturday</option><option>Sunday</option>
                </select>
              </div>
              <div className="col-md-5">
                <label className="form-label">Exercise Name</label>
                <input type="text" className="form-control" required placeholder="e.g. Running, Yoga" 
                  value={exerciseName} onChange={(e) => setExerciseName(e.target.value)} />
              </div>
              <div className="col-md-3">
                <label className="form-label">Duration (mins)</label>
                <input type="number" className="form-control" required min="1" 
                  value={durationInMinutes} onChange={(e) => setDurationInMinutes(e.target.value)} />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-success w-100" disabled={isLogging}>
                  {isLogging ? 'AI is Calculating Calories...' : 'Save Workout'}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white fw-bold">Your History</div>
          <div className="card-body p-0">
            {workouts.length === 0 ? (
              <p className="text-center text-muted p-4 mb-0">No workouts logged yet. Get moving!</p>
            ) : (
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Day</th>
                    <th>Exercise</th>
                    <th>Duration</th>
                    <th>AI Est. Calories</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {workouts.map((workout) => (
                    <tr key={workout._id}>
                      <td>{workout.dayOfWeek}</td>
                      <td>{workout.exerciseName}</td>
                      <td>{workout.durationInMinutes} mins</td>
                      <td className="text-danger fw-bold">{workout.caloriesBurned} kcal</td>
                      <td>
                        <button 
                          onClick={() => handleDeleteWorkout(workout._id)} 
                          className="btn btn-outline-danger btn-sm"
                        >
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
      <div className="col-md-4">
        <Chatbot />
      </div>
    </div>
  );
}