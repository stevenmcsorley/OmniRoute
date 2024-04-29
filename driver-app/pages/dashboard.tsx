import React, { useEffect, useState } from 'react';
import { getCompanyAssignments, signupForAssignment, withdrawFromAssignment } from '../apiRepo/employeeApi';
import { Page, Navbar, Block, BlockTitle, List, ListItem, Button } from 'konsta/react';


interface Assignment {
  Id: number;
  ResourceId: number;
  EmployeeId: number | null;
  StartTime: string;
  EndTime: string;
  Status: string;
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

function Dashboard() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    const storedEmployee = localStorage.getItem('employee');
    if (storedEmployee) {
      const employeeData: Employee = JSON.parse(storedEmployee);
      setEmployee(employeeData);
      fetchAssignments(employeeData.CompanyId);
    }
  }, []);

  const fetchAssignments = async (companyId: number) => {
    try {
      const assignmentsData = await getCompanyAssignments(companyId);
      setAssignments(assignmentsData);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const handleAssign = async (assignmentId: number) => {
    if (!employee) return;
    try {
      // Pass the correct employeeId and assignmentId to the signup function
      await signupForAssignment(assignmentId, employee.Id);
      fetchAssignments(employee.CompanyId); // Refresh the assignments list
    } catch (error) {
      console.error('Error assigning to assignment:', error);
    }
  };

  const handleUnassign = async (assignmentId: number) => {
    if (!employee) return;
    try {
      await withdrawFromAssignment(assignmentId, employee.Id);
      fetchAssignments(employee.CompanyId); // Refresh the assignments list
    } catch (error) {
      console.error('Error unassigning from assignment:', error);
    }
  };

  if (!employee) return <div>Loading...</div>;

  return (
    <Page>
      <Navbar title="Dashboard" />
      <Block strong className="p-4">
        <BlockTitle className="mb-4 text-lg font-semibold">
          Welcome, {employee.FirstName}!
        </BlockTitle>
        <BlockTitle className="mb-2 font-semibold text-md">Your Assignments</BlockTitle>
        <List>
          {assignments.map((assignment) => (
            <ListItem
              key={assignment.Id}
              title={`Assignment ${assignment.Id}`}
              after={
                <div>
                  <Button small onClick={() => handleAssign(assignment.Id)}>Assign</Button>
                  <Button small color="red" onClick={() => handleUnassign(assignment.Id)}>Unassign</Button>
                </div>
              }
            >
              <div>Start Time: {assignment.StartTime}</div>
              <div>End Time: {assignment.EndTime}</div>
              <div>Status: {assignment.Status}</div>
            </ListItem>
          ))}
        </List>
      </Block>
    </Page>
  );
}

export default Dashboard;