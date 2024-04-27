import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getWorkerRoutes, bookRoute } from '../apiRepo/workerApi';
import { useRouter } from 'next/router';
import { Page, Navbar, Block, BlockTitle, List, ListItem, Button } from 'konsta/react';

function AvailableRoutes() {
  const [routes, setRoutes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const workerIdStr = localStorage.getItem('workerId');
    const workerId = workerIdStr ? parseInt(workerIdStr) : null;

    const fetchRoutes = async () => {
      if (workerId) {
        const fetchedRoutes = await getWorkerRoutes(workerId);
        setRoutes(fetchedRoutes);
      }
    };

    fetchRoutes();
  }, []);

  const handleBookRoute = async (routeId) => {
    const workerIdStr = localStorage.getItem('workerId');
    const workerId = workerIdStr ? parseInt(workerIdStr) : null;

    if (workerId) {
      try {
        await bookRoute(workerId, routeId);
        router.push('/bookings');
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (routes.length === 0) return <div>Loading...</div>;

  return (
    <Page>
      <Navbar title="Available Routes" />
      <Block strong className="p-4">
        <BlockTitle className="text-lg font-semibold mb-4">Available Routes</BlockTitle>
        <List>
          {routes.map((route) => (
            <ListItem key={route.Id}>
              <div className="flex justify-between items-center w-full">
                <span className="flex-1">{route.Name}</span>
                <Button onClick={() => handleBookRoute(route.Id)} className="flex-1 ml-4">
                  Book
                </Button>
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

export default AvailableRoutes;
