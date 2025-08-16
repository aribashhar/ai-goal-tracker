export default function DailyTasks({ classes = [], aiBlocks = [] }) {
  const today = new Date().toLocaleDateString(undefined, { weekday: "long" });

  const allTasks = [
    ...classes.filter(c => c.day === today).map(c => ({ ...c, type: "Class" })),
    ...aiBlocks.filter(b => b.day === today).map(b => ({ ...b, type: "Task" })),
  ];

  allTasks.sort((a, b) => a.start.localeCompare(b.start));

  if (!allTasks.length) return <p>No tasks today!</p>;

  return (
    <div style={{ border: "1px solid #ccc", padding: 10, borderRadius: 6 }}>
      <h3>Today's Agenda</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {allTasks.map(t => (
          <li key={t.id} style={{ marginBottom: 6 }}>
            <strong>{t.start}-{t.end}</strong> • {t.title} <em>({t.type})</em>
          </li>
        ))}
      </ul>
    </div>
  );
}
