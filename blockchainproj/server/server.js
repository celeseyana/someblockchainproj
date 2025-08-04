import express from "express";
import mysql from "mysql";

const app = express();

// ✅ JSON parsing only — no CORS
app.use(express.json());

// ✅ Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "blockchain",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to database.");
});

// ✅ Routes
app.post("/signup", (req, res) => {
  console.log("Signup Body:", req.body);
  const sql = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
  const values = [req.body.username, req.body.password, req.body.role];
  db.query(sql, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res
      .status(200)
      .json({ message: "Signup successful", userId: data.insertId });
  });
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(sql, [req.body.username, req.body.password], (err, data) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (data.length > 0) {
      return res.json({ status: "Success" });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  });
});

app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});
