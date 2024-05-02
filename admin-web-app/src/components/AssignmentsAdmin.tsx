import React, { useEffect, useState } from 'react';
import { useQuery, useSubscription, gql } from '@apollo/client';
import Table, { Column } from './Table'; // Ensure the Table component is properly imported


// GraphQL query for fetching assignments
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

// GraphQL subscription for assignment updates
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
  const [previousData, setPreviousData] = useState<Assignment[]>([]);
  const { loading, error, data } = useQuery(GET_ASSIGNMENTS_QUERY, {
    variables: { companyId: 4 },
  });

  const { data: subscriptionData } = useSubscription(ASSIGNMENT_UPDATED_SUBSCRIPTION);

  useEffect(() => {
    if (data && data.assignments) {
      setAssignments(data.assignments);
      setPreviousData(assignments); // Capture the previous state before updating
    }
  }, [data, assignments]);

  useEffect(() => {
    if (subscriptionData && subscriptionData.assignmentUpdated) {
      const updatedAssignments = assignments.map((assignment) =>
        assignment.AssignmentId === subscriptionData.assignmentUpdated.AssignmentId
          ? { ...assignment, ...subscriptionData.assignmentUpdated }
          : assignment
      );
      setAssignments(updatedAssignments);
    }
  }, [subscriptionData, assignments]);

  if (loading) return <p>Loading assignments...</p>;
  if (error) return <p>Error loading assignments: {error.message}</p>;

  const columns: Column<Assignment>[] = [
    { Header: 'ID', accessor: 'AssignmentId', isSortable: true },
    { Header: 'Resource ID', accessor: 'ResourceId', isSortable: true },
    { Header: 'Employee ID', accessor: 'EmployeeId', isSortable: false },
    { Header: 'Start Time', accessor: 'StartTime', isSortable: true },
    { Header: 'End Time', accessor: 'EndTime', isSortable: true },
    { Header: 'Status', accessor: 'Status', isSortable: false }
  ];

  return (
    <div>
      <h1>Assignments</h1>
      <Table
        columns={columns}
        data={assignments}
        keyAccessor="AssignmentId"
        onPaginate={() => {}}
        currentPage={1}
        totalPages={1}
        getRowClassName={(assignment) => assignment.Status === 'Active' ? 'flash-animation' : ''}
      />
    </div>
  );
};

export default AssignmentsAdmin;