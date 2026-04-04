import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminDashboard(){
  const navigate = useNavigate();
  const [users,setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminInfo,setAdminInfo] = useState(null);

  useEffect(()=>{
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if(storedUser && storedUser !== "undefined" && token){
      const parsedUser = JSON.parse(storedUser);

      if(parsedUser.role !=='admin'){
        navigate('/dashboard');
      } else{
        setAdminInfo(parsedUser);
        fetchAllUsers(token);
      }
    } else {
      navigate('/Login');
    }
  },[navigate]);

  const fetchAllUsers = async (token) =>{
    try{
      const response = await fetch('http://localhost:5000/api/users',{
        headers:{'Authorization':`Bearer ${token}`}
      });

      const data =await response.json();
      if(response.ok){
        setUsers(data);
      }
    } catch (error){
      console.error("Error fetching users:",error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateFee =async (userId)=>{
    const token =localStorage.getItem('token');
    try{
      const response =await fetch(`http://localhost:5000/api/users/${userId}/fee`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if(response.ok){
      toast.success("Fee status updated successfully!!");
        fetchAllUsers(token);
      } else {
        toast.error("Failed to update fee");
      }
    } catch (error){
      console.error("Error updating fee : ",error);
    }
  };
  const handleDeleteUser = async (userId) => {
    if (window.confirm("WARNING: This will permanently delete this user. Are you sure?")) {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          alert("User deleted permanently.");
          fetchAllUsers(token); 
        } else {
          alert("Failed to delete user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleLogout =()=>{
    localStorage.clear();
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

  return (
      <div className="row mt-4">
      <div className="col-12">
        
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h2 className="mb-1">👑 Admin Control Panel</h2>
            {adminInfo && (
              <span className="badge bg-secondary fs-6 mt-1">
                Admin: {adminInfo.name} ({adminInfo.email})
              </span>
            )}
          </div>
          <button onClick={handleLogout} className="btn btn-outline-danger btn-sm mt-1">
            Logout
          </button>
        </div>

        <div className="card shadow-sm">
          <div className="card-header bg-dark text-white fw-bold">
            All Registered Users
          </div>
          <div className="card-body p-0">
            <table className="table table-hover table-striped mb-0">
              <thead className="table-secondary">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Fee Valid Until</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter((u) => u.role !== 'admin')
                  .map((u) => (
                  <tr key={u._id}>
                    <td className="fw-bold">{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className="badge bg-primary">
                        {u.role}
                      </span>
                    </td>
                    <td>
                      {u.feeValidUntil 
                        ? new Date(u.feeValidUntil).toLocaleDateString() 
                        : <span className="text-danger fw-bold">Not Paid</span>
                      }
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button 
                          onClick={() => handleUpdateFee(u._id)} 
                          className="btn btn-success btn-sm fw-bold"
                        >
                          Extend 1 Month
                        </button>
                        
                        <button 
                          onClick={() => handleDeleteUser(u._id)} 
                          className="btn btn-danger btn-sm fw-bold"
                        >
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
    </div>
    );
}