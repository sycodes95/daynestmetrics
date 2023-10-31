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
import DayView, { DailyEntry } from '@/app/daily-entry/page';
import { getUserPG } from '@/lib/user/getUserPG';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';

const dailyMetricsData = [
  {factors: ['smoke, coffee'], mood: { content: 6, motivated: 9 }, date: '2023-10-05'},
  {factors: ['run, coffee'], mood: { content: 2, motivated: 5 }, date: '2023-10-02'},
  {factors: ['run, coffee'], mood: { content: 4, motivated: 6 }, date: '2023-10-10'}

]

export default function DailyEntryCalendar() {

  const { user, error, isLoading } = useUser();

  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([])

  useEffect(() => {
    if(user && !error && !isLoading) getAllDailyEntries()
  },[user, error, isLoading])

  useEffect(()=> {
    console.log(dailyEntries);
  },[dailyEntries])

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

  const getAllDailyEntries = async () => {

    const { user_id } = await getUserPG(user)

    const fetchGet = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/daily-entry/all-days?user_id=${user_id}`)

    const allDailyEntries = await fetchGet.json()


    if(allDailyEntries && allDailyEntries.length > 0) {
      setDailyEntries(allDailyEntries)
    }

  }

  
  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {


    const currentDate = format(current.toDate(), 'yyyy-MM-dd')

    const currentDateData = dailyEntries.find(entry => format(new Date(entry.entry_date), 'yyyy-MM-dd') === currentDate);

    const handleDailyEntryDelete = async () => {

      try {

        const { user_id } = await getUserPG(user)

        const fetchDelete = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/daily-entry/day`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            entry_date: currentDate,
            user_id
          })
        })

        const deletedEntry = await fetchDelete.json()

        return deletedEntry

      } catch (err) {

        console.error('Error deleting entry', err)

        return null

      }
    }

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
                ${getMoodAvgColor(getMoodAvg(currentDateData.mood_rating, currentDateData.productivity_rating))}
                `}>
                  {getMoodAvg(currentDateData.mood_rating, currentDateData.productivity_rating)}
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