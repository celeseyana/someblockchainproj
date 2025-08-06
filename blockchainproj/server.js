import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
const bcrypt = require("bcrypt");


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


app.post("/signup", async (req, res) => {
  console.log("Signup Body:", req.body);

  const { username, password, role } = req.body;

  try {
    // Hash the password before storing it
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
    const values = [username, hashedPassword, role];

    db.query(sql, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res
        .status(200)
        .json({ message: "Signup successful", userId: data.insertId });
    });
  } catch (err) {
    console.error("Password hashing failed:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});


app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], async (err, data) => {
    if (err) return res.status(500).json({ message: "Server error" });

    if (data.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const storedHashedPassword = data[0].password;

    try {
      const passwordMatch = await bcrypt.compare(password, storedHashedPassword);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Incorrect password" });
      }

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
    } catch (err) {
      console.error("Password comparison failed:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
});

app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});
