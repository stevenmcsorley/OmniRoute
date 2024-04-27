import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getWorkerDetails } from '../apiRepo/workerApi';
import { Page, Navbar, Block, BlockTitle, List, ListItem } from 'konsta/react';

type WorkerDetails = {
  worker: {
    Id: number;
    CompanyId: number;
    FirstName: string;
    LastName: string;
    Email: string;
    Phone: string;
  };
  company: {
    Id: number;
    Name: string;
    Address: string;
    ContactPerson: string;
  };
};

function Dashboard() {
  const [workerDetails, setWorkerDetails] = useState<WorkerDetails | null>(null);

  useEffect(() => {
    const workerIdStr = localStorage.getItem('workerId');
    const workerId = workerIdStr ? parseInt(workerIdStr) : null;

    const fetchWorkerDetails = async () => {
      if (workerId) {
        const details = await getWorkerDetails(workerId);
        setWorkerDetails(details);
      }
    };

    fetchWorkerDetails();
  }, []);

  if (!workerDetails) return <div>Loading...</div>;

  return (
    <Page>
      <Navbar title="Dashboard" />
      <Block strong className="p-4">
        <BlockTitle className="mb-4 text-lg font-semibold">
          Welcome, {workerDetails.worker.FirstName}!
        </BlockTitle>
        <nav className="mb-4 text-blue-500">
          <Link href="/availableRoutes">
            Available Routes
          </Link>
          <span className="mx-2">|</span>
          <Link href="/bookings">
            Your Bookings
          </Link>
          <span className="mx-2">|</span>
          <Link href="/">
            Log Out
          </Link>
        </nav>

        <BlockTitle className="mb-2 font-semibold text-md">Your Company</BlockTitle>
        <List>
          <ListItem title="Name" after={workerDetails.company.Name} />
          <ListItem title="Address" after={workerDetails.company.Address} />
          <ListItem title="Contact Person" after={workerDetails.company.ContactPerson} />
        </List>

        <BlockTitle className="mt-4 mb-2 font-semibold text-md">Your Details</BlockTitle>
        <List>
          <ListItem title="First Name" after={workerDetails.worker.FirstName} />
          <ListItem title="Last Name" after={workerDetails.worker.LastName} />
          <ListItem title="Email" after={workerDetails.worker.Email} />
          <ListItem title="Phone" after={workerDetails.worker.Phone} />
        </List>
      </Block>
    </Page>
  );
}

export default Dashboard;
