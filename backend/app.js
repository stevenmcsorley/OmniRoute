const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: "db",
  user: "root",
  password: "password",
  database: "AllSeeingEye",
});

// Default route
app.get("/", (req, res) => {
  console.log("transport api");
  res.send("transport api");
});

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

app.listen(3001, () => {
  console.log("EXPRESS listening on port 3001");
});
