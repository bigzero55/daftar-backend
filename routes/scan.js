const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.post("/validasi", (req, res) => {
  const { participant_id, validator_id, session_id } = req.body;
  const scanTime = Date.now();
  const checkQuery = `
    SELECT * FROM Scanned 
    WHERE participant_id = ? AND session_id = ?
  `;

  db.get(checkQuery, [participant_id, session_id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (row) {
      res.status(400).json({
        message: "Participant has already been scanned in this session",
      });
    } else {
      const insertQuery = `
        INSERT INTO Scanned (scanTime, participant_id, validator_id, session_id)
        VALUES (?, ?, ?, ?)
      `;
      db.run(
        insertQuery,
        [scanTime, participant_id, validator_id, session_id],
        function (err) {
          if (err) {
            res.status(400).json({ error: err.message });
            return;
          }
          res.json({
            message: "Scan successfully recorded",
            scanId: this.lastID,
          });
        }
      );
    }
  });
});

module.exports = router;
