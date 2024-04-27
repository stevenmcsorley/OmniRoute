
import { faker } from '@faker-js/faker';
import mysql from 'mysql';

const connection = mysql.createConnection({
    host: 'localhost', // Docker container name for the database service
    user: 'root', // MySQL username
    password: 'password', // MySQL password
    database: 'AllSeeingEye', // MySQL database name
});

// Generate helpers data for Companies table
function generateCompanies() {
    const companies = [];
    for (let i = 0; i < 10; i++) {
      const company = {
        Name: faker.company.name(),
        Address: faker.location.streetAddress(),
        ContactPerson: faker.person.fullName()
      };
      companies.push(company);
    }
    return companies;
}

generateCompanies();

// Generate helpers data for Buses table
function generateBuses(companies) {
    const buses = [];
    for (let i = 0; i < 20; i++) {
      const bus = {
        CompanyId: faker.helpers.arrayElement(companies).Id,
        LicensePlate: generateLicensePlate(),
        Capacity: faker.helpers.arrayElement({ min: 20, max: 50 }),
      };
      buses.push(bus);
    }
    return buses;
  }

  // Generate a random license plate number
function generateLicensePlate() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    let licensePlate = "";
    for (let i = 0; i < 7; i++) {
      if (i < 2) {
        licensePlate += faker.helpers.arrayElement(letters);
      } else {
        licensePlate += faker.helpers.arrayElement(numbers);
      }
    }
    return licensePlate;
  }

// Generate helpers data for Routes table
function generateRoutes(buses) {
    const routes = [];
    for (let i = 0; i < 30; i++) {
        const route = {
            BusId: faker.helpers.arrayElement(buses).Id,
            Name: faker.helpers.arrayElements(['word1', 'word2'], 2).join(' '),
            DepartureTime: faker.date.future(),
            ArrivalTime: faker.date.future(),
        };
        routes.push(route);
    }
    return routes;
}

// Generate helpers data for Workers table
function generateWorkers(companies) {
    const workers = [];
    for (let i = 0; i < 50; i++) {
      const worker = {
        FirstName: faker.person.firstName(),
        LastName: faker.person.lastName(),
        Email: faker.internet.email(),
        Phone: faker.phone.number(),
        CompanyId: faker.helpers.arrayElement(companies).Id,
      };
      workers.push(worker);
    }
    return workers;
  }

// Generate helpers data for Tickets table
function generateTickets(workers, routes) {
    const tickets = [];
    for (let i = 0; i < 100; i++) {
        const ticket = {
            WorkerId: faker.helpers.arrayElement(workers).Id,
            RouteId: faker.helpers.arrayElement(routes).Id,
            IssueDate: faker.date.past(),
            ExpiryDate: faker.date.future(),
        };
        tickets.push(ticket);
    }
    return tickets;
}

// Insert generated data into the database
function insertData() {
    const companies = generateCompanies();
    const buses = generateBuses(companies);
    const routes = generateRoutes(buses);
    const workers = generateWorkers(companies);
    const tickets = generateTickets(workers, routes);

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            return;
        }
        console.log('Connected to the database.');

        connection.query('INSERT INTO Companies (Name, Address, ContactPerson) VALUES ?', [companies.map(company => [company.Name, company.Address, company.ContactPerson])], (err, results) => {
            if (err) throw err;
            console.log(`Data inserted into Companies table. Affected rows: ${results.affectedRows}`);

            const companyIdMap = companies.reduce((map, company, index) => {
                map[company.Id] = index;
                return map;
            }, {});

            const busRecords = buses.map(bus => [companyIdMap[bus.CompanyId], bus.LicensePlate, bus.Capacity]);
            connection.query('INSERT INTO Buses (CompanyId, LicensePlate, Capacity) VALUES ?', [busRecords], (err, results) => {
                if (err) throw err;
                console.log(`Data inserted into Buses table. Affected rows: ${results.affectedRows}`);

                const busIdMap = buses.reduce((map, bus, index) => {
                    map[bus.Id] = index;
                    return map;
                }, {});

                const routeRecords = routes.map(route => [busIdMap[route.BusId], route.Name, route.DepartureTime, route.ArrivalTime]);
                connection.query('INSERT INTO Routes (BusId, Name, DepartureTime, ArrivalTime) VALUES ?', [routeRecords], (err, results) => {
                    if (err) throw err;
                    console.log(`Data inserted into Routes table. Affected rows: ${results.affectedRows}`);

                    const workerRecords = workers.map(worker => [companyIdMap[worker.CompanyId], worker.Name, worker.Email, worker.UniqueId]);
                    connection.query('INSERT INTO Workers (CompanyId, Name, Email, UniqueId) VALUES ?', [workerRecords], (err, results) => {
                        if (err) throw err;
                        console.log(`Data inserted into Workers table. Affected rows: ${results.affectedRows}`);

                        const workerIdMap = workers.reduce((map, worker, index) => {
                            map[worker.Id] = index;
                            return map;
                        }, {});

                        const ticketRecords = tickets.map(ticket => [workerIdMap[ticket.WorkerId], ticket.RouteId, ticket.IssueDate, ticket.ExpiryDate]);
                        connection.query('INSERT INTO Tickets (WorkerId, RouteId, IssueDate, ExpiryDate) VALUES ?', [ticketRecords], (err, results) => {
                            if (err) throw err;
                            console.log(`Data inserted into Tickets table. Affected rows: ${results.affectedRows}`);

                            console.log('Data insertion complete.');
                            connection.end();
                        });
                    });
                });
            });
        });
    });
}

// Call the insertData function to insert the generated data
insertData();