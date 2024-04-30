const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const cors = require("cors");
const { ApolloServer } = require('apollo-server-express');
const { PubSub } = require('graphql-subscriptions');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const http = require('http');

const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create MySQL connection pool
const pool = mysql.createPool({
  host: "db",
  user: "root",
  password: "password",
  database: "AllSeeingEye",
});

// Create a new instance of PubSub
const pubsub = new PubSub();

// Create HTTP server for Express
const httpServer = http.createServer(app);

// Define GraphQL schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Initialize Apollo Server with the GraphQL schema
const server = new ApolloServer({
  schema,
  context: ({ req }) => ({ req, pubsub })  // Pass pubsub instance to resolvers via context
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });  // Apply Apollo middleware to the Express app

  // Setup WebSocket server for subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql'
  });

  useServer({
    schema,
    context: async (ctx, msg, args) => {
      // Construct and return the context object for WebSocket operations
      // Include the `pubsub` instance and any other necessary context information
      return { pubsub };
    },
    onConnect: (ctx) => {
      console.log('Client connected for subscriptions');
    },
    onDisconnect: (ctx, code, reason) => {
      console.log('Client disconnected from subscriptions');
    },
  }, wsServer);

  // Define RESTful routes
  app.get("/", (req, res) => res.send("API is running..."));

// Passenger App Endpoints
app.post("/api/worker/login", async (req, res) => {
  try {
    const { workerId } = req.body;

    if (!workerId) {
      return res.status(400).json({ error: "Missing workerId field in request body." });
    }

    const connection = await pool.getConnection();
    const [worker] = await connection.query("SELECT * FROM Workers WHERE Id = ?", [workerId]);

    if (!worker.length) {
      connection.release();
      return res.status(404).json({ error: "Worker not found." });
    }

    const companyId = worker[0].CompanyId;
    const [company] = await connection.query("SELECT * FROM Companies WHERE Id = ?", [companyId]);

    connection.release();

    // Perform additional checks or validations if needed

    res.status(200).json({ message: "Worker login successful." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred during worker login." });
  }
});



app.get("/api/worker/routes", async (req, res) => {
  try {
    const { workerId } = req.query;

    if (!workerId) {
      return res.status(400).json({ error: "Missing workerId query parameter." });
    }

    const connection = await pool.getConnection();
    const [worker] = await connection.query("SELECT * FROM Workers WHERE Id = ?", [workerId]);

    if (!worker.length) {
      connection.release();
      return res.status(404).json({ error: "Worker not found." });
    }

    const companyId = worker[0].CompanyId;
    const [routes] = await connection.query("SELECT * FROM Routes WHERE CompanyId IN (SELECT CompanyId FROM Workers WHERE Id = ?)", [workerId]);

    connection.release();

    res.status(200).json(routes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching routes." });
  }
});



app.post("/api/worker/book", async (req, res) => {
  try {
    const { workerId, routeId } = req.body;

    if (!workerId || !routeId) {
      return res.status(400).json({ error: "Missing workerId or routeId field in request body." });
    }

    const connection = await pool.getConnection();

    // Check if worker exists
    const [worker] = await connection.query("SELECT * FROM Workers WHERE Id = ?", [workerId]);
    if (!worker.length) {
      connection.release();
      return res.status(404).json({ error: "Worker not found." });
    }

    // Check if route exists
    const [route] = await connection.query("SELECT * FROM Routes WHERE Id = ?", [routeId]);
    if (!route.length) {
      connection.release();
      return res.status(404).json({ error: "Route not found." });
    }

    // Generate ticket for the worker and route
    const ticket = {
      WorkerId: workerId,
      RouteId: routeId,
      // Add other ticket details as needed
    };

    const [result] = await connection.query("INSERT INTO Tickets SET ?", ticket);
    connection.release();

    res.status(200).json({ message: "Booking successful.", ticketId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred during booking." });
  }
});


app.get("/api/worker/bookings", async (req, res) => {
  try {
    const { workerId } = req.query;

    if (!workerId) {
      return res.status(400).json({ error: "Missing workerId parameter." });
    }

    const connection = await pool.getConnection();
    const [bookings] = await connection.query(
      "SELECT * FROM Tickets WHERE WorkerId = ?",
      [workerId]
    );
    connection.release();

    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching bookings." });
  }
});


app.get("/api/worker/details", async (req, res) => {
  try {
    const { workerId } = req.query;

    if (!workerId) {
      return res.status(400).json({ error: "Missing workerId query parameter." });
    }

    const connection = await pool.getConnection();
    const [worker] = await connection.query("SELECT * FROM Workers WHERE Id = ?", [workerId]);

    if (!worker.length) {
      connection.release();
      return res.status(404).json({ error: "Worker not found." });
    }

    const companyId = worker[0].CompanyId;
    const [company] = await connection.query("SELECT * FROM Companies WHERE Id = ?", [companyId]);

    connection.release();

    res.status(200).json({ worker: worker[0], company: company[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching worker details." });
  }
});



app.get("/api/passenger/qr-code", async (req, res) => {
  try {
    const { bookingId } = req.query;
    // Retrieve the QR code for the booking ID
    // ...

    res.status(200).json({ qrCode: qrCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching the QR code." });
  }
});

// Driver App Endpoints
app.post("/api/driver/login", async (req, res) => {
  try {
    const { driverId } = req.body;
    // Perform driver login logic here
    // ...

    res.status(200).json({ message: "Driver login successful." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred during driver login." });
  }
});

app.get("/api/driver/routes", async (req, res) => {
  try {
    const { driverId } = req.query;
    // Retrieve and return routes assigned to the driver's company
    // ...

    res.status(200).json(routes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching routes." });
  }
});

app.get("/api/driver/passengers", async (req, res) => {
  try {
    const { routeId } = req.query;
    // Retrieve and return passengers who have booked tickets for the route
    // ...

    res.status(200).json(passengers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching passengers." });
  }
});

app.post("/api/driver/scan-qr-code", async (req, res) => {
  try {
    const { qrCode } = req.body;
    // Scan the QR code and update passenger's boarding status
    // ...

    res.status(200).json({ message: "QR code scanned successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while scanning the QR code." });
  }
});

//// new endpoints

// API endpoint to handle driver login
app.post("/api/employee/login", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email field is required." });
  }

  const connection = await pool.getConnection();
  try {
    const [employee] = await connection.query("SELECT * FROM Employees WHERE Email = ?", [email]);
    if (employee.length === 0) {
      connection.release();
      return res.status(404).json({ error: "Employee not found." });
    }

    // Ensure the employee is authorized as a driver
    if (employee[0].Role !== 'Driver') {
      connection.release();
      return res.status(403).json({ error: "Unauthorized: Only drivers can access this endpoint." });
    }

    connection.release();
    res.status(200).json({ message: "Login successful.", employee: employee[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "An error occurred during login." });
  } finally {
    connection.release();
  }
});

// Fetch details for a single employee
app.get("/api/employee/details/:employeeId", async (req, res) => {
  const { employeeId } = req.params;
  if (!employeeId) {
    return res.status(400).json({ error: "Employee ID is required." });
  }
  
  const connection = await pool.getConnection();
  try {
    const [employees] = await connection.query("SELECT * FROM Employees WHERE Id = ?", [employeeId]);
    if (employees.length === 0) {
      connection.release();
      return res.status(404).json({ error: "Employee not found." });
    }
    
    res.json(employees[0]);  // Return the first (and should be only) employee record
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching employee details." });
  } finally {
    connection.release();
  }
});

// Fetch all routes assigned to an employee (if roles apply, you might need to check employee's role first)
app.get("/api/employee/routes/:employeeId", async (req, res) => {
  const { employeeId } = req.params;

  const connection = await pool.getConnection();
  try {
    const [routes] = await connection.query(`
      SELECT r.* FROM Routes r
      JOIN Assignments a ON r.Id = a.ResourceId
      WHERE a.EmployeeId = ?
    `, [employeeId]);
    
    res.json(routes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching routes." });
  } finally {
    connection.release();
  }
});

// Assign an employee to a route
app.post("/api/employee/routes/signup", async (req, res) => {
  const { employeeId, routeId } = req.body;
  if (!employeeId || !routeId) {
    return res.status(400).json({ error: "Employee ID and Route ID are required." });
  }

  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query("INSERT INTO Assignments (EmployeeId, ResourceId, StartTime, Status) VALUES (?, ?, NOW(), 'Scheduled')", [employeeId, routeId]);
    if (result.affectedRows === 0) {
      throw new Error("Failed to assign route.");
    }

    res.status(200).json({ message: "Successfully signed up for route." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "An error occurred during signup." });
  } finally {
    connection.release();
  }
});

// Withdraw an employee from a route
app.delete("/api/employee/routes/withdraw", async (req, res) => {
  const { employeeId, routeId } = req.body;
  if (!employeeId || !routeId) {
    return res.status(400).json({ error: "Employee ID and Route ID are required." });
  }

  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query("DELETE FROM Assignments WHERE EmployeeId = ? AND ResourceId = ?", [employeeId, routeId]);
    if (result.affectedRows === 0) {
      throw new Error("No assignment found or withdrawal failed.");
    }

    res.status(200).json({ message: "Successfully withdrawn from route." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "An error occurred during withdrawal." });
  } finally {
    connection.release();
  }
});

///// new endpoints end


app.get("/api/employee/resources/:employeeId", async (req, res) => {
  const { employeeId } = req.params;

  const connection = await pool.getConnection();
  try {
    const [resources] = await connection.query(`
      SELECT Resources.* FROM Resources
      JOIN Assignments ON Resources.Id = Assignments.ResourceId
      WHERE Assignments.EmployeeId = ? AND Resources.Type = 'Vehicle'
    `, [employeeId]);
    
    res.json(resources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching resources." });
  } finally {
    connection.release();
  }
});

app.post("/api/employee/resources/signup", async (req, res) => {
  const { employeeId, resourceId } = req.body;
  if (!employeeId || !resourceId) {
    return res.status(400).json({ error: "Employee ID and Resource ID are required." });
  }

  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query("INSERT INTO Assignments (EmployeeId, ResourceId, StartTime, Status) VALUES (?, ?, NOW(), 'Scheduled')", [employeeId, resourceId]);
    if (result.affectedRows === 0) {
      throw new Error("Failed to assign resource.");
    }

    res.status(200).json({ message: "Successfully signed up for resource." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "An error occurred during signup." });
  } finally {
    connection.release();
  }
});


// Withdraw an employee from a resource
app.delete("/api/employee/resources/withdraw", async (req, res) => {
  const { employeeId, resourceId } = req.body; // Expect employeeId and resourceId to be provided in the request body

  if (!employeeId || !resourceId) {
    return res.status(400).json({ error: "Both Employee ID and Resource ID are required." });
  }

  const connection = await pool.getConnection();
  try {
    // Execute a DELETE query to remove the assignment
    const [result] = await connection.query("DELETE FROM Assignments WHERE EmployeeId = ? AND ResourceId = ?", [employeeId, resourceId]);
    if (result.affectedRows === 0) {
      // If no rows were affected, no assignment was found with the given criteria
      throw new Error("No assignment found or withdrawal failed.");
    }

    // Respond with a success message if the deletion was successful
    res.status(200).json({ message: "Successfully withdrawn from resource." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "An error occurred during withdrawal." });
  } finally {
    connection.release(); // Always release the connection
  }
});


////////////////////////////////////////////

// Employee Login
// app.post("/api/employee/login", async (req, res) => {
//   const { email } = req.body;
//   if (!email) {
//     return res.status(400).json({ error: "Email field is required." });
//   }
//   const connection = await pool.getConnection();
//   try {
//     const [employees] = await connection.query("SELECT * FROM Employees WHERE Email = ?", [email]);
//     if (employees.length === 0) {
//       connection.release();
//       return res.status(404).json({ error: "Employee not found." });
//     }
//     const employee = employees[0];
//     connection.release();
//     res.status(200).json({ message: "Login successful.", employee });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message || "An error occurred during login." });
//   } finally {
//     connection.release();
//   }
// });

// API to get all assignments for a company
app.get("/api/assignments/:companyId", async (req, res) => {
  const { companyId } = req.params;
  const connection = await pool.getConnection();
  try {
    const [assignments] = await connection.query("SELECT * FROM Assignments WHERE companyId = ?", [companyId]);
    res.json(assignments);
  } catch (error) {
    console.error("SQL Error: ", error);
    res.status(500).json({ success: false, message: "Internal server error: " + error.message });
  } finally {
    connection.release();
  }
});

// API to assign an employee to an assignment
app.post("/api/assignments/assign", async (req, res) => {
  const { assignmentId, employeeId } = req.body;
  const connection = await pool.getConnection();
  try {
    await connection.query("UPDATE Assignments SET EmployeeId = ?, Status = 'Active' WHERE AssignmentId = ?", [employeeId, assignmentId]);
    res.json({ success: true, message: "Assignment successful" });
  } catch (error) {
    console.error("SQL Error: ", error);
    res.status(500).json({ success: false, message: "Internal server error: " + error.message });
  } finally {
    connection.release();
  }
});

// API to withdraw an employee from an assignment
app.delete("/api/assignments/withdraw", async (req, res) => {
  const { assignmentId } = req.body;
  const connection = await pool.getConnection();
  try {
    await connection.query("UPDATE Assignments SET EmployeeId = NULL, Status = 'Cancelled' WHERE AssignmentId = ?", [assignmentId]);
    res.json({ success: true, message: "Withdrawal successful" });
  } catch (error) {
    console.error("SQL Error: ", error);
    res.status(500).json({ success: false, message: "Internal server error: " + error.message });
  } finally {
    connection.release();
  }
});





///new endpoints for admin

// Endpoint to count employees
app.get("/api/employees/count", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query("SELECT COUNT(*) AS count FROM Employees");
    res.json(result[0]); // Return the count directly
  } catch (error) {
    console.error("Error fetching employee count:", error);
    res.status(500).json({ error: "Internal server error while fetching employee count" });
  } finally {
    connection.release();
  }
});

// Endpoint to count resources
app.get("/api/resources/count", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query("SELECT COUNT(*) AS count FROM Resources");
    res.json(result[0]); // Return the count directly
  } catch (error) {
    console.error("Error fetching resource count:", error);
    res.status(500).json({ error: "Internal server error while fetching resource count" });
  } finally {
    connection.release();
  }
});

// Endpoint to count assignments
app.get("/api/assignments/count", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query("SELECT COUNT(*) AS count FROM Assignments");
    res.json(result[0]); // Return the count directly
  } catch (error) {
    console.error("Error fetching assignment count:", error);
    res.status(500).json({ error: "Internal server error while fetching assignment count" });
  } finally {
    connection.release();
  }
});

// Endpoint to count reservations
app.get("/api/reservations/count", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query("SELECT COUNT(*) AS count FROM Reservations");
    res.json(result[0]); // Return the count directly
  } catch (error) {
    console.error("Error fetching reservation count:", error);
    res.status(500).json({ error: "Internal server error while fetching reservation count" });
  } finally {
    connection.release();
  }
});

app.get("/api/resources/all", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [resources] = await connection.query("SELECT * FROM Resources");
    res.json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ error: "An error occurred while fetching resources." });
  } finally {
    connection.release();
  }
});

app.get("/api/employees", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [employees] = await connection.query("SELECT * FROM Employees");
    connection.release();
    res.json(employees);
  } catch (error) {
    console.error("Failed to fetch employees:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

  // Start the HTTP server
  httpServer.listen({ port: 4000 }, () => {
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
    console.log(`Subscriptions ready at ws://localhost:4000/graphql`);
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
});