import React, { useEffect, useState } from 'react';
import { gql, ApolloError } from '@apollo/client'; // Import ApolloError
import { useSubscription } from '@apollo/client/react/hooks'; // Import useSubscription
import client from '../apiRepo/apollo-client'; // Import the Apollo Client configuration
import { Page, Navbar, Block, BlockTitle, List, ListItem, Button } from 'konsta/react';


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

function Dashboard() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApolloError | null>(null); // Use ApolloError

  useEffect(() => {
    const storedEmployee = localStorage.getItem('employee');
    if (storedEmployee) {
      const employeeData: Employee = JSON.parse(storedEmployee);
      setEmployee(employeeData);
      console.log('Fetching assignments for company:', employeeData.CompanyId);
      fetchAssignments(employeeData.CompanyId);
    }
  }, []);

  const fetchAssignments = async (companyId: number) => {
    console.log('Fetching assignments for company:', companyId);
    try {
      // Perform your Apollo Client query here to fetch assignments
      // For example:
      const { data } = await client.query({
        query: gql`
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
        `,
        variables: { companyId }
      });
      setAssignments(data.assignments);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      setLoading(false);
      setError(error);
    }
  };

  // Use the useSubscription hook to listen for updates
  const { data: subscriptionData, error: subscriptionError } = useSubscription(ASSIGNMENT_UPDATED_SUBSCRIPTION);

  // Handle the data received from the subscription
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

  // Handle subscription error
  useEffect(() => {
    if (subscriptionError) {
      console.error('Subscription error:', subscriptionError);
    }
  }, [subscriptionError]);

  const handleAssign = async (assignmentId: number) => {
    if (!employee) return;
    try {
      // Perform your Apollo Client mutation here to sign up for assignment
      // For example:
      await client.mutate({
        mutation: gql`
          mutation SignupForAssignment($assignmentId: Int!, $employeeId: Int!) {
            signupForAssignment(assignmentId: $assignmentId, employeeId: $employeeId) {
              AssignmentId
              ResourceId
              EmployeeId
              StartTime
              EndTime
              Status
            }
          }
        `,
        variables: { assignmentId, employeeId: employee.EmployeeId }
      });
      fetchAssignments(employee.CompanyId); // Refresh the assignments list
    } catch (error) {
      console.error('Error assigning to assignment:', error);
    }
  };

  const handleUnassign = async (assignmentId: number) => {
    if (!employee) return;
    try {
      // Perform your Apollo Client mutation here to withdraw from assignment
      // For example:
      await client.mutate({
        mutation: gql`
          mutation WithdrawFromAssignment($assignmentId: Int!) {
            withdrawFromAssignment(assignmentId: $assignmentId) {
              AssignmentId
              ResourceId
              EmployeeId
              StartTime
              EndTime
              Status
            }
          }
        `,
        variables: { assignmentId }
      });
      fetchAssignments(employee.CompanyId); // Refresh the assignments list
    } catch (error) {
      console.error('Error unassigning from assignment:', error);
    }
  };

  if (!employee) return <div>Loading...</div>;
  if (loading) return <div>Loading assignments...</div>;
  if (error) return <div>Error loading assignments: {error.message}</div>;

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
              key={assignment.AssignmentId}
              title={`Assignment ${assignment.AssignmentId}`}
              after={
                <div>
                  <Button small onClick={() => handleAssign(assignment.AssignmentId)}>Assign</Button>
                  <Button small color="red" onClick={() => handleUnassign(assignment.AssignmentId)}>Unassign</Button>
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
