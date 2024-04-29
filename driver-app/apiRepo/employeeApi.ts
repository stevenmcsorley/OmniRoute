const API_URL = 'http://backend.localhost/api';


interface EmployeeLoginResponse {
  message: string;
  employee: Employee;
}

interface Employee {
  Id: number;
  CompanyId: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Role: string;
}


interface Assignment {
    Id: number;
    ResourceId: number;
    EmployeeId: number;
    StartTime: string;
    EndTime: string;
    Status: string;
    ResourceIdentifier: string;
    ResourceType: string;
  }

// Function to handle employee login
export const loginEmployee = async (email: string): Promise<EmployeeLoginResponse> => {
  const response = await fetch(`${API_URL}/employee/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.error || 'Employee login failed.');
  }

  return response.json();
};

// Function to fetch details about an employee
export const getEmployeeDetails = async (employeeId: number): Promise<Employee> => {
  const response = await fetch(`${API_URL}/employee/details/${employeeId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch employee details.');
  }
  return response.json();
};

// Function to get assignments for the employee's company
export const getCompanyAssignments = async (companyId: number): Promise<Assignment[]> => {
    const response = await fetch(`${API_URL}/assignments/${companyId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch assignments.');
    }
    return response.json();
  };
  
// Function to sign up an employee for an assignment
export const signupForAssignment = async (resourceId: number, employeeId: number): Promise<string> => {
    console.log("Assigning Resource:", resourceId, "to Employee:", employeeId);
    const response = await fetch(`${API_URL}/assignments/assign`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeId, resourceId }),
    });

    if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Failed to sign up for assignment.');
    }

    return response.json().then(data => data.message);
};

// Function to withdraw an employee from an assignment
export const withdrawFromAssignment = async (resourceId: number, employeeId: number): Promise<string> => {
    const response = await fetch(`${API_URL}/assignments/withdraw`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resourceId, employeeId }),
    });

    if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Failed to withdraw from assignment.');
    }

    return response.json().then(data => data.message);
};
