const sqlite3 = require("sqlite3").verbose();

const DBSOURCE = "db/database.db";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log("Database Terkoneksi dengan baik");

    db.run(
      `CREATE TABLE IF NOT EXISTS Participants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        unix TEXT NOT NULL,
        transportation TEXT NOT NULL,
        name TEXT NOT NULL,
        city TEXT NOT NULL,
        regTime INTEGER NOT NULL,
        status TEXT NOT NULL,
        shirtSize TEXT NOT NULL,
        role TEXT NOT NULL,
        cekIn,
        phone TEXT NOT NULL)`,
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS Sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                unix TEXT NOT NULL,
                name TEXT NOT NULL,
                desc TEXT NOT NULL
            )`,
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS Validators (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                participant_id INTEGER,
                FOREIGN KEY(participant_id) REFERENCES Participants(id)
            )`,
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS Scanned (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                scanTime INTEGER NOT NULL,
                participant_id INTEGER,
                validator_id INTEGER,
                session_id INTEGER,
                FOREIGN KEY(participant_id) REFERENCES Participants(id),
        FOREIGN KEY(validator_id) REFERENCES Validator(id),
        FOREIGN KEY(session_id) REFERENCES Sessions(id)
            )`,
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
  }
});

module.exports = db;
