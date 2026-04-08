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
      navigate('/login');
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
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ userId, newRole })
      });
      if (res.ok) {
        toast.success(`Role updated to ${newRole}!`);
        fetchAllUsers(token);
      }
    } catch (error) { toast.error("Error updating role"); }
  };

  const handleAssignPT = async (userId, trainerId) => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/assign-trainer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ userId, trainerId: trainerId || null })
      });
      if (res.ok) {
        toast.success("Trainer relationship updated!");
        fetchAllUsers(token);
      }
    } catch (error) { toast.error("Error assigning PT"); }
  };

  const handleSpecializationUpdate = async (userId, spec) => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/update-specialization', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ userId, specialization: spec })
      });
      if (res.ok) {
        toast.success("Specialization updated!");
        fetchAllUsers(token);
      }
    } catch (error) { toast.error("Failed to update specialization"); }
  };

  // 🟢 FEES EXTEND FUNCTION
  const handleExtendFee = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}/fee`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Fee extended by 1 month!");
        fetchAllUsers(token);
      } else { toast.error("Failed to update fee."); }
    } catch (error) { toast.error("Server connection error"); }
  };

  // 🟢 SALARY UPDATE FUNCTION
  const handleSalaryUpdate = async (userId, salaryAmount, salaryStatus) => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/update-salary', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ userId, salaryAmount: Number(salaryAmount), salaryStatus })
      });
      if (res.ok) {
        toast.success("Trainer salary updated!");
        fetchAllUsers(token);
      } else { toast.error("Failed to update salary"); }
    } catch (error) { toast.error("Server connection error"); }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Permanently delete ${userName}?`)) {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          toast.success(`${userName} deleted!`);
          fetchAllUsers(token);
        }
      } catch (error) { toast.error("Server error"); }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const normalUsers = users.filter(u => u.role === 'user');
  const gymTrainers = users.filter(u => u.role === 'trainer');

  if (isLoading) return <div style={{ color: 'var(--text-main)', textAlign: 'center', marginTop: '100px' }}>Loading Command Center...</div>;

  return (
    <div className="gym-app-wrapper" style={{ padding: '20px' }}>
      
      <header className="dashboard-header" style={{ maxWidth: '1300px', margin: '0 auto 30px auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src="/fitness-app.png" alt="Gym Logo" style={{ width: '50px', height: '50px', filter: 'drop-shadow(0 0 5px var(--accent-color))' }} />
          <h1 className="welcome-text mb-0"> Admin Command Center</h1>
        </div>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </header>

      <div style={{ maxWidth: '1300px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
        
        {/* --- 1. USER MANAGEMENT CARD --- */}
        <div className="gym-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ border: 'none', margin: 0 }}>Active Gym Users</h3>
            <span style={{ backgroundColor: 'var(--accent-color)', color: '#000', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold' }}>{normalUsers.length} Users</span>
          </div>
          
          <table className="table text-center align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Fee Status</th>
                <th>Change Role</th>
                <th>Assign Trainer (PT)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {normalUsers.map((u) => (
                <tr key={u._id}>
                  <td style={{ fontWeight: 'bold' }}>{u.name}</td>
                  <td>
                    {u.feeValidUntil && new Date(u.feeValidUntil) > new Date() ? (
                      <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>{new Date(u.feeValidUntil).toLocaleDateString()}</span>
                    ) : (
                      <span style={{ color: '#ff4d4d', fontWeight: 'bold' }}>Not Paid</span>
                    )}
                  </td>
                  <td>
                    <select className="gym-input form-select-sm mx-auto" style={{width: '120px'}} onChange={(e) => handleRoleChange(u._id, e.target.value)} value={u.role}>
                      <option value="user">User</option>
                      <option value="trainer">Make Trainer</option>
                    </select>
                  </td>
                  <td>
                    <select className="gym-input form-select-sm mx-auto" style={{width: '140px', borderColor: 'var(--accent-color)'}} value={u.assignedTrainer || ""} onChange={(e) => handleAssignPT(u._id, e.target.value)}>
                      <option value="">No Trainer</option>
                      {gymTrainers.map(t => ( <option key={t._id} value={t._id}>{t.name}</option> ))}
                    </select>
                  </td>
                  <td style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button className="btn-save" style={{ padding: '5px 10px', fontSize: '0.8rem', width: 'auto' }} onClick={() => handleExtendFee(u._id)}>
                      +1 Month Fee
                    </button>
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
            <span style={{ backgroundColor: '#4cd137', color: '#000', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold' }}>{gymTrainers.length} Trainers</span>
          </div>
          
          <table className="table text-center align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialization</th>
                <th>Salary Status (₹)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {gymTrainers.map((t) => (
                <tr key={t._id}>
                  <td>
                    <div style={{ fontWeight: 'bold' }}>{t.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t.email}</div>
                  </td>
                  <td>
                    <input 
                      key={t.specialization || 'spec-empty'}
                      type="text" className="gym-input form-control-sm mx-auto text-center" style={{width: '150px'}}
                      placeholder="e.g. Yoga" defaultValue={t.specialization || ""}
                      onBlur={(e) => handleSpecializationUpdate(t._id, e.target.value)}
                    />
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', alignItems: 'center' }}>
                      <input 
                        key={`amt-${t.salaryAmount}`}
                        type="number" className="gym-input form-control-sm text-center" 
                        style={{width: '90px', borderColor: '#4cd137'}} placeholder="Amount" 
                        defaultValue={t.salaryAmount || 0}
                        onBlur={(e) => handleSalaryUpdate(t._id, e.target.value, t.salaryStatus)}
                      />
                      <select 
                        key={`stat-${t.salaryStatus}`}
                        className="gym-input form-select-sm" 
                        style={{width: '100px', borderColor: t.salaryStatus === 'Paid' ? '#4cd137' : '#ffc107', color: t.salaryStatus === 'Paid' ? '#4cd137' : '#ffc107', fontWeight: 'bold'}}
                        defaultValue={t.salaryStatus || 'Pending'}
                        onChange={(e) => handleSalaryUpdate(t._id, t.salaryAmount, e.target.value)}
                      >
                        <option value="Pending" style={{color: '#ffc107'}}>Pending</option>
                        <option value="Paid" style={{color: '#4cd137'}}>Paid</option>
                      </select>
                    </div>
                  </td>
                  <td>
                    <div style={{display: 'flex', gap: '5px', justifyContent: 'center'}}>
                      <button className="btn-logout" style={{ padding: '5px 10px', fontSize: '0.8rem', borderColor: '#e1b12c', color: '#e1b12c' }} onClick={() => handleRoleChange(t._id, 'user')}>
                        Demote
                      </button>
                      <button className="btn-logout" style={{ padding: '5px 10px', fontSize: '0.8rem' }} onClick={() => handleDeleteUser(t._id, t.name)}>
                        Delete
                      </button>
                    </div>
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