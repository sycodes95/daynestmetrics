'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid';

function renderEventContent(eventInfo: any) {
  return (
    <div className='!border-black w-full rounded-lg !flex gap-2 p-2 !grow !h-full bg-black !border !outline-none'>
      <b>{eventInfo.event.title.split("\n")[0]}</b>
      <div>{eventInfo.event.title.split("\n")[1]}</div>
    </div>
  );
}

export default function MoodCalendar() {
  const trades = [
  { title: "$71.32\n1 trade", date: "2023-10-01", backgroundColor: "#4CAF50" }, // green for profit
  { title: "-$30.78\n2 trades", date: "2023-10-03", backgroundColor: "#F44336" }, // red for loss
  // ... add more trade data
];
  return (
    <FullCalendar
      plugins={[ dayGridPlugin ]}
      initialView="dayGridMonth"
      events={trades}
      eventContent={renderEventContent}
      // other props and customization
    />
  )
}