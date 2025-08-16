import { useState } from "react";

export default function GoalForm({ addGoal = () => {} }) {
  const [title, setTitle] = useState("");
  const [minutes, setMinutes] = useState(60);
  const [priority, setPriority] = useState("Medium");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!title || minutes <= 0) return;

    addGoal({
      id: Date.now(),
      title,
      minutes: Number(minutes),
      priority,
    });

    setTitle("");
    setMinutes(60);
    setPriority("Medium");
  };

  return (
    <form
      onSubmit={onSubmit}
      style={{
        border: "1px solid #ccc",
        padding: 10,
        borderRadius: 6,
        marginBottom: 16,
        display: "flex",
        gap: 8,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <input
        placeholder="Goal (e.g., Read ch.3)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ flex: 1, minWidth: 180 }}
      />

      <input
        type="number"
        value={minutes}
        min={15}
        step={15}
        onChange={(e) => setMinutes(Number(e.target.value))}
        style={{ width: 100 }}
      />
      <span>min</span>

      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        {["High", "Medium", "Low"].map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      <button type="submit">Add Goal</button>
    </form>
  );
}
