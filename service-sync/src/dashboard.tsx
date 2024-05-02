import React, { useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useSubscription } from '@apollo/client';
import client from './apollo-client'; // Import the Apollo Client configuration

interface Assignment {
  AssignmentId: number;
  ResourceId: number;
  EmployeeId: number | null;
  StartTime: string;
  EndTime: string;
  Status: string;
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

const GET_COMPANY_ASSIGNMENTS_QUERY = gql`
  query GetCompanyAssignments($companyId: Int!) {
    assignments(companyId: $companyId) {
      AssignmentId
      ResourceId
      EmployeeId
      StartTime
      EndTime
      Status
    }
  }
`;

const ASSIGNMENT_UPDATED_SUBSCRIPTION = gql`
  subscription OnAssignmentUpdated {
    assignmentUpdated {
      AssignmentId
      ResourceId
      EmployeeId
      StartTime
      EndTime
      Status
    }
  }
`;

const Dashboard: React.FC = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any | null>(null);

  // set employee state from local storage
  localStorage.setItem('employee', JSON.stringify({
    EmployeeId: 1,
    CompanyId: 4,
    FirstName: 'John',
    LastName: 'Doe',
  }));

  useEffect(() => {
    const storedEmployee = localStorage.getItem('employee');
    if (storedEmployee) {
      const employeeData: Employee = JSON.parse(storedEmployee);
      setEmployee(employeeData);
    }
  }, []);

  useEffect(() => {
    const fetchAssignmentsAndSetState = async () => {
      try {
        const { data } = await client.query({
          query: GET_COMPANY_ASSIGNMENTS_QUERY,
          variables: { companyId: employee?.CompanyId },
        });
        setAssignments(data.assignments);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    if (employee) {
      fetchAssignmentsAndSetState();
    }
  }, [employee]);

  const { data: subscriptionData } = useSubscription(ASSIGNMENT_UPDATED_SUBSCRIPTION);

  useEffect(() => {
    if (subscriptionData && subscriptionData.assignmentUpdated) {
      setAssignments((prevAssignments) =>
        prevAssignments.map((assignment) =>
          assignment.AssignmentId === subscriptionData.assignmentUpdated.AssignmentId
            ? subscriptionData.assignmentUpdated
            : assignment
        )
      );
    }
  }, [subscriptionData]);

  const handleAssign = async (assignmentId: number) => {
    if (!employee) return;
    try {
      await client.mutate({
        mutation: gql`
          mutation UpdateAssignmentStatus($assignmentId: Int!, $status: String!, $companyId: Int!) {
            updateAssignmentStatus(AssignmentId: $assignmentId, status: $status, CompanyId: $companyId) {
              AssignmentId
              ResourceId
              EmployeeId
              StartTime
              EndTime
              Status
            }
          }
        `,
        variables: { assignmentId, status: "Active", companyId: employee.CompanyId },
      });
      // No need to refetch assignments here since we're updating assignments state based on subscription
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const handleUnassign = async (assignmentId: number) => {
    if (!employee) return;
    try {
      await client.mutate({
        mutation: gql`
          mutation UpdateAssignmentStatus($assignmentId: Int!, $status: String!, $companyId: Int!) {
            updateAssignmentStatus(AssignmentId: $assignmentId, status: $status, CompanyId: $companyId) {
              AssignmentId
              ResourceId
              EmployeeId
              StartTime
              EndTime
              Status
            }
          }
        `,
        variables: { assignmentId, status: "Cancelled", companyId: employee.CompanyId },
      });
      // No need to refetch assignments here since we're updating assignments state based on subscription
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  if (!employee) return <div>Loading...</div>;
  if (loading) return <div>Loading assignments...</div>;
  if (error) return <div>Error loading assignments: {error.message}</div>;

  return (
    <div>
      <h1>Assignments</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Resource ID</th>
            <th>Employee ID</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment.AssignmentId}>
              <td>{assignment.AssignmentId}</td>
              <td>{assignment.ResourceId}</td>
              <td>{assignment.EmployeeId}</td>
              <td>{assignment.StartTime}</td>
              <td>{assignment.EndTime}</td>
              <td>{assignment.Status}</td>
              <td>
                <button onClick={() => handleAssign(assignment.AssignmentId)}>Assign</button>
                <button onClick={() => handleUnassign(assignment.AssignmentId)}>Unassign</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
