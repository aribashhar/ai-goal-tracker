export default function ClassList({ classes = [], removeClass = () => {} }) {
  if (!classes.length) return null;

  return (
    <div style={{ marginTop: 12 }}>
      <h3>Your Classes</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {classes.map((c) => (
          <li
            key={c.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "6px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <span>
              {c.day} • {c.start}-{c.end} • {c.name}
            </span>
            <button
              onClick={() => removeClass(c.id)}
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
