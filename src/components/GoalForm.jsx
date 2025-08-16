import { useState } from "react";

export default function GoalForm({ addGoal = () => {} }) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("07:00");
  const [hours, setHours] = useState(1);
  const [priority, setPriority] = useState("Medium");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!title || hours <= 0) return;

    addGoal({
      id: Date.now(),
      title,
      start,
      hours,
      priority,
      day: new Date().toLocaleDateString(undefined, { weekday: "long" }),
    });

    setTitle("");
    setStart("07:00");
    setHours(1);
    setPriority("Medium");
  };

  return (
    <form
      onSubmit={onSubmit}
      style={{ border:"1px solid #ccc", padding:10, borderRadius:6, marginBottom:16, display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}
    >
      <input
        placeholder="Goal (e.g., Read ch.3)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ flex:1, minWidth:180 }}
      />

      <input type="time" value={start} onChange={(e) => setStart(e.target.value)} />

      <select value={hours} onChange={(e) => setHours(Number(e.target.value))}>
        {[1,2,3,4].map(h => <option key={h} value={h}>{h} hr{h>1?'s':''}</option>)}
      </select>

      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        {["High","Medium","Low"].map(p => <option key={p} value={p}>{p}</option>)}
      </select>

      <button type="submit">Add Goal</button>
    </form>
  );
}
