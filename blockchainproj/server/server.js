import express from "express";
import mysql from "mysql";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST, GET"],
    credentials: true,
  })
);

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

// celes
app.post("/signup", (req, res) => {
  console.log(req.body);
  const sql = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
  const values = [req.body.username, req.body.password, req.body.role];
  db.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// celes
app.post("/login", (req, res) => {
  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(sql, [req.body.username, req.body.password], (err, data) => {
    if (err) return res.json({ Message: "Server Side Error knock knock mf" });
    if (data.length > 0) {
      return res.json({ Status: "Success" });
    } else {
      return res.json({ Message: "dawg u r not in here mane" });
    }
  });
});

app.listen(8081, () => {
  console.log("server running");
});
