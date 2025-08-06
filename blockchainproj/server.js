import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"], // allow React frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: false, // set to true only if using cookies/sessions
  })
);

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
      const user = {
        id: data[0].id,
        username: data[0].username,
        role: data[0].role,
      };
      return res.json({
        status: "Success",
        message: "Login successful",
        user: user,
      });
    }
  });
});

app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});
