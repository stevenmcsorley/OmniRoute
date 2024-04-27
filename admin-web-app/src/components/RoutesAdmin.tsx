import React, { useEffect, useState } from 'react';

interface Route {
  Id: number;
  CompanyId: number;
  BusId: number;
  Name: string;
  DepartureTime: string;
  ArrivalTime: string;
}

const RoutesAdmin: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await fetch('http://backend.localhost/api/admin/routes?companyId=2');
      if (!response.ok) {
        throw new Error('Problem fetching routes');
      }
      const data = await response.json();
      setRoutes(data);
    } catch (error) {
      console.error('Error fetching routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const addRoute = async (newRoute: Omit<Route, 'Id'>) => {
    // Implement form submission logic to add a new route here
  };

  const updateRoute = async (id: number, updatedRoute: Omit<Route, 'Id'>) => {
    // Implement logic to update an existing route here
  };

  const deleteRoute = async (id: number) => {
    // Implement logic to delete a route here
  };

  return (
    <div>
      <h1>Routes</h1>
      {loading ? (
        <p>Loading routes...</p>
      ) : (
        <div>
          {routes.map((route) => (
            <div key={route.Id}>
              <h2>{route.Name}</h2>
              <p>Bus ID: {route.BusId}</p>
              <p>Departure Time: {route.DepartureTime}</p>
              <p>Arrival Time: {route.ArrivalTime}</p>
              {/* Add forms and buttons for updating and deleting routes */}
            </div>
          ))}
        </div>
      )}
      {/* Add form to create a new route */}
    </div>
  );
};

export default RoutesAdmin;
