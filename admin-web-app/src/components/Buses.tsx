import React, { useEffect, useState } from 'react';

interface Bus {
  Id: number;
  CompanyId: number;
  LicensePlate: string;
  Capacity: number;
}

const Buses: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await fetch('http://backend.localhost/api/admin/buses?companyId=2');
      if (!response.ok) {
        throw new Error('Problem fetching buses');
      }
      const data = await response.json();
      setBuses(data);
    } catch (error) {
      console.error('Error fetching buses:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBus = async (bus: Omit<Bus, 'Id'>) => {
    // Implement the logic to add a bus here
  };

  const updateBus = async (id: number, bus: Omit<Bus, 'Id'>) => {
    // Implement the logic to update bus details here
  };

  const deleteBus = async (id: number) => {
    // Implement the logic to delete a bus here
  };

  return (
    <div>
      <h1>Buses</h1>
      {loading ? (
        <p>Loading buses...</p>
      ) : (
        buses.map((bus) => (
          <div key={bus.Id}>
            <p>License Plate: {bus.LicensePlate}</p>
            <p>Capacity: {bus.Capacity}</p>
            {/* Provide forms or UI elements to edit and delete buses */}
          </div>
        ))
      )}
      {/* Provide a form to add a new bus */}
    </div>
  );
};

export default Buses;
