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
  const sql = "SELECT * FROM Sessions WHERE id = ?";
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

router.get("/unix/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM Sessions WHERE unix = ?";
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
    SELECT p.name, p.city, p.phone, p.role, s.name AS session_name, sc.scanTime, v.name AS validator_name
        FROM Participants p
        JOIN Scanned sc ON p.id = sc.participant_id
        JOIN Sessions s ON sc.session_id = s.id
        LEFT JOIN Validators v ON sc.validator_id = v.id
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
    SELECT p.name, p.city, p.phone, p.role
    FROM Participants p
    WHERE p.id NOT IN (
      SELECT sc.participant_id
      FROM Scanned sc
      JOIN Sessions s ON sc.session_id = s.id
      WHERE s.unix = ?
    )
  `;
  db.all(query, [sessionUnix], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
      I;
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

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, desc } = req.body;
  const sql = `UPDATE Sessions SET name = ?, desc = ? WHERE id = ?`;
  const params = [name, desc, id];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    if (this.changes === 0) {
      res.status(404).json({ message: "Session not found" });
      return;
    }

    res.json({
      message: "success",
      data: { id: id, changes: this.changes },
    });
  });
});

router.delete("/:id", (req, res) => {
  const sessionId = req.params.id;

  // Mulai transaksi
  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    // Hapus data dari tabel Scanned berdasarkan session_id
    db.run(
      `DELETE FROM Scanned WHERE session_id = ?`,
      [sessionId],
      function (err) {
        if (err) {
          db.run("ROLLBACK");
          return res.status(500).json({ error: err.message });
        }

        // Hapus data dari tabel Sessions berdasarkan id
        db.run(
          `DELETE FROM Sessions WHERE id = ?`,
          [sessionId],
          function (err) {
            if (err) {
              db.run("ROLLBACK");
              return res.status(500).json({ error: err.message });
            }

            // Commit transaksi
            db.run("COMMIT", (err) => {
              if (err) {
                return res.status(500).json({ error: err.message });
              }
              res.json({
                message: `Session dengan id ${sessionId} dan data Scanned terkait telah dihapus.`,
              });
            });
          }
        );
      }
    );
  });
});

module.exports = router;
