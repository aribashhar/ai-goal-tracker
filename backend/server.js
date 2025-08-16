// backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Endpoint to generate schedule using Hugging Face LLM
app.post("/api/suggest-schedule", async (req, res) => {
  try {
    const { classes, goals } = req.body;

    // Build prompt for AI (for future integration)
    const prompt = `
You are a helpful assistant that plans a student's day.
These are the blocked times for classes: ${JSON.stringify(classes)}.
These are the tasks to schedule: ${JSON.stringify(goals)}.
Suggest a schedule for today including breaks, in order of priority.
Return an array of objects like: [{title, start, end, day}].
`;

    // Simulated sequential scheduling
    const schedule = goals.map((g, i) => {
      const startHour = 7 + i; // simple sequential placement
      const start = `${startHour.toString().padStart(2, "0")}:00`;
      const end = `${(startHour + 1).toString().padStart(2, "0")}:00`;
      return { id: Date.now() + Math.floor(Math.random() * 1000), title: g.title, start, end, day: new Date().toLocaleDateString(undefined, { weekday: "long" }) };
    });

    res.json({ blocks: schedule });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
