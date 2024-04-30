const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: "db",
  user: "root",
  password: "password",
  database: "AllSeeingEye",
});

async function fetchAssignments(companyId) {
  const [assignments] = await pool.query(
    `SELECT * FROM Assignments WHERE CompanyId = ?`,
    [companyId]
  );
  return assignments;
}

async function updateAssignmentStatus(AssignmentId, status, CompanyId) {
  if (AssignmentId === undefined || status === undefined || CompanyId === undefined) {
    throw new Error('All parameters must be defined');
  }

  // Proceed with the update if all parameters are defined
  const [result] = await pool.execute(
    `UPDATE Assignments SET Status = ? WHERE AssignmentId = ? AND CompanyId = ?`,
    [status, AssignmentId, CompanyId]
  );
  if (result.affectedRows > 0) {
    const [updatedAssignments] = await pool.query(
      `SELECT * FROM Assignments WHERE AssignmentId = ? AND CompanyId = ?`,
      [AssignmentId, CompanyId]
    );
    return updatedAssignments[0];
  } else {
    throw new Error('No such assignment found for the given company, or update failed.');
  }
}




module.exports = { fetchAssignments, updateAssignmentStatus };