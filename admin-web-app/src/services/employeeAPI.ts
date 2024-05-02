import { Employee } from "../types/employeeTypes";

const BASE_URL = 'http://backend.localhost/api/employees';

export const fetchEmployees = async (): Promise<Employee[]> => {
    const response = await fetch(`${BASE_URL}`);
    if (!response.ok) {
      throw new Error('Problem fetching employees');
    }
    return response.json();
  };
  