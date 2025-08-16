import { useState } from "react";

export default function ClassForm({ addClass = () => {} }) {
  const [name, setName] = useState("");
  const [day, setDay] = useState("Monday");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("10:00");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;

    if (start >= end) {
      alert("Start time must be before end time!");
      return;
    }

    addClass({ id: Date.now(), name, day, start, end });

    setName("");
    setDay("Monday");
    setStart("09:00");
    setEnd("10:00");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: "1px solid gray",
        padding: "10px",
        borderRadius: "5px",
        marginBottom: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <input
        type="text"
        placeholder="Class Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <select value={day} onChange={(e) => setDay(e.target.value)}>
        {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <label>
        Start Time:
        <input
          type="time"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
      </label>

      <label>
        End Time:
        <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
      </label>

      <button type="submit" style={{ padding: "5px 10px" }}>
        Add Class
      </button>
    </form>
  );
}
