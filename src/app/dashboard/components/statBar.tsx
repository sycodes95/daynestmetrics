'use client'

import { useEffect, useState } from "react"
import StatCard from "./statCard"
import { DailyEntry } from "@/app/daily-entry/dailyEntry"
import { useUser } from "@auth0/nextjs-auth0/client";
import { getUserPG } from "@/lib/user/getUserPG";

export default function StatBar () {

  const { user, error, isLoading } = useUser();

  const [pastMonthEntries, setPastMonthEntries] = useState<DailyEntry[] | []>([])

  const [basicStats , setBasicStats] = useState({
    overall: [],
    mood:[],
    productivity: []
  })

  async function fetchPastMonthEntries () {

    try {
        
      const {user_id} = await getUserPG(user)

      const fetchGet = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/daily-entry/last-month-entries?user_id=${user_id}`)

      const entries = await fetchGet.json()

      setPastMonthEntries(entries)
      console.log(entries);

    } catch (error) {
      console.error(error)
    }
  }

  const formatEntriesForNivo = () => {
      
  }

  useEffect(()=> {

    
    if(pastMonthEntries.length > 0) {
      formatEntriesForNivo()
    }

  },[pastMonthEntries])

  useEffect(()=> {
    if(user && !error && !isLoading) {
      fetchPastMonthEntries()
    }
  },[user, error, isLoading])
 
  return (
    <div className="flex items-center gap-2 h-32 w-full">
      {
      Object.entries(basicStats).map(([statName, data]) => (
        
        <StatCard className="w-full" 
        statName={statName} 
        key={statName} 
        />
      ))
      }

    </div>
  )
}