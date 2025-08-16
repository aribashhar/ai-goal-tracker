import { useState } from "react";
import axios from "axios";
import ClassForm from "./components/ClassForm";
import ClassList from "./components/ClassList";
import GoalForm from "./components/GoalForm";
import GoalsList from "./components/GoalsList";
import CalendarView from "./components/CalendarView";
import DailyTasks from "./components/DailyTasks"; // Sidebar component

function todayName() {
  return new Date().toLocaleDateString(undefined, { weekday: "long" });
}

export default function App() {
  const [classes, setClasses] = useState(() => {
    try { return JSON.parse(localStorage.getItem("classes")) || []; } catch { return []; }
  });

  const [goals, setGoals] = useState(() => {
    try { return JSON.parse(localStorage.getItem("goals")) || []; } catch { return []; }
  });

  const [aiBlocks, setAiBlocks] = useState([]);
  const [loading, setLoading] = useState(false);

  // ----- Classes -----
  const addClass = (c) => {
    const item = { id: Date.now(), ...c };
    const updated = [...classes, item];
    setClasses(updated);
    localStorage.setItem("classes", JSON.stringify(updated));
  };

  const removeClass = (id) => {
    const updated = classes.filter((c) => c.id !== id);
    setClasses(updated);
    localStorage.setItem("classes", JSON.stringify(updated));
  };

  // ----- Goals -----
  const addGoal = (g) => {
    const item = { id: Date.now(), ...g, day: todayName() };
    const updated = [...goals, item];
    setGoals(updated);
    localStorage.setItem("goals", JSON.stringify(updated));
  };

  const removeGoal = (id) => {
    const updated = goals.filter((g) => g.id !== id);
    setGoals(updated);
    localStorage.setItem("goals", JSON.stringify(updated));
  };

  // ----- Suggest Schedule (AI) -----
  const suggestSchedule = async () => {
    if (!goals.length) {
      alert("Add some goals first!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/suggest-schedule", { classes, goals });
      setAiBlocks(res.data.blocks || []);
    } catch (err) {
      console.error("Failed to get AI schedule", err);
      alert("Failed to get AI schedule, check backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: 20,
        display: "grid",
        gridTemplateColumns: "320px 1fr 250px",
        gap: 20,
      }}
    >
      {/* Left Panel */}
      <div>
        <h1>AI Goal Tracker</h1>

        <h2>Add Class</h2>
        <ClassForm addClass={addClass} />
        <ClassList classes={classes} removeClass={removeClass} />

        <h2>Add Today’s Goal</h2>
        <GoalForm addGoal={addGoal} />
        <GoalsList goals={goals} removeGoal={removeGoal} />

        <button
          onClick={suggestSchedule}
          style={{ marginTop: 12, padding: "8px 12px" }}
          disabled={loading}
        >
          {loading ? "Generating..." : "Suggest Schedule (AI)"}
        </button>
        <p style={{ fontSize: 12, color: "#666" }}>
          Add/Remove classes & goals freely; press the button to refresh the AI schedule.
        </p>
      </div>

      {/* Calendar Panel */}
      <div>
        <CalendarView classes={classes} aiBlocks={aiBlocks} />
      </div>

      {/* Right Panel: Daily Tasks */}
      <div>
        <DailyTasks classes={classes} aiBlocks={aiBlocks} />
      </div>
    </div>
  );
}
