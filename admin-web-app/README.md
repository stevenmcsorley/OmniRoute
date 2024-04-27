# Real time events and data updates on the dashboard

The key elements you would expect to see change on the dashboard, given the described business logic and database schema:

Active Routes:
Total number of routes currently having an assigned driver, indicating they are 'active'.
Live updates as drivers assign themselves to routes or remove themselves from routes.
Available Routes (for workers in the Passenger app):
All routes should be listed, indicating they are available for workers to choose and book a ticket.
The list updates as new routes are added or existing ones are modified.
Passenger Count:
For each active route, a count of currently boarded passengers.
The count increases as workers board the bus (scan their QR code) and decreases as they leave.
Ticket Bookings:
The number of tickets booked for each route.
Live updates as workers book or cancel tickets.
Active Drivers:
The number of drivers currently assigned to routes.
Updates as drivers assign themselves to routes or unassign themselves.
Workers' Status:
Workers transition from just being workers to being passengers once they board a bus. They transition back to workers when they leave the bus.
Real-time status updates as workers board and leave buses.
Bus Occupancy:
The occupancy level of each bus on active routes.
Adjusts dynamically as passengers board and disembark.
Route Details:
The detailed status of each route, including assigned driver, list of passengers, and the bus being used.