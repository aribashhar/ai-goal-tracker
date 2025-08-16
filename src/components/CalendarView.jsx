import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

function getDayOfWeekDate(dayName) {
  const today = new Date();
  const dayIndex = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].indexOf(dayName);
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());
  const target = new Date(sunday);
  target.setDate(sunday.getDate() + dayIndex);
  return target.toISOString().split("T")[0];
}

function getEventColor(task) {
  if (task.type === "Class") return "gray";
  if (task.priority === "High") return "red";
  if (task.priority === "Medium") return "orange";
  return "green";
}

export default function CalendarView({ classes = [], aiBlocks = [] }) {
  const classEvents = classes.map(c => {
    return {
      id: c.id,
      title: c.name,
      start: `${getDayOfWeekDate(c.day)}T${c.start}`,
      end: `${getDayOfWeekDate(c.day)}T${c.end}`,
      color: getEventColor({ type: "Class" }),
      type: "Class"
    };
  });

  const aiEvents = aiBlocks.map(b => {
    const [startH, startM] = b.start.split(":").map(Number);
    const totalStartMinutes = startH * 60 + startM;
    const totalEndMinutes = totalStartMinutes + (b.hours || 1) * 60;
    const endH = Math.floor(totalEndMinutes / 60);
    const endM = totalEndMinutes % 60;

    return {
      id: b.id,
      title: b.title,
      start: `${getDayOfWeekDate(b.day)}T${b.start}`,
      end: `${getDayOfWeekDate(b.day)}T${endH.toString().padStart(2, "0")}:${endM.toString().padStart(2, "0")}`,
      color: getEventColor(b),
      type: "Task",
      priority: b.priority,
      hours: b.hours
    };
  });

  return (
    <FullCalendar
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      allDaySlot={false}
      firstDay={0}
      slotMinTime="07:00:00"
      slotMaxTime="22:00:00"
      events={[...classEvents, ...aiEvents]}
      height="auto"
    />
  );
}
