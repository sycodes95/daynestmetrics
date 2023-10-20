'use client'

import { getYMDFromDate } from '@/util/getYMDFromDate';
import { Calendar, CalendarProps, Badge } from 'antd';
import type { Dayjs } from 'dayjs';
import { format } from 'date-fns';
const dailyMetricsData = [
  {factors: ['smoke, coffee'], mood: { content: 6, motivated: 9 }, date: '2023-10-05'},
  {factors: ['run, coffee'], mood: { content: 2, motivated: 5 }, date: '2023-10-02'}

]

export default function MoodCalendar() {
  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    const currentDate = format(current.toDate(), 'yyyy-MM-dd')

    const currentDateData = dailyMetricsData.find(data => data.date === currentDate)
    return (
      <div className='h-full w-full rounded-lg' >
        {
        currentDateData ? 
        <div className='flex items-center md:flex-row flex-col h-full justify-evenly  w-full bg-black bg-opacity-20'>
          <div className='flex justify-between items-center'>
            {/* <span>Motivation</span> */}
             <span className='p-1 w-6 h-6 rounded-full bg-black text-white flex items-center justify-center'>{currentDateData.mood.motivated}</span>
          </div>
          <div className='flex justify-between items-center'>
            {/* <span>Contentment</span> */}
            <span className='p-1 w-6 h-6 rounded-full bg-black text-white flex items-center justify-center'>{currentDateData.mood.content}</span>
             
          </div>
        </div>
        :
        <>
        </>
        }
      </div>

    )
    // if (info.type === 'date') return dateCellRender(current);
    // if (info.type === 'month') return monthCellRender(current);
    // return info.originNode;
  };
  return (
    <Calendar className='' cellRender={cellRender} />

  )
}