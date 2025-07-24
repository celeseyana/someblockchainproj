import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();

// Middleware - CORS configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"], // Allow both Vite and CRA default ports
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
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
    console.log("Connected to MySQL database 'blockchain'!");
  }
});

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Backend server is working!" });
});

// **SIGNUP ENDPOINT** - For user registration
app.post("/signup", (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({
      error: "Username, password, and role are required",
    });
  }

  // Check if user already exists
  const checkUserQuery = "SELECT * FROM users WHERE username = ?";
  db.query(checkUserQuery, [username], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        error: "Database error",
        details: err.message,
      });
    }

    if (results.length > 0) {
      return res.status(400).json({
        error: "Username already exists",
      });
    }

    // Insert new user (note: using user_id as the column name)
    const insertQuery =
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
    const values = [username, password, role];

    db.query(insertQuery, values, (err, results) => {
      if (err) {
        console.error("Insert error:", err);
        return res.status(500).json({
          error: "Failed to create user",
          details: err.message,
        });
      }

      res.status(201).json({
        message: "User registered successfully!",
        userId: results.insertId,
        user: {
          user_id: results.insertId,
          username: username,
          role: role,
        },
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

  const query =
    "SELECT user_id, username, password, role FROM users WHERE username = ? AND password = ?";
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        error: "Database error",
        details: err.message,
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
        user_id: user.user_id,
        username: user.username,
        role: user.role,
      },
    });
  });
});

// Test database route
app.get("/test-db", (req, res) => {
  const query = "SELECT user_id, username, role FROM users";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({
        error: "Database query failed",
        details: err.message,
      });
    } else {
      res.json({
        message: "Database connected successfully!",
        users: results,
      });
    }
  });
});

// Get all users (for testing purposes)
app.get("/users", (req, res) => {
  const query = "SELECT user_id, username, role FROM users";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({
        error: "Failed to fetch users",
        details: err.message,
      });
    } else {
      res.json(results);
    }
  });
});

app.listen(8081, () => {
  console.log("Server listening on port 8081...");
});
