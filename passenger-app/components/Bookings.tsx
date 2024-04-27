import React, { useEffect, useState } from 'react';
import { getWorkerBookings } from '../apiRepo/workerApi';

interface Booking {
  Id: number;
  WorkerId: number;
  RouteId: number;
  IssueDate: string | null;
  ExpiryDate: string | null;
}

interface Props {
  workerId: number;
}

const Bookings = ({ workerId }: Props) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const workerBookings = await getWorkerBookings(workerId);
        setBookings(workerBookings);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBookings();
  }, [workerId]);

  return (
    <div>
      <h2>Worker Bookings:</h2>
      {bookings.length > 0 ? (
        <ul>
          {bookings.map((booking) => (
            <li key={booking.Id}>{booking.Id}</li>
          ))}
        </ul>
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
};

export default Bookings;
