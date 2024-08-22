const express = require("express");
const router = express.Router();
const db = require("../db/db");

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

router.post("/", (req, res) => {
  const { name, participant_id } = req.body;
  const sql = `INSERT INTO Validators (name,participant_id ) VALUES (?,?)`;
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

module.exports = router;
