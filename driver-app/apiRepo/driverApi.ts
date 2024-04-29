const API_URL = 'http://backend.localhost/api';

interface DriverLoginResponse {
  message: string;
  driver: Driver;
}

interface Driver {
  Id: number;
  CompanyId: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Role: string;
}

interface Route {
  Id: number;
  CompanyId: number;
  Name: string;
  DepartureTime: string;
  ArrivalTime: string;
}

// Function to handle driver login
export const loginDriver = async (email: string): Promise<DriverLoginResponse> => {
  const response = await fetch(`${API_URL}/driver/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.error || 'Driver login failed.');
  }

  return response.json();
};

// Function to get routes for the driver's company
export const getDriverRoutes = async (companyId: number): Promise<Route[]> => {
  const response = await fetch(`${API_URL}/driver/routes?companyId=${companyId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch routes.');
  }

  return response.json();
};

// Function to get driver details
export const getDriverDetails = async (driverId: number): Promise<Driver> => {
    const response = await fetch(`${API_URL}/driver/details?driverId=${driverId}`, {
      method: 'GET', // Assuming the method is GET, update if it's different
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || 'Failed to fetch driver details.');
    }
  
    return response.json();
  };

// Add more functions for other driver-related endpoints as needed
