require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cron = require("node-cron");
const Task = require("./models/Task");
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS setup — allow frontend and local dev
const allowedOrigins = [
  "http://localhost:3000", // local React dev
  "https://tracker-frontend-5j3q.onrender.com", // ← replace with your actual frontend Render URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Auto-create default users
const createDefaultUsers = async () => {
  const defaultUsers = [
    { username: "Apple", password: "apple123" },
    { username: "Banana", password: "banana123" }
  ];
  for (const userData of defaultUsers) {
    const existingUser = await User.findOne({ username: userData.username });
    if (!existingUser) {
      const newUser = new User(userData);
      await newUser.save();
      console.log(`✅ Created default user: ${userData.username}`);
    }
  }
};

mongoose.connection.once("open", () => {
  createDefaultUsers().catch(err => console.error(err));
});

// ✅ Auth endpoints
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "User not found" });
    if (user.password !== password) return res.status(400).json({ error: "Incorrect password" });
    res.json({ username });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/change-password", async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "User not found" });
    if (user.password !== oldPassword) return res.status(400).json({ error: "Old password incorrect" });

    user.password = newPassword;
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Task endpoints
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

app.post("/tasks", async (req, res) => {
  const { text } = req.body;
  try {
    const task = new Task({ text });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to add task" });
  }
});

app.put("/tasks/:id", async (req, res) => {
  const { username } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (!["Apple", "Banana"].includes(username)) {
      return res.status(400).json({ error: "Invalid user" });
    }

    task[`${username}Done`] = !task[`${username}Done`];
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to toggle task" });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// ✅ Daily reset for checkboxes at midnight UTC
cron.schedule("0 0 * * *", async () => {
  console.log("♻ Resetting checkboxes for all tasks...");
  try {
    await Task.updateMany({}, { AppleDone: false, BananaDone: false });
    console.log("✅ All checkboxes reset");
  } catch (err) {
    console.error("❌ Failed to reset checkboxes:", err);
  }
});

// ✅ Default route for Render health check
app.get("/", (req, res) => res.send("✅ Tracker backend is running!"));

// ✅ Start server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
