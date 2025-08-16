export default function DailyTasks({ classes=[], aiBlocks=[] }) {
  const today = new Date().toLocaleDateString(undefined, { weekday: "long" });

  const allTasks = [
    ...classes.filter(c => c.day===today).map(c => ({...c, type:"Class"})),
    ...aiBlocks.filter(b => b.day===today).map(b => ({...b, type:"Task"}))
  ];

  allTasks.sort((a,b)=>a.start.localeCompare(b.start));

  if (!allTasks.length) return <p>No tasks today!</p>;

  const dayStart = 7;
  const dayEnd = 22;
  const hourHeight = 40;
  const totalHours = dayEnd - dayStart;

  return (
    <div style={{border:"1px solid #ccc",padding:10,borderRadius:6}}>
      <h3>Today's Agenda</h3>
      <ul style={{listStyle:"none",padding:0}}>
        {allTasks.map(t => {
          const [startH,startM] = t.start.split(":").map(Number);
          const totalStartMinutes = startH*60 + startM;
          const totalEndMinutes = totalStartMinutes + (t.hours||1)*60;
          const endH = Math.floor(totalEndMinutes/60);
          const endM = totalEndMinutes%60;
          const end = `${endH.toString().padStart(2,"0")}:${endM.toString().padStart(2,"0")}`;
          return (
            <li key={t.id} style={{marginBottom:6}}>
              <strong>{t.start}-{end}</strong> • {t.title || t.name} <em>({t.type})</em>
            </li>
          );
        })}
      </ul>

      <h4>Visual Timeline</h4>
      <div style={{position:"relative",border:"1px solid #ddd",height:totalHours*hourHeight,marginTop:10}}>
        {Array.from({length:totalHours+1}).map((_,i)=>(
          <div key={i} style={{position:"absolute",top:i*hourHeight,left:0,right:0,borderTop:"1px solid #eee",fontSize:10,paddingLeft:2}}>
            {dayStart+i}:00
          </div>
        ))}

        {allTasks.map(t => {
          const [startH,startM] = t.start.split(":").map(Number);
          const totalStartMinutes = startH*60 + startM;
          const totalEndMinutes = totalStartMinutes + (t.hours||1)*60;
          const top = (totalStartMinutes/60 - dayStart)*hourHeight;
          const height = ((totalEndMinutes - totalStartMinutes)/60)*hourHeight;

          const color = t.type==="Class" ? "gray" : t.priority==="High" ? "red" : t.priority==="Medium" ? "orange" : "green";

          return (
            <div key={t.id+"-block"} style={{
              position:"absolute",
              top,
              left:50,
              right:10,
              height,
              backgroundColor:color,
              color:"white",
              padding:"2px 4px",
              borderRadius:4,
              fontSize:12,
              overflow:"hidden",
              whiteSpace:"nowrap",
              textOverflow:"ellipsis"
            }}>
              {t.title || t.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
