const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.get("/", (req, res) => {
  const sql = "SELECT * FROM Sessions";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM Partcipants WHERE id = ?";
  const params = [id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ message: "Session not found" });
      return;
    }
    res.json({
      message: "success",
      data: row,
    });
  });
});

router.get("/:session_unix/scanned", (req, res) => {
  const sessionUnix = req.params.session_unix;
  const query = `
    SELECT p.name, s.name AS session_name, sc.scanTime
    FROM Participants p
    JOIN Scanned sc ON p.id = sc.paticipant_id
    JOIN Sessions s ON sc.session_id = s.id
    WHERE s.unix = ?
  `;
  db.all(query, [sessionUnix], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

router.get("/:session_unix/not-scanned", (req, res) => {
  const sessionUnix = req.params.session_unix;
  const query = `
    SELECT p.name
    FROM Participants p
    WHERE p.id NOT IN (
      SELECT sc.paticipant_id
      FROM Scanned sc
      JOIN Sessions s ON sc.session_id = s.id
      WHERE s.unix = ?
    )
  `;
  db.all(query, [sessionUnix], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;I
    }
    res.json(rows);
  });
});

router.post("/", (req, res) => {
  const { unix, name, desc } = req.body;
  const sql = `INSERT INTO Sessions (unix, name, desc) VALUES (?,?,?)`;
  const params = [unix, name, desc];
  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: { id: this.lastID },
    });
  });
});

module.exports = router; 