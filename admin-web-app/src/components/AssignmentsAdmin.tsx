import React, { useEffect, useState } from 'react';
import { useQuery, useSubscription, gql } from '@apollo/client';

// Define the GraphQL query for fetching assignments
const GET_ASSIGNMENTS_QUERY = gql`
  query GetAssignments($companyId: Int!) {
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

// Define the GraphQL subscription for assignment updates
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

interface Assignment {
  AssignmentId: number;
  ResourceId: number;
  EmployeeId: number | null;
  StartTime: string;
  EndTime: string;
  Status: 'Scheduled' | 'Active' | 'Completed' | 'Cancelled';
}

const AssignmentsAdmin: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  // Use the useQuery hook to fetch initial assignments
  const { loading, error, data } = useQuery(GET_ASSIGNMENTS_QUERY, {
    variables: { companyId: 4 }, // Replace with the actual company ID as needed
  });

  // Use the useSubscription hook to listen for updates
  const { data: subscriptionData } = useSubscription(
    ASSIGNMENT_UPDATED_SUBSCRIPTION,
    { variables: { companyId: 4 } } // Replace with the actual company ID as needed
  );

  // Handle the initial data fetched by useQuery
  useEffect(() => {
    if (data && data.assignments) {
      setAssignments(data.assignments);
    }
  }, [data]);

  // Handle the data received from the subscription
  useEffect(() => {
    if (subscriptionData && subscriptionData.assignmentUpdated) {
      setAssignments((prevAssignments) =>
        prevAssignments.map((assignment) =>
          assignment.AssignmentId === subscriptionData.assignmentUpdated.AssignmentId ? subscriptionData.assignmentUpdated : assignment
        )
      );
    }
  }, [subscriptionData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return '#FFFF99'; // light yellow
      case 'Active':
        return '#99FF99'; // light green
      case 'Completed':
        return '#99CCFF'; // light blue
      case 'Cancelled':
        return '#FF9999'; // light red
      default:
        return 'transparent'; // no color
    }
  };

  if (loading) return <p>Loading assignments...</p>;
  if (error) return <p>Error loading assignments: {error.message}</p>;

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
            <tr key={assignment.AssignmentId} style={{ backgroundColor: getStatusColor(assignment.Status), color: 'black' }}>
              <td>{assignment.AssignmentId}</td>
              <td>{assignment.ResourceId}</td>
              <td>{assignment.EmployeeId}</td>
              <td>{assignment.StartTime}</td>
              <td>{assignment.EndTime}</td>
              <td>{assignment.Status}</td>
              <td>
                {/* Example buttons for actions */}
                {/* <button onClick={() => handleEdit(assignment.AssignmentId)}>Edit</button>
                <button onClick={() => handleDelete(assignment.AssignmentId)}>Delete</button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentsAdmin;
