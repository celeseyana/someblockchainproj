import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection configuration
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "blockchain",
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database!");
  }
});

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Backend server is working!" });
});

// **SIGNUP ENDPOINT** - For user registration
app.post("/signup", (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: "Username and password are required",
    });
  }

  // Check if user already exists
  const checkUserQuery = "SELECT * FROM users WHERE username = ?";
  db.query(checkUserQuery, [username], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Database error",
        details: err,
      });
    }

    if (results.length > 0) {
      return res.status(400).json({
        error: "Username already exists",
      });
    }

    // Insert new user
    const insertQuery =
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
    const values = [username, password, role || "customer"];

    db.query(insertQuery, values, (err, results) => {
      if (err) {
        return res.status(500).json({
          error: "Failed to create user",
          details: err,
        });
      }

      res.status(201).json({
        message: "User registered successfully!",
        userId: results.insertId,
        username: username,
      });
    });
  });
});

// **LOGIN ENDPOINT** - For user authentication
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: "Username and password are required",
    });
  }

  const query = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(query, [username, password], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Database error",
        details: err,
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        error: "Invalid username or password",
      });
    }

    const user = results[0];
    res.json({
      message: "Login successful!",
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  });
});

// Test database route
app.get("/test-db", (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Database query failed", details: err });
    } else {
      res.json({ message: "Database connected successfully!", users: results });
    }
  });
});

app.listen(3000, () => {
  console.log("Server listening on port 8081...");
});
