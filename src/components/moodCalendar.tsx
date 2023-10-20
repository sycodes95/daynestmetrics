'use client'

import { getYMDFromDate } from '@/util/getYMDFromDate';
import { Calendar, CalendarProps, Badge } from 'antd';
import type { Dayjs } from 'dayjs';
import { format } from 'date-fns';
import Link from 'next/link';

import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const dailyMetricsData = [
  {factors: ['smoke, coffee'], mood: { content: 6, motivated: 9 }, date: '2023-10-05'},
  {factors: ['run, coffee'], mood: { content: 2, motivated: 5 }, date: '2023-10-02'},
  {factors: ['run, coffee'], mood: { content: 4, motivated: 6 }, date: '2023-10-10'}

]

export default function MoodCalendar() {

  const getMoodAvg = (motivated : number, content: number) => {
    return Number(((motivated + content) / 2).toFixed(1))
  }

  const getMoodAvgColor = (avg : number) => {
    if(avg >= 0 && avg < 4){
      return 'bg-red-400'
    } else if (avg >= 4 && avg < 7) {
      return 'bg-yellow-400'
    } else if (avg >= 7 && avg < 10) {
      return 'bg-green-400'
    } else if (avg === 10) {
      return 'bg-blue-400'
    }
  }
  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    console.log(info);
    const currentDate = format(current.toDate(), 'yyyy-MM-dd')

    const currentDateData = dailyMetricsData.find(data => data.date === currentDate)

    return (
      <>
      {
      info.type === 'month' ? 
      <>
      </> 
      :
      <div className='h-full w-full rounded-lg' >
        {
        currentDateData && 
        <div className='flex items-center md:flex-row flex-col h-full justify-evenly  w-full bg-opacity-20'>
          <div className='flex justify-between items-center h-full w-full'>
            {/* <span>Motivation</span> */}
            <span className={`p-2 w-full h-full rounded-lg font-bold bg-black text-white flex items-center justify-center 
            ${getMoodAvgColor(getMoodAvg(currentDateData?.mood.motivated, currentDateData.mood.content))}
            `}>
              {getMoodAvg(currentDateData.mood.motivated, currentDateData.mood.content)}
            </span>

            <div  className='absolute top-10 gap-1 right-2 w-fit h-fit text-2xl text-gray-400 items-center flex-col justify-center bg-opacity-20 md:flex hidden '>
              <EditIcon className='h-6 w-6 hover:text-black transition-all duration-300' />
              <DeleteForeverIcon className='h-6 w-6 hover:text-black transition-all duration-300' />
            </div>
          </div>
          
        </div>
        }
        {
        !currentDateData && (new Date(currentDate) < new Date()) &&
        <Link href={`/dayView`} className='flex text-2xl text-gray-400 items-center md:flex-row flex-col h-full justify-center  w-full bg-opacity-20 hover:text-black transition-all duration-200'>
          +
        </Link>
        }

        {
        !currentDateData && (new Date(currentDate) > new Date()) &&
        <div className=' flex text-2xl text-gray-400 items-center md:flex-row flex-col h-full justify-center  w-full bg-opacity-20 cursor-default pointer-events-none z-50'>
          
        </div>
        }
        
        
      </div>


      }
      </>
    )
  };
  return (

    <div className='flex flex-col  p-4'>
      <Calendar className='' cellRender={cellRender} />
    </div>

  )
}