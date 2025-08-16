export default function DailyTasks({ classes = [], aiBlocks = [] }) {
  const today = new Date().toLocaleDateString(undefined, { weekday: "long" });

  const urgencyColors = {
    high: "red",
    medium: "orange",
    low: "green"
  };

  // Merge classes and AI tasks for today
  const allTasks = [
    ...classes.filter(c => c.day === today).map(c => ({ ...c, type: "Class" })),
    ...aiBlocks.filter(b => b.day === today).map(b => ({ ...b, type: "Task" })),
  ];

  allTasks.sort((a, b) => a.start.localeCompare(b.start));

  if (!allTasks.length) return <p>No tasks today!</p>;

  const dayStart = 7; // 7 AM
  const dayEnd = 22; // 10 PM
  const hourHeight = 40; // px per hour
  const totalHours = dayEnd - dayStart;

  // Helper to shift tasks below any overlapping classes
  function shiftTaskIfOverlap(task, classBlocks) {
    let [startHour, startMin] = task.start.split(":").map(Number);
    let [endHour, endMin] = task.end.split(":").map(Number);
    let top = ((startHour + startMin / 60) - dayStart) * hourHeight;
    let height = ((endHour + endMin / 60) - (startHour + startMin / 60)) * hourHeight;

    let overlap = true;
    while (overlap) {
      overlap = false;
      for (const c of classBlocks) {
        const [cStartHour, cStartMin] = c.start.split(":").map(Number);
        const [cEndHour, cEndMin] = c.end.split(":").map(Number);
        const cTop = ((cStartHour + cStartMin / 60) - dayStart) * hourHeight;
        const cHeight = ((cEndHour + cEndMin / 60) - (cStartHour + cStartMin / 60)) * hourHeight;

        if (!(top + height <= cTop || top >= cTop + cHeight)) {
          top = cTop + cHeight + 2; // shift below class
          overlap = true;
        }
      }
    }
    return { top, height };
  }

  const classBlocks = allTasks.filter(t => t.type === "Class");

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
          const initialTop = ((startHour + startMin / 60) - dayStart) * hourHeight;
          const initialHeight = ((endHour + endMin / 60) - (startHour + startMin / 60)) * hourHeight;

          const { top, height } = t.type === "Task"
            ? shiftTaskIfOverlap(t, classBlocks)
            : { top: initialTop, height: initialHeight };

          return (
            <div
              key={t.id + "-block"}
              style={{
                position: "absolute",
                top,
                left: 50,
                right: 10,
                height,
                backgroundColor: t.type === "Class" ? "gray" : urgencyColors[t.urgency] || "steelblue",
                color: "white",
                padding: "2px 4px",
                borderRadius: 4,
                fontSize: 12,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {t.title || t.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
