const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();

const db = new sqlite3.Database(path.join(__dirname, 'courses.db'));
app.use(cors());

app.get("/courses", (req, res) => {
  let sql = "SELECT DISTINCT \"Department Name\" FROM courses_cleaned";
  db.all(sql, (err, rows) => {
    if (err) {
      res.json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get("/all", (req, res) => {
  db.all("SELECT * FROM courses_cleaned", (err, rows) => {
    if (err) { 
      res.json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});
  
app.listen(8080, () => {
  console.log('server listening on http://localhost:8080')
})