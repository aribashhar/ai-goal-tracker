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

// --- Helper: shift AI tasks to avoid overlapping classes ---
function shiftAiBlocksForCalendar(aiBlocks, classes) {
  const classBlocks = classes.map(c => {
    const [startH, startM] = c.start.split(":").map(Number);
    const [endH, endM] = c.end.split(":").map(Number);
    return {
      day: c.day,
      start: startH + startM / 60,
      end: endH + endM / 60
    };
  });

  return aiBlocks.map(block => {
    const [startH, startM] = block.start.split(":").map(Number);
    const [endH, endM] = block.end.split(":").map(Number);
    let start = startH + startM / 60;
    let end = endH + endM / 60;

    const relevantClasses = classBlocks.filter(c => c.day === block.day);

    let overlap = true;
    while (overlap) {
      overlap = false;
      for (const c of relevantClasses) {
        if (!(end <= c.start || start >= c.end)) {
          start = c.end;
          end = start + (end - (startH + startM / 60)); // keep original duration
          overlap = true;
        }
      }
    }

    const newStartH = Math.floor(start);
    const newStartM = Math.round((start - newStartH) * 60);
    const newEndH = Math.floor(end);
    const newEndM = Math.round((end - newEndH) * 60);

    return {
      ...block,
      start: `${newStartH.toString().padStart(2,"0")}:${newStartM.toString().padStart(2,"0")}`,
      end: `${newEndH.toString().padStart(2,"0")}:${newEndM.toString().padStart(2,"0")}`
    };
  });
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

    // --- Clear AI blocks if no goals remain ---
    if (updated.length === 0) {
      setAiBlocks([]);
    }
  };

  // ----- Suggest Schedule (AI) -----
  const suggestSchedule = async () => {
    setLoading(true);

    if (!goals.length) {
      // no goals → clear AI blocks
      setAiBlocks([]);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/suggest-schedule", { classes, goals });
      const rawBlocks = res.data.blocks || [];
      const shiftedBlocks = shiftAiBlocksForCalendar(rawBlocks, classes);
      setAiBlocks(shiftedBlocks);
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
        <CalendarView 
          classes={classes} 
          aiBlocks={shiftAiBlocksForCalendar(aiBlocks, classes)} 
        />
      </div>

      {/* Right Panel: Daily Tasks */}
      <div>
        <DailyTasks classes={classes} aiBlocks={aiBlocks} />
      </div>
    </div>
  );
}
