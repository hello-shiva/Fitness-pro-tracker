import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== "undefined" && token) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'admin') {
        navigate('/dashboard');
      } else {
        setAdminInfo(parsedUser);
        fetchAllUsers(token);
      }
    } else {
      navigate('/Login');
    }
  }, [navigate, token]);

  const fetchAllUsers = async (activeToken) => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      const data = await response.json();
      if (response.ok) setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/update-role', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, newRole })
      });
      if (res.ok) {
        toast.success(`Role updated to ${newRole}!`);
        fetchAllUsers(token); // Refresh list
      } else {
        toast.error("Failed to update role");
      }
    } catch (error) {
      toast.error("Error updating role");
    }
  };

  const handleAssignPT = async (userId, trainerId) => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/assign-trainer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, trainerId: trainerId || null }) // null to unassign
      });
      if (res.ok) {
        toast.success("Trainer relationship updated!");
        fetchAllUsers(token);
      } else {
        toast.error("Failed to update trainer assignment");
      }
    } catch (error) {
      toast.error("Error assigning PT");
    }
  };

  const handleSpecializationUpdate = async (userId, spec) => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/update-specialization', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, specialization: spec })
      });
      if (res.ok) {
        toast.success("Specialization updated!");
        await fetchAllUsers(token); // To refresh specialized data structure in state if needed
      } else {
        toast.error("Failed to update specialization");
      }
    } catch (error) {
      toast.error("Failed to update specialization");
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to permanently delete ${userName}? This will remove them from all trainer's clients lists.`)) {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          toast.success(`${userName} deleted successfully!`);
          fetchAllUsers(token); // List refresh karein
        } else {
          toast.error("Failed to delete user");
        }
      } catch (error) {
        toast.error("Server error while deleting");
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Divide users into categories for clean display
  const normalUsers = users.filter(u => u.role === 'user');
  const gymTrainers = users.filter(u => u.role === 'trainer');

  if (isLoading) {
    return <div style={{ color: 'var(--text-main)', textAlign: 'center', marginTop: '100px' }}>Loading Command Center...</div>;
  }

  return (
    <div className="gym-app-wrapper" style={{ padding: '20px' }}>
      
      {/* 🟢 TOP HEADER */}
      <header className="dashboard-header" style={{ maxWidth: '1200px', margin: '0 auto 30px auto', width: '100%' }}>
        <h1 className="welcome-text">👑 Admin Command Center</h1>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </header>

      {/* 🟢 MAIN CONTENT AREA */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
        
        {/* --- 1. USER MANAGEMENT CARD --- */}
        <div className="gym-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ border: 'none', margin: 0 }}>Active Gym Users</h3>
            <span style={{ backgroundColor: 'var(--accent-color)', color: '#000', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold' }}>
              {normalUsers.length} Users
            </span>
          </div>
          
          <table className="table text-center align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Fee Status</th>
                <th>Change Role</th>
                <th>Assign Trainer (PT)</th>
                <th>Action</th> {/* Deleted Column */}
              </tr>
            </thead>
            <tbody>
              {normalUsers.map((u) => (
                <tr key={u._id}>
                  <td style={{ fontWeight: 'bold' }}>{u.name}</td>
                  <td>
                    {u.feeValidUntil ? (
                      <span style={{ color: 'var(--accent-color)' }}>{new Date(u.feeValidUntil).toLocaleDateString()}</span>
                    ) : (
                      <span style={{ color: '#ff4d4d' }}>Not Paid</span>
                    )}
                  </td>
                  <td>
                    <select className="gym-input form-select-sm mx-auto" style={{width: '130px'}} 
                      onChange={(e) => handleRoleChange(u._id, e.target.value)} value={u.role}>
                      <option value="user">User</option>
                      <option value="trainer">Make Trainer</option>
                    </select>
                  </td>
                  <td>
                    <select 
                      className="gym-input form-select-sm mx-auto" style={{width: '160px', borderColor: 'var(--accent-color)'}}
                      value={u.assignedTrainer || ""}
                      onChange={(e) => handleAssignPT(u._id, e.target.value)}
                    >
                      <option value="">No Trainer</option>
                      {gymTrainers.map(t => (
                        <option key={t._id} value={t._id}>{t.name}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    {/* 🔴 Naya: Delete Button for User */}
                    <button className="btn-logout" style={{ padding: '5px 10px', fontSize: '0.8rem' }} onClick={() => handleDeleteUser(u._id, u.name)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- 2. TRAINER MANAGEMENT CARD --- */}
        <div className="gym-card">
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ border: 'none', margin: 0 }}>Gym Trainers Team</h3>
            <span style={{ backgroundColor: 'var(--success-color, #4cd137)', color: '#000', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold' }}>
              {gymTrainers.length} Trainers
            </span>
          </div>
          
          <table className="table text-center align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Specialization (Edit)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {gymTrainers.map((t) => (
                <tr key={t._id}>
                  <td style={{ fontWeight: 'bold' }}>{t.name}</td>
                  
                  {/* 🟢 FIX 1: Email ka text-muted color hata diya, ab ye clear dikhega */}
                  <td style={{ fontWeight: '500', color: '#333' }}>{t.email}</td>
                  
                  <td>
                    {/* 🟢 FIX 2: key={t.specialization} add kiya. Isse jaise hi backend update hoga, ye input box automatically naya data show karega */}
                    <input 
                      key={t.specialization || 'empty'}
                      type="text" 
                      className="gym-input form-control-sm mx-auto text-center" 
                      style={{width: '180px', borderColor: '#4cd137'}}
                      placeholder="e.g. Yoga Coach"
                      defaultValue={t.specialization || ""}
                      onBlur={(e) => handleSpecializationUpdate(t._id, e.target.value)}
                    />
                  </td>
                  <td style={{display: 'flex', gap: '5px', justifyContent: 'center'}}>
                    <button className="btn-logout" style={{ padding: '5px 10px', fontSize: '0.8rem', borderColor: '#e1b12c', color: '#e1b12c' }} onClick={() => handleRoleChange(t._id, 'user')}>
                      Demote
                    </button>
                    <button className="btn-logout" style={{ padding: '5px 10px', fontSize: '0.8rem' }} onClick={() => handleDeleteUser(t._id, t.name)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}