const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: "db",
  user: "root",
  password: "password",
  database: "AllSeeingEye",
});

async function fetchAssignments(companyId) {
  const [rows] = await pool.query(`SELECT * FROM Assignments WHERE CompanyId = ?`, [companyId]);
  return rows;
}

module.exports = { fetchAssignments };
