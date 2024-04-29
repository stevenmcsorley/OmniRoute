// src/components/Dashboard.tsx
import React, { useEffect, useState } from 'react';

const Dashboard: React.FC = () => {
  const [summaryData, setSummaryData] = useState({
    employeesCount: 0,
    resourcesCount: 0,
    assignmentsCount: 0,
    reservationsCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // This function can be used to fetch count data from each endpoint
  const fetchDataCount = async (endpoint: string) => {
    try {
      const response = await fetch(`http://backend.localhost/api/${endpoint}`);
      const data = await response.json();
      return data.count; // Assuming the endpoint returns a count in a JSON object
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return 0; // Return 0 if there's an error
    }
  };

  useEffect(() => {
    // Fetch data concurrently for employees, resources, assignments, and reservations
    Promise.all([
      fetchDataCount('employees/count'),
      fetchDataCount('resources/count'),
      fetchDataCount('assignments/count'),
      fetchDataCount('reservations/count'),
    ]).then(([employeesCount, resourcesCount, assignmentsCount, reservationsCount]) => {
      setSummaryData({ employeesCount, resourcesCount, assignmentsCount, reservationsCount });
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Number of Employees: {summaryData.employeesCount}</p>
      <p>Number of Resources: {summaryData.resourcesCount}</p>
      <p>Number of Assignments: {summaryData.assignmentsCount}</p>
      <p>Number of Reservations: {summaryData.reservationsCount}</p>
    </div>
  );
};

export default Dashboard;
