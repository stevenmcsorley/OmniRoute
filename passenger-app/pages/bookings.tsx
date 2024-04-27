import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getWorkerBookings } from '../apiRepo/workerApi';
import QRCode from 'qrcode.react';
import { Page, Navbar, Block, BlockTitle, List, ListItem, Button } from 'konsta/react';

type Booking = {
  Id: number;
  WorkerId: number;
  RouteId: number;
  IssueDate: string | null;
  ExpiryDate: string | null;
};

function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const workerIdStr = localStorage.getItem('workerId');
    const workerId = workerIdStr ? parseInt(workerIdStr) : null;

    const fetchBookings = async () => {
      const fetchedBookings = await getWorkerBookings(workerId);
      setBookings(fetchedBookings);
    };

    fetchBookings();
  }, []);

  if (bookings.length === 0) return <div>Loading...</div>;

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  return (
    <Page>
      <Navbar title="Your Bookings" />
      <Block strong className="p-4">
        <BlockTitle className="text-lg font-semibold mb-4">Your Bookings</BlockTitle>
        <List>
          {bookings.map((booking) => (
            <ListItem
              key={booking.Id}
              onClick={() => handleBookingClick(booking)}
              className={`p-4 cursor-pointer ${selectedBooking === booking ? 'bg-blue-100 text-gray-800' : ''}`}
            >
              <div className="flex justify-between items-center w-full">
                <div>
                  <div className="font-bold">Booking ID: {booking.Id}</div>
                  <div className="font-bold">Worker ID: {booking.WorkerId}</div>
                  <div className="font-bold">Route ID: {booking.RouteId}</div>
                </div>
                {selectedBooking === booking ? (
                  <div className="ml-4">
                    <QRCode value={JSON.stringify(booking)} />
                  </div>
                ) : null}
              </div>
            </ListItem>
          ))}
        </List>
        <Link href="/dashboard" className="text-blue-500 mt-4 inline-block">
          Back to Dashboard
        </Link>
      </Block>
    </Page>
  );
}

export default Bookings;
