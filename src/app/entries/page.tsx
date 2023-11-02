'use client'

import PageHeading from '@/components/pageHeading';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { Skeleton } from '@mui/material';
import { DataTable } from './components/data-table';
import { Payment, columns } from "./components/columns"
import { useEffect, useState } from 'react';
import { DailyEntry } from '../daily-entry/dailyEntry';
import { useUser } from '@auth0/nextjs-auth0/client';
import { getUserPG } from '@/lib/user/getUserPG';
import { LifestyleFactor } from '@/types/lifestyleFactors';
import { getLifestyleFactors } from '@/lib/lifestyle-factors/getLifestyleFactors';
import { DailyEntryFactor } from '@/types/dailyEntryFactor';

type DailyEntryData = {
  daily_entry_id?: number | null,
  entry_date: string,
  journal: string,
  mood_rating: number,
  productivity_rating: number,
  user_id?: number | null,
  didFactors: string[],
  didNotFactors: string[],
}
export default function Entries() {

  const { user, error, isLoading } = useUser();
  
  const [entriesData, setEntriesData] = useState<DailyEntryData[]>([])

  useEffect(() => {

    async function getEntriesData () {
      if(!user) return

      try {
        const { user_id } = await getUserPG(user)

        const fetchGetAllEntries = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/daily-entry/all-entries?user_id=${user_id}`)

        const entries = await fetchGetAllEntries.json()

        if(!entries || entries.length < 1) return 

        const lsFactors: LifestyleFactor[] | null = await getLifestyleFactors(user)

        console.log(lsFactors);

        if(!lsFactors) return 

        const fetchGetAllEntryFactors = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/daily-entry/all-entry-factors?user_id=${user_id}`)

        const entryFactors: DailyEntryFactor[] = await fetchGetAllEntryFactors.json()

        if(!entryFactors || entryFactors.length < 1) return

        const newData = entries.map((entryData: DailyEntry, index: number) => {

          const { daily_entry_id } = entryData;

          const didFactors: string[] = []
          const didNotFactors: string[] = []

          // make new array and retrieve all factors that reference this daily factor

          const thisEntryFactors: DailyEntryFactor[] =  entryFactors.filter(data => data.daily_entry_id === daily_entry_id)

          thisEntryFactors.forEach((enFactor) => {
            //find lifestyle factor that reference entry factor
            const lsFactor = lsFactors.find(lsFactor => lsFactor.lifestyle_factor_id === enFactor.lifestyle_factor_id)
            console.log(lsFactor);
            if(lsFactor) {
              enFactor.did ? didFactors.push(lsFactor.name) : didNotFactors.push(lsFactor.name)
            }
          })

          return {
            ...entryData,
            didFactors,
            didNotFactors
          }
        })

        setEntriesData(newData)
        
      } catch (error) {
        console.error('Error getting all daily entries in entries page')
      }

    }
    getEntriesData()
    
  },[ user, error, isLoading])

  useEffect(()=> {

    

    if(entriesData.length > 0) {

    }
    console.log(entriesData);
  },[entriesData])


  return (
    <div className="w-full grow h-full flex flex-col gap-4">
      <PageHeading header='Entries' body='View all daily entries.'>
          <EditNoteIcon />
      </PageHeading>
      <DataTable columns={columns} data={entriesData} />
    </div>
  )
}

//will take quick break