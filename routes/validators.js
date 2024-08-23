// Import Express Router dan Database
const express = require("express");
const router = express.Router();
const db = require("../db/db");

// Endpoint untuk mendapatkan semua Validators
router.get("/", (req, res) => {
  const sql = "SELECT * FROM Validators";
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

// Endpoint untuk menambahkan Validator baru
router.post("/", (req, res) => {
  const { name, participant_id } = req.body;

  const checkSql = `SELECT * FROM Validators WHERE name = ? AND participant_id = ?`;
  const checkParams = [name, participant_id];

  db.get(checkSql, checkParams, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    if (row) {
      res.status(400).json({
        error: "Data with the same name and participant_id already exists.",
      });
      return;
    }

    const sql = `INSERT INTO Validators (name, participant_id) VALUES (?,?)`;
    const params = [name, participant_id];

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
});

// Endpoint untuk update Validator berdasarkan id
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, participant_id } = req.body;
  const sql = `UPDATE Validators SET name = ?, participant_id = ? WHERE id = ?`;
  const params = [name, participant_id, id];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: { id: id, changes: this.changes },
    });
  });
});

// Endpoint untuk menghapus Validator berdasarkan id
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM Validators WHERE id = ?`;

  db.run(sql, id, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: { id: id, changes: this.changes },
    });
  });
});

// Endpoint untuk mencari Validator berdasarkan participant_id
router.get("/search/:participant_id", (req, res) => {
  const { participant_id } = req.params;
  const sql = "SELECT * FROM Validators WHERE participant_id = ?";
  const params = [participant_id];

  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: "Validator not found" });
      return;
    }
    res.json({
      message: "success",
      data: row,
    });
  });
});

module.exports = router;
