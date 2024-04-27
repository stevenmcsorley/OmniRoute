import React, { useEffect, useState } from 'react';

interface User {
  Id: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Type: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://backend.localhost/api/admin/users?companyId=2');
      if (!response.ok) {
        throw new Error('Problem fetching users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (user: Omit<User, 'id'>) => {
    // Implement form submission logic here
  };

  const updateUser = async (id: number, user: Omit<User, 'id'>) => {
    // Implement user update logic here
  };

  const deleteUser = async (id: number) => {
    // Implement user deletion logic here
  };

  return (
    <div>
      <h1>Users</h1>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div>
          {users.map((user, index) => {
            // Fallback key using the index if id is not available, which is not recommended as a permanent solution.
            const keyId = user.Id || index;
            
            return (
              <div key={`${user.Type}-${keyId}`}>
                <br />
                <p>{user.Type}</p>
                <div>{user.Type === "Worker" ? user.FirstName : `${user.FirstName} ${user.LastName}`}</div>
                <div>Email: {user.Email || "N/A"}</div>
                <div>Phone: {user.Phone}</div>
                {/* Add form and buttons for updating and deleting users */}
              </div>
            )
          })}
        </div>
      )}
      {/* Add form to create a new user */}
    </div>
  );
}
  

export default Users;
