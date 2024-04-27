from faker import Faker
import random
import mysql.connector

# Create a Faker instance
fake = Faker()

# Create a MySQL connection
connection = mysql.connector.connect(
    host="localhost",
    user="root",
    password="password",
    database="AllSeeingEye"
)

# Generate fake data for the Companies table
def generate_companies():
    companies = []
    for i in range(10):
        company = {
            'Id': i + 1,
            'Name': fake.company(),
            'Address': fake.street_address(),
            'ContactPerson': fake.name()
        }
        companies.append(company)
    return companies

companies = generate_companies()

# Generate fake data for the Buses table
def generate_buses(companies):
    buses = []
    for _ in range(20):
        company = random.choice(companies)
        bus = {
            'Id': random.randint(1, 100),
            'CompanyId': company['Id'],
            'LicensePlate': generate_license_plate(),
            'Capacity': random.randint(20, 50)
        }
        buses.append(bus)
    return buses

def generate_license_plate():
    letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    numbers = "0123456789"
    license_plate = random.choice(letters) + random.choice(letters) + '-'
    license_plate += ''.join(random.choice(numbers) for _ in range(4)) + '-'
    license_plate += ''.join(random.choice(numbers) for _ in range(4)) + '-'
    license_plate += ''.join(random.choice(numbers) for _ in range(4)) + '-'
    license_plate += random.choice(letters)
    return license_plate

buses = generate_buses(companies)

# Generate fake data for the Routes table
def generate_routes(buses, companies):
    routes = []
    for i in range(30):
        bus = random.choice(buses)
        company = next((c for c in companies if c['Id'] == bus['CompanyId']), None)
        route = {
            'Id': i + 1,
            'BusId': bus['Id'],
            'CompanyId': company['Id'],  # Add the CompanyId from the bus
            'Name': ' '.join(fake.words(2)),
            'DepartureTime': fake.date_time_between(start_date='-1y', end_date='+1y'),
            'ArrivalTime': fake.date_time_between(start_date='-1y', end_date='+1y')
        }
        routes.append(route)
    return routes

routes = generate_routes(buses, companies)

# Generate fake data for the Workers table
def generate_workers(companies):
    workers = []
    for i in range(50):
        worker = {
            'Id': i + 1,
            'CompanyId': random.choice(companies)['Id'],
            'FirstName': fake.first_name(),
            'LastName': fake.last_name(),
            'Email': fake.email(),
            'Phone': fake.phone_number()
        }
        workers.append(worker)
    return workers

workers = generate_workers(companies)

# Generate fake data for the Tickets table
def generate_tickets(workers, routes):
    tickets = []
    for i in range(100):
        worker = random.choice(workers)
        route = random.choice(routes)
        ticket = {
            'Id': i + 1,
            'WorkerId': worker['Id'],
            'RouteId': route['Id'],
            'IssueDate': fake.date_time_between(start_date='-1y', end_date='now'),
            'ExpiryDate': fake.date_time_between(start_date='now', end_date='+1y')
        }
        tickets.append(ticket)
    return tickets

tickets = generate_tickets(workers, routes)

# Generate fake data for the Drivers table
def generate_drivers(companies, routes):
    drivers = []
    for i in range(5):
        company = random.choice(companies)
        route = random.choice(routes)
        driver = {
            'Id': i + 1,
            'CompanyId': company['Id'],
            'RouteId': route['Id'],  # Add the RouteId from the route
            'Name': fake.name(),
            'LicenseNumber': fake.random_number(digits=8)
        }
        drivers.append(driver)
    return drivers

drivers = generate_drivers(companies, routes)

# Generate fake data for the Passengers table
def generate_passengers(workers, tickets, routes, drivers):
    passengers = []
    for ticket in tickets:
        worker = next((w for w in workers if w['Id'] == ticket['WorkerId']), None)
        route = next((r for r in routes if r['Id'] == ticket['RouteId']), None)
        driver = next((d for d in drivers if d['RouteId'] == ticket['RouteId']), None)
        if worker and route and driver:
            passenger = {
                'Id': ticket['Id'],
                'WorkerId': worker['Id'],
                'TicketId': ticket['Id'],
                'BoardingStatus': 'Not boarded',
                'RouteId': route['Id'],
                'CompanyId': worker['CompanyId'],  # Add the CompanyId from the worker
                'DriverId': driver['Id']  # Add the DriverId from the driver
            }
            passengers.append(passenger)
    return passengers

passengers = generate_passengers(workers, tickets, routes, drivers)

# Insert generated data into the database
def insert_data():
    cursor = connection.cursor()

    # Insert data into the Companies table
    company_values = [(company['Name'], company['Address'], company['ContactPerson']) for company in companies]
    cursor.executemany("INSERT INTO Companies (Name, Address, ContactPerson) VALUES (%s, %s, %s)", company_values)
    connection.commit()
    print(f"Data inserted into Companies table. Affected rows: {cursor.rowcount}")

    # Retrieve the inserted company IDs
    cursor.execute("SELECT Id FROM Companies")
    company_ids = [row[0] for row in cursor.fetchall()]

    # Insert data into the Buses table
    bus_values = [(random.choice(company_ids), bus['LicensePlate'], bus['Capacity']) for bus in buses]
    cursor.executemany("INSERT INTO Buses (CompanyId, LicensePlate, Capacity) VALUES (%s, %s, %s)", bus_values)
    connection.commit()
    print(f"Data inserted into Buses table. Affected rows: {cursor.rowcount}")

    # Retrieve the inserted bus IDs
    cursor.execute("SELECT Id FROM Buses")
    bus_ids = [row[0] for row in cursor.fetchall()]

    # Insert data into the Routes table
    route_values = [(random.choice(bus_ids), route['CompanyId'], route['Name'], route['DepartureTime'], route['ArrivalTime']) for route in routes]
    cursor.executemany("INSERT INTO Routes (BusId, CompanyId, Name, DepartureTime, ArrivalTime) VALUES (%s, %s, %s, %s, %s)", route_values)
    connection.commit()
    print(f"Data inserted into Routes table. Affected rows: {cursor.rowcount}")

    # Retrieve the inserted route IDs
    cursor.execute("SELECT Id FROM Routes")
    route_ids = [row[0] for row in cursor.fetchall()]

    # Insert data into the Workers table
    worker_values = [(random.choice(company_ids), worker['FirstName'], worker['LastName'], worker['Email'], worker['Phone']) for worker in workers]
    cursor.executemany("INSERT INTO Workers (CompanyId, FirstName, LastName, Email, Phone) VALUES (%s, %s, %s, %s, %s)", worker_values)
    connection.commit()
    print(f"Data inserted into Workers table. Affected rows: {cursor.rowcount}")

    # Retrieve the inserted worker IDs
    cursor.execute("SELECT Id FROM Workers")
    worker_ids = [row[0] for row in cursor.fetchall()]

    # Insert data into the Tickets table
    ticket_values = [(ticket['Id'], random.choice(worker_ids), ticket['RouteId'], ticket['IssueDate'], ticket['ExpiryDate']) for ticket in tickets]
    cursor.executemany("INSERT INTO Tickets (Id, WorkerId, RouteId, IssueDate, ExpiryDate) VALUES (%s, %s, %s, %s, %s)", ticket_values)
    connection.commit()
    print(f"Data inserted into Tickets table. Affected rows: {cursor.rowcount}")

    # Insert data into the Drivers table
    driver_values = [(driver['Id'], driver['CompanyId'], driver['RouteId'], driver['Name'], driver['LicenseNumber']) for driver in drivers]
    cursor.executemany("INSERT INTO Drivers (Id, CompanyId, RouteId, Name, LicenseNumber) VALUES (%s, %s, %s, %s, %s)", driver_values)
    connection.commit()
    print(f"Data inserted into Drivers table. Affected rows: {cursor.rowcount}")

    # Insert data into the Passengers table
    passenger_values = [(passenger['Id'], passenger['WorkerId'], passenger['TicketId'], passenger['BoardingStatus'], passenger['RouteId'], passenger['CompanyId'], passenger['DriverId']) for passenger in passengers]
    cursor.executemany("INSERT INTO Passengers (Id, WorkerId, TicketId, BoardingStatus, RouteId, CompanyId, DriverId) VALUES (%s, %s, %s, %s, %s, %s, %s)", passenger_values)
    connection.commit()
    print(f"Data inserted into Passengers table. Affected rows: {cursor.rowcount}")

    print("Data insertion complete.")
    cursor.close()
    connection.close()

# Call the insert_data function to insert the generated data
insert_data()
