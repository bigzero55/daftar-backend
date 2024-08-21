const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.get("/", (req, res) => {
  const sql = "SELECT * FROM Participants";
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
      res.status(404).json({ message: "Participant not found" });
      return;
    }
    res.json({
      message: "success",
      data: row,
    });
  });
});

router.get("/search/:key", (req, res) => {
  const { key } = req.params;
  const sql = `
    SELECT * FROM Participants 
    WHERE 
        name LIKE '%' || ? || '%' OR 
        motif LIKE '%' || ? || '%' OR 
        motif_code = ? OR 
        seri LIKE '%' || ? || '%'
  `;
  const params = [key, key, key, key];

  db.all(sql, params, (err, rows) => {
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
  const {
    unix,
    transportation,
    name,
    city,
    regTime,
    status,
    shirtSize,
    role,
    cekIn,
    phone,
  } = req.body;
  const sql = `INSERT INTO Participants ( unix,
    transportation,
    name,
    city,
    regTime,
    status,
    shirtSize,
    role,
    cekIn,
    phone) VALUES (?,?,?,?,?,?,?,?,?,?)`;
  const params = [
    unix,
    transportation,
    name,
    city,
    regTime,
    status,
    shirtSize,
    role,
    cekIn,
    phone,
  ];
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

  router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM Participants WHERE id = ?";
    db.run(sql, id, function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "deleted",
        data: { id: id },
      });
    });
  });
});

module.exports = router;
