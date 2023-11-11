'use client'

import { Calendar, CalendarProps, Badge } from 'antd';
import type { Dayjs } from 'dayjs';
import { format } from 'date-fns';
import AddCircleIcon from '@mui/icons-material/AddCircle';

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


import EntryDialog, { DailyEntry } from '@/app/entryDialog/entryDialog';
import { getUserPG } from '@/lib/user/getUserPG';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useCallback, useEffect, useState } from 'react';
import { getRatingColorBG } from '@/utils/getRatingColor';


export default function EntryCalendar() {

  const { user, error, isLoading } = useUser();

  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([])

  const getAllDailyEntries = useCallback(async () => {

    const { user_id } = await getUserPG(user)

    const fetchGet = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/daily-entry/all-entries?user_id=${user_id}`)

    const allDailyEntries = await fetchGet.json()


    if(allDailyEntries && allDailyEntries.length > 0) {
      setDailyEntries(allDailyEntries)
    }

  },[user])

  const getMoodAvg = (motivated : number, productivity: number) => {
    return Number(((motivated + productivity) / 2).toFixed(1))
  }

  useEffect(() => { 
    if(user && !error && !isLoading) getAllDailyEntries()
  },[user, error, isLoading, getAllDailyEntries])

  useEffect(()=> {
  },[dailyEntries])

  

  

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {


    const currentDate = format(current.toDate(), 'yyyy-MM-dd')

    const dayEntry = dailyEntries.find(entry => format(new Date(entry.entry_date), 'yyyy-MM-dd') === currentDate);

    const handleDailyEntryDelete = async () => {

      try {

        if(!dayEntry) return null

        const { user_id } = await getUserPG(user)


        const fetchDelete = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/daily-entry/entry`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            entry_date: dayEntry?.entry_date,
            user_id
          })
        })


        const deletedEntry = await fetchDelete.json()

        if(!deletedEntry) return null

        // confirm the entry is deleted in DB before updating the state to reflect the deletion

        setDailyEntries(prev => {
          // update state 
          const newEntries = [...prev]
          const entryToDelete = newEntries.findIndex(en => {

            return format(new Date(en.entry_date), 'yyyy-MM-dd') === currentDate
          })

          // const entryToDelete = newEntries.findIndex(en => en.entry_date === dayEntry?.entry_date)

          if(entryToDelete > -1) newEntries.splice(entryToDelete, 1)

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

          <div className='relative h-full w-full flex  rounded-lg'>
            <Popover>
              <PopoverTrigger className='w-full h-full'>
                <span className={`p-2 w-full h-full text-sm hover:border-2 hover:border-border rounded-lg font-bold text-white flex items-center justify-center 
                ${getRatingColorBG(getMoodAvg(dayEntry.mood_rating, dayEntry.productivity_rating))}
                `}>
                  {getMoodAvg(dayEntry.mood_rating, dayEntry.productivity_rating)}
                </span>
              </PopoverTrigger>
              <PopoverContent className='h-fit  w-32 flex flex-col p-1 shadow-md shadow-gray-300'>
                <span className='p-2 font-semibold border-b border-gray-300'>Actions</span>
                <DialogTrigger className='w-full text-left p-2'>
                  Edit
                </DialogTrigger>

                <Button className='text-xs text-left flex justify-start p-2' variant={'destructive'} onClick={()=> handleDailyEntryDelete()} >Delete</Button>
                {/* <button className='text-xs bg-black text-white'  >test</button> */}

                
              </PopoverContent>
            </Popover>

          </div>
            
          }
         
          {
          !dayEntry && (new Date(currentDate) < new Date()) &&
          <DialogTrigger className='h-full w-full flex items-center justify-center text-gray-300 hover:text-gray-500 transition-colors'>
              <AddCircleIcon className=' ' />
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
              <EntryDialog currentDate={currentDate} getAllDailyEntriesCalendar={getAllDailyEntries} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      }
      </>
    )
  };
  return (

    <div className='flex flex-col'>
      <Calendar className='' cellRender={cellRender} />
    </div>

  )
}