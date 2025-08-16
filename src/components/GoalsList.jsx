export default function GoalsList({ goals = [], removeGoal = () => {} }) {
  if (!goals.length) return null;

  return (
    <div style={{ marginTop: 12 }}>
      <h3>Your Daily Goals</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {goals.map((g) => {
          const [h, m] = g.start.split(":").map(Number);
          const endHour = h + (g.hours || 1);
          const end = `${endHour.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}`;

          return (
            <li
              key={g.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <span>
                {g.start}-{end} • {g.title} ({g.hours} hr{g.hours>1?'s':''})
              </span>
              <button
                onClick={() => removeGoal(g.id)}
                style={{
                  background: "#ff4d4f",
                  color: "white",
                  border: "none",
                  padding: "3px 8px",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
