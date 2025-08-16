export default function GoalsList({ goals = [], removeGoal = () => {} }) {
  if (!goals.length) return null;

  return (
    <div style={{ marginTop: 12 }}>
      <h3>Your Daily Goals</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {goals.map((g) => (
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
              {g.title} ({g.minutes} min)
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
        ))}
      </ul>
    </div>
  );
}
