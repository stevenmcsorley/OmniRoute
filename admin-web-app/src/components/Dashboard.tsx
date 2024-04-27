// src/components/Dashboard.tsx
import React, { useEffect, useState } from 'react';

const Dashboard: React.FC = () => {
  const [summaryData, setSummaryData] = useState({
    usersCount: 0,
    routesCount: 0,
    busesCount: 0,
    bookingsCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // This function can be used to fetch count data from each endpoint
  const fetchDataCount = async (endpoint: string) => {
    try {
      const response = await fetch(`http://backend.localhost/api/admin/${endpoint}?companyId=2`);
      const data = await response.json();
      return data.length; // Assuming the endpoint returns an array of items
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return 0; // Return 0 if there's an error
    }
  };

  useEffect(() => {
    // Assume companyId is stored in state or comes from context/auth
    const companyId = 2;

    // Use Promise.all to fetch data concurrently
    Promise.all([
      fetchDataCount('users'),
      fetchDataCount('routes'),
      fetchDataCount('buses'),
      fetchDataCount('bookings'),
    ]).then(([usersCount, routesCount, busesCount, bookingsCount]) => {
      setSummaryData({ usersCount, routesCount, busesCount, bookingsCount });
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Number of Workers and Drivers: {summaryData.usersCount}</p>
      <p>Number of Routes: {summaryData.routesCount}</p>
      <p>Number of Buses: {summaryData.busesCount}</p>
      <p>Number of Bookings: {summaryData.bookingsCount}</p>
    </div>
  );
};

export default Dashboard;
