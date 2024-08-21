const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.post("/", (req, res) => {
const { paticipant_id, validator_id, session_id } = req.body;
  const scanTime = Date.now();

  const query = `INSERT INTO Scanned (scanTime, paticipant_id, validator_id, session_id)
                 VALUES (?, ?, ?, ?)`;
  db.run(query, [scanTime, paticipant_id, validator_id, session_id], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: "Scan successfully recorded", scanId: this.lastID });
  });
})

router.post("/validasi", (req, res) => {
  const { paticipant_id, validator_id, session_id } = req.body;
  const scanTime = Date.now();
  const checkQuery = `
    SELECT * FROM Scanned 
    WHERE paticipant_id = ? AND session_id = ?
  `;

  db.get(checkQuery, [paticipant_id, session_id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (row) {
      res.status(400).json({ message: "Participant has already been scanned in this session" });
    } else {
      const insertQuery = `
        INSERT INTO Scanned (scanTime, paticipant_id, validator_id, session_id)
        VALUES (?, ?, ?, ?)
      `;
      db.run(insertQuery, [scanTime, paticipant_id, validator_id, session_id], function (err) {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        res.json({ message: "Scan successfully recorded", scanId: this.lastID });
      });
    }
  });
});

module.exports = router;