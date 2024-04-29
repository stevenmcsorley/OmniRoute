import React, { useEffect, useState } from 'react';

// Define the Employee interface based on your database schema
interface Employee {
  Id: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Role: string; // Assuming Role is a characteristic you want to display
}

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://backend.localhost/api/employees');
      if (!response.ok) {
        throw new Error('Problem fetching employees');
      }
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async (employee: Omit<Employee, 'Id'>) => {
    // Implement form submission logic here
  };

  const updateEmployee = async (id: number, employee: Omit<Employee, 'Id'>) => {
    // Implement employee update logic here
  };

  const deleteEmployee = async (id: number) => {
    // Implement employee deletion logic here
  };

  return (
    <div>
      <h1>Employees</h1>
      {loading ? (
        <p>Loading employees...</p>
      ) : (
        <div>
          {employees.map((employee) => (
            <div key={employee.Id}>
              <br />
              <div>Name: {`${employee.FirstName} ${employee.LastName}`}</div>
              <div>Email: {employee.Email}</div>
              <div>Phone: {employee.Phone}</div>
              <div>Role: {employee.Role}</div>
              {/* Buttons and forms for updating and deleting employees */}
            </div>
          ))}
        </div>
      )}
      {/* Form to add a new employee */}
    </div>
  );
}

export default Employees;
