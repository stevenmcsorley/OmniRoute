import React, { useEffect, useState } from 'react';

interface Booking {
  Id: number;
  WorkerId: number;
  RouteId: number;
  IssueDate: string;
  ExpiryDate: string;
}

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://backend.localhost/api/admin/bookings?companyId=2');
      if (!response.ok) {
        throw new Error('Problem fetching bookings');
      }
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (booking: Omit<Booking, 'Id'>) => {
    // Implement form submission logic to create a new booking here
  };

  const updateBooking = async (id: number, booking: Omit<Booking, 'Id'>) => {
    // Implement logic to update an existing booking here
  };

  const deleteBooking = async (id: number) => {
    // Implement logic to delete a booking here
  };

  return (
    <div>
      <h1>Bookings</h1>
      {loading ? (
        <p>Loading bookings...</p>
      ) : (
        <div>
          {bookings.map((booking) => (
            <div key={booking.Id}>
              <p>Booking ID: {booking.Id}</p>
              <p>Worker ID: {booking.WorkerId}</p>
              <p>Route ID: {booking.RouteId}</p>
              <p>Issue Date: {booking.IssueDate}</p>
              <p>Expiry Date: {booking.ExpiryDate}</p>
              {/* Add forms and buttons for updating and deleting bookings */}
            </div>
          ))}
        </div>
      )}
      {/* Add form to create a new booking */}
    </div>
  );
};

export default Bookings;
