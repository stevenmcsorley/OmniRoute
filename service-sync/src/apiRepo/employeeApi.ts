const API_URL = 'http://backend.localhost/api';

interface EmployeeLoginResponse {
  message: string;
  employee: Employee;
}

interface Employee {
  EmployeeId: number;
  CompanyId: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Role: string;
}

interface Assignment {
  AssignmentId: number;
  ResourceId: number;
  EmployeeId: number | null; // Updated to allow null
  StartTime: string;
  EndTime: string;
  Status: string;
  ResourceIdentifier: string;
  ResourceType: string;
}

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

export const getEmployeeDetails = async (employeeId: number): Promise<Employee> => {
  const response = await fetch(`${API_URL}/employee/details/${employeeId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch employee details.');
  }
  return response.json();
};

export const getCompanyAssignments = async (companyId: number): Promise<Assignment[]> => {
  const response = await fetch(`${API_URL}/assignments/${companyId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch assignments.');
  }
  return response.json();
};

export const signupForAssignment = async (assignmentId: number, employeeId: number): Promise<string> => {
  console.log("Assigning Assignment:", assignmentId, "to Employee:", employeeId);
  const response = await fetch(`${API_URL}/assignments/assign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ employeeId, assignmentId }),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.error || 'Failed to sign up for assignment.');
  }

  return response.json().then(data => data.message);
};

export const withdrawFromAssignment = async (assignmentId: number): Promise<string> => {
  const response = await fetch(`${API_URL}/assignments/withdraw`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ assignmentId }),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.error || 'Failed to withdraw from assignment.');
  }

  return response.json().then(data => data.message);
};
