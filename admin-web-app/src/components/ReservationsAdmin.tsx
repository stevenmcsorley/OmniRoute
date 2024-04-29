import React, { useEffect, useState } from 'react';

interface Reservation {
  Id: number;
  ResourceId: number;
  EmployeeId: number | null; // EmployeeId can be null if the reservation isn't directly linked to a specific employee
  CustomerId: number;
  StartTime: string;
  EndTime: string;
  Status: 'Pending' | 'Confirmed' | 'Cancelled';
}

const ReservationsAdmin: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch('http://backend.localhost/api/reservations/all');
      if (!response.ok) {
        throw new Error('Problem fetching reservations');
      }
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const addReservation = async (reservation: Omit<Reservation, 'Id'>) => {
    // Implement the logic to add a reservation here
  };

  const updateReservation = async (id: number, reservation: Omit<Reservation, 'Id'>) => {
    // Implement the logic to update reservation details here
  };

  const deleteReservation = async (id: number) => {
    // Implement the logic to delete a reservation here
  };

  return (
    <div>
      <h1>Reservations</h1>
      {loading ? (
        <p>Loading reservations...</p>
      ) : (
        reservations.map((reservation) => (
          <div key={reservation.Id}>
            <p>Resource ID: {reservation.ResourceId}</p>
            <p>Employee ID: {reservation.EmployeeId}</p>
            <p>Customer ID: {reservation.CustomerId}</p>
            <p>Start Time: {reservation.StartTime}</p>
            <p>End Time: {reservation.EndTime}</p>
            <p>Status: {reservation.Status}</p>
            {/* Provide forms or UI elements to edit and delete reservations */}
          </div>
        ))
      )}
    </div>
  );
}

export default ReservationsAdmin;
