export interface EmployeesState {
    employees: Employee[];
    loading: boolean;
    error: string | null;
  }

    export interface Employee {
        EmployeeId: number;
        CompanyId: number;
        FirstName: string;
        LastName: string;
        Email: string;
        Phone: string;
        Role: string;
    }