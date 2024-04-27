import React, { useEffect, useState } from 'react';
import { getWorkerRoutes } from '../apiRepo/workerApi';

type Route = {
  Id: number;
  Name: string;
};

type AvailableRoutesProps = {
  workerId: number;
};

const AvailableRoutes = ({ workerId }: AvailableRoutesProps) => {
  const [routes, setRoutes] = useState<Route[]>([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const workerRoutes = await getWorkerRoutes(workerId);
        setRoutes(workerRoutes);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRoutes();
  }, [workerId]);

  return (
    <div>
      <h2>Available Routes:</h2>
      <ul>
        {routes.map((route) => (
          <li key={route.Id}>{route.Name}</li>
        ))}
      </ul>
    </div>
  );
};

export default AvailableRoutes;
