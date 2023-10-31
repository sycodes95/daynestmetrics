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


import DayView, { DailyEntry } from '@/app/daily-entry/page';
import { getUserPG } from '@/lib/user/getUserPG';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';


export default function DailyEntryCalendar() {

  const { user, error, isLoading } = useUser();

  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([])

  useEffect(() => {
    if(user && !error && !isLoading) getAllDailyEntries()
  },[user, error, isLoading])

  useEffect(()=> {
    console.log(dailyEntries);
  },[dailyEntries])

  const getMoodAvg = (motivated : number, productivity: number) => {
    return Number(((motivated + productivity) / 2).toFixed(1))
  }

  const getDailyAvgRating = (avg : number) => {
    if(avg >= 0 && avg < 4){
      return 'bg-red-400'
    } else if (avg >= 4 && avg < 7) {
      return 'bg-yellow-500'
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

    const dayEntry = dailyEntries.find(entry => format(new Date(entry.entry_date), 'yyyy-MM-dd') === currentDate);

    const handleDailyEntryDelete = async () => {

      try {

        if(!dayEntry) return null

        const { user_id } = await getUserPG(user)


        const fetchDelete = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/daily-entry/day`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            entry_date: dayEntry?.entry_date,
            user_id
          })
        })

        console.log(fetchDelete);

        const deletedEntry = await fetchDelete.json()

        if(!deletedEntry) return null

        // confirm the entry is deleted in DB before updating the state to reflect the deletion

        setDailyEntries(prev => {
          // update state 
          const newEntries = [...prev]
          const entryToDelete = newEntries.findIndex(en => {

            console.log(format(new Date(en.entry_date), 'yyyy-MM-dd'), currentDate);
            return format(new Date(en.entry_date), 'yyyy-MM-dd') === currentDate
          })

          console.log(newEntries[entryToDelete]);

          // const entryToDelete = newEntries.findIndex(en => en.entry_date === dayEntry?.entry_date)

          if(entryToDelete > -1) newEntries.splice(entryToDelete, 1)

          console.log(newEntries);

          return newEntries

        })

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
          dayEntry && 

          <div className='relative h-full w-full flex'>
            <Popover>
              <PopoverTrigger className='w-full h-full'>
                <span className={`p-2 w-full h-full text-sm rounded-lg font-bold text-white flex items-center justify-center 
                ${getDailyAvgRating(getMoodAvg(dayEntry.mood_rating, dayEntry.productivity_rating))}
                `}>
                  {getMoodAvg(dayEntry.mood_rating, dayEntry.productivity_rating)}
                </span>
              </PopoverTrigger>
              <PopoverContent className='h-fit  w-fit flex flex-col'>
                <DialogTrigger className=''>
                  <Button className='text-xs' variant={'outline'}>Edit</Button>
                </DialogTrigger>

                <Button className='text-xs' variant={'destructive'} onClick={()=> handleDailyEntryDelete()} >Delete</Button>
                {/* <button className='text-xs bg-black text-white'  >test</button> */}

                
              </PopoverContent>
            </Popover>

          </div>
            
          }
         
          {
          !dayEntry && (new Date(currentDate) < new Date()) &&
          <DialogTrigger className='h-full w-full'>
            <div className='flex text-2xl text-gray-400 items-center md:flex-row flex-col h-full justify-center  w-full bg-opacity-20 hover:text-black transition-all duration-200'>
              +
            </div>
          </DialogTrigger>
          }

          {
          !dayEntry && (new Date(currentDate) > new Date()) &&
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