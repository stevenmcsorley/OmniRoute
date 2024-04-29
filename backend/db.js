const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: "db",
  user: "root",
  password: "password",
  database: "AllSeeingEye",
});

async function fetchAssignments(companyId) {
  const [assignments] = await pool.query(
    `SELECT * FROM Assignments JOIN Resources ON Assignments.ResourceId = Resources.Id WHERE Resources.CompanyId = ?`,
    [companyId]
  );
  return assignments;
}

async function updateAssignmentStatus(Id, Status) {
  const [result] = await pool.execute(
    `UPDATE Assignments SET Status = ? WHERE Id = ?`,
    [Status, Id]
  );
  if (result.affectedRows > 0) {
    const [updatedAssignments] = await pool.query(`SELECT * FROM Assignments WHERE Id = ?`, [Id]);
    return updatedAssignments[0];
  } else {
    throw new Error('Assignment update failed');
  }
}

module.exports = { fetchAssignments, updateAssignmentStatus };