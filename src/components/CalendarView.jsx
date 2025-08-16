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

export default function CalendarView({ classes = [], aiBlocks = [] }) {
  const urgencyColors = {
    high: "red",
    medium: "orange",
    low: "green"
  };

  const classEvents = classes.map(c => ({
    id: c.id,
    title: c.name,
    start: `${getDayOfWeekDate(c.day)}T${c.start}`,
    end: `${getDayOfWeekDate(c.day)}T${c.end}`,
    color: "gray"
  }));

  const aiEvents = aiBlocks.map(b => ({
    id: b.id,
    title: `Task: ${b.title}`,
    start: `${getDayOfWeekDate(b.day)}T${b.start}`,
    end: `${getDayOfWeekDate(b.day)}T${b.end}`,
    color: urgencyColors[b.urgency] || "steelblue"
  }));

  return (
    <FullCalendar
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      allDaySlot={false}
      firstDay={0}
      slotMinTime="07:00:00"
      slotMaxTime="22:00:00"
      events={[...classEvents, ...aiEvents]}
      eventOverlap={false} // prevents visual overlap
      height="auto"
    />
  );
}
