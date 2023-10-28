'use client'

import { getYMDFromDate } from '@/util/getYMDFromDate';
import { Calendar, CalendarProps, Badge } from 'antd';
import type { Dayjs } from 'dayjs';
import { format } from 'date-fns';
import Link from 'next/link';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Button } from "@/components/ui/button"


import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DayView from '@/app/daily-entry/page';

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

    const currentDate = format(current.toDate(), 'yyyy-MM-dd')

    const currentDateData = dailyMetricsData.find(data => data.date === currentDate)

    return (
      <>
      {
      info.type === 'month' ? 
      <>
      </> 
      :
      <Dialog>
        <div className='h-full w-full rounded-lg' >
          {
          currentDateData && 

          <div className='relative h-full w-full flex'>
            <Popover>
              <PopoverTrigger className='w-full h-full'>
                <span className={`p-2 w-full h-full text-sm rounded-lg font-bold text-white flex items-center justify-center 
                ${getMoodAvgColor(getMoodAvg(currentDateData?.mood.motivated, currentDateData.mood.content))}
                `}>
                  {getMoodAvg(currentDateData.mood.motivated, currentDateData.mood.content)}
                </span>
              </PopoverTrigger>
              <PopoverContent className='h-fit  w-fit flex flex-col'>
                <DialogTrigger className=''>
                  <Button className='text-xs' variant={'outline'}>Edit</Button>
                </DialogTrigger>
                <Button className='text-xs' variant={'destructive'}>Delete</Button>
              </PopoverContent>
            </Popover>

          </div>
            
          }
          {/* {
          !currentDateData && (new Date(currentDate) < new Date()) &&
          <Link href={`/dayView`} className='h-full w-full'>
            <div className='flex text-2xl text-gray-400 items-center md:flex-row flex-col h-full justify-center  w-full bg-opacity-20 hover:text-black transition-all duration-200'>
              +
            </div>
          </Link>
          } */}
          {
          !currentDateData && (new Date(currentDate) < new Date()) &&
          <DialogTrigger className='h-full w-full'>
            <div className='flex text-2xl text-gray-400 items-center md:flex-row flex-col h-full justify-center  w-full bg-opacity-20 hover:text-black transition-all duration-200'>
              +
            </div>
          </DialogTrigger>
          }

          {
          !currentDateData && (new Date(currentDate) > new Date()) &&
          <div className=' flex text-2xl text-gray-400 items-center md:flex-row flex-col h-full justify-center  w-full bg-opacity-20 cursor-default pointer-events-none z-50'>
          </div>
          }
          
        </div>

        <DialogContent className='shadow-lg shadow-gray-300 h-full  w-full max-w-6xl overflow-y-scroll md:overflow-hidden'>
          <DialogHeader>
            <DialogTitle>How was your day?</DialogTitle>
            <DialogDescription>
              <DayView currentDate={currentDate} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
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