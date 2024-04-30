// const API_URL = 'https://backend.localhost/api';
const API_URL = 'http://backend.localhost/api';

interface LoginRequest {
    workerId: number;
  }
  
  interface LoginResponse {
    message: string;
  }
  
  interface Route {
    Id: number;
    CompanyId: number;
    BusId: number;
    Name: string;
    DepartureTime: string;
    ArrivalTime: string;
  }
  
  interface BookRequest {
    workerId: number;
    routeId: number;
  }
  
  interface BookResponse {
    message: string;
    ticketId: number;
  }
  
  interface Booking {
    Id: number;
    WorkerId: number;
    RouteId: number;
    IssueDate: string | null;
    ExpiryDate: string | null;
  }
  

export const loginWorker = async (workerId: number): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/worker/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ workerId }),
  });

  if (!response.ok) {
    throw new Error('Worker login failed.');
  }

  return response.json();
};

export const getWorkerRoutes = async (workerId: number): Promise<Route[]> => {
  const response = await fetch(`${API_URL}/worker/routes?workerId=${workerId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch worker routes.');
  }

  return response.json();
};

export const bookRoute = async (workerId: number, routeId: number): Promise<BookResponse> => {
  const response = await fetch(`${API_URL}/worker/book`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ workerId, routeId }),
  });

  if (!response.ok) {
    throw new Error('Booking failed.');
  }

  return response.json();
};

export const getWorkerBookings = async (workerId: number): Promise<Booking[]> => {
  const response = await fetch(`${API_URL}/worker/bookings?workerId=${workerId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch worker bookings.');
  }

  return response.json();
};

// https://backend.localhost/api/worker/details?workerId=5
// pulls back this

// {
// "worker": {
// "Id": 5,
// "CompanyId": 6,
// "FirstName": "Beth",
// "LastName": "Davis",
// "Email": "deanvalenzuela@example.net",
// "Phone": "691-965-9762"
// },
// "company": {
// "Id": 6,
// "Name": "Lewis-Lloyd",
// "Address": "230 Smith River Suite 450",
// "ContactPerson": "John White"
// }
// }

// getWorkerDetails

interface Worker {
    Id: number;
    CompanyId: number;
    FirstName: string;
    LastName: string;
    Email: string;
    Phone: string;
    }

    interface Company {
    Id: number;
    Name: string;
    Address: string;
    ContactPerson: string;
    }

    interface WorkerDetailsResponse {
    worker: Worker;
    company: Company;
    }

    export const getWorkerDetails = async (workerId: number): Promise<WorkerDetailsResponse> => {
    const response = await fetch(`${API_URL}/worker/details?workerId=${workerId}`);

    if (!response.ok) {
        throw new Error('Failed to fetch worker details.');
    }

    return response.json();
    };


