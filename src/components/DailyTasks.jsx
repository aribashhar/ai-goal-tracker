export default function DailyTasks({ classes = [], aiBlocks = [] }) {
  const today = new Date().toLocaleDateString(undefined, { weekday: "long" });

  // Merge classes and AI tasks for today
  const allTasks = [
    ...classes.filter(c => c.day === today).map(c => ({ ...c, type: "Class" })),
    ...aiBlocks.filter(b => b.day === today).map(b => ({ ...b, type: "Task" })),
  ];

  allTasks.sort((a, b) => a.start.localeCompare(b.start));

  if (!allTasks.length) return <p>No tasks today!</p>;

  // --- Visual timeline setup ---
  const dayStart = 7; // 7 AM
  const dayEnd = 22; // 10 PM
  const hourHeight = 40; // px per hour
  const totalHours = dayEnd - dayStart;

  return (
    <div style={{ border: "1px solid #ccc", padding: 10, borderRadius: 6 }}>
      <h3>Today's Agenda</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {allTasks.map(t => (
          <li key={t.id} style={{ marginBottom: 6 }}>
            <strong>{t.start}-{t.end}</strong> • {t.title || t.name} <em>({t.type})</em>
          </li>
        ))}
      </ul>

      <h4>Visual Timeline</h4>
      <div style={{ position: "relative", border: "1px solid #ddd", height: totalHours * hourHeight, marginTop: 10 }}>
        {/* Hour lines */}
        {Array.from({ length: totalHours + 1 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: i * hourHeight,
              left: 0,
              right: 0,
              borderTop: "1px solid #eee",
              fontSize: 10,
              paddingLeft: 2,
            }}
          >
            {dayStart + i}:00
          </div>
        ))}

        {/* Task blocks */}
        {allTasks.map(t => {
          const [startHour, startMin] = t.start.split(":").map(Number);
          const [endHour, endMin] = t.end.split(":").map(Number);

          const top = ((startHour + startMin / 60) - dayStart) * hourHeight;
          const height = ((endHour + endMin / 60) - (startHour + startMin / 60)) * hourHeight;

          return (
            <div
              key={t.id + "-block"}
              style={{
                position: "absolute",
                top,
                left: 50,
                right: 10,
                height,
                backgroundColor: t.type === "Class" ? "gray" : "steelblue",
                color: "white",
                padding: "2px 4px",
                borderRadius: 4,
                fontSize: 12,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {t.title || t.name} {/* ← now shows class names and goal/AI titles */}
            </div>
          );
        })}
      </div>
    </div>
  );
}
