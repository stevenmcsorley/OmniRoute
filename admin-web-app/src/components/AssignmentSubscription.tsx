// src/components/AssignmentSubscription.tsx
import React from 'react';
import { useSubscription, gql } from '@apollo/client';

const ASSIGNMENT_SUBSCRIPTION = gql`
  subscription OnAssignmentUpdated {
    assignmentUpdated {
      AssignmentId
      Status
    }
  }
`;

const AssignmentSubscription: React.FC = () => {
    const { data, loading, error } = useSubscription(ASSIGNMENT_SUBSCRIPTION);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <h1>Latest Assignment Update</h1>
            {data && (
                <div>
                    <p>Assignment ID: {data.assignmentUpdated.AssignmentId}</p>
                    <p>Status: {data.assignmentUpdated.Status}</p>
                </div>
            )}
        </div>
    );
};

export default AssignmentSubscription;
