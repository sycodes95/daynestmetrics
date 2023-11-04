'use client'

import { useEffect, useState } from "react"
import StatCard from "./statCard"
import { DailyEntry } from "@/app/entryDialog/dailyEntry"
import { useUser } from "@auth0/nextjs-auth0/client";
import { getUserPG } from "@/lib/user/getUserPG";
import { Skeleton } from "@mui/material";
import StatBarSkeleton from "./statCardSkeleton";
type BasicStats = {
  overall: { rating : number }[] | [],
  mood:{ rating : number }[] | [],
  productivity: Rating[] | []
}

export type Rating = { rating: number }

export default function StatBar () {

  const { user, error, isLoading } = useUser();

  const [pastMonthEntries, setPastMonthEntries] = useState<DailyEntry[] | []>([])

  const [overallAvg, setOverallAvg] = useState<number | null>(null)

  const [basicStats , setBasicStats] = useState<BasicStats>({
    overall: [],
    mood: [],
    productivity: []
  })

  const [statsAreLoading, setStatsAreLoading] = useState(true)

  const getColorByStatName = (statName: string) => {
    if(statName === 'overall') {
      return '#619DC4'
    } else if (statName === 'mood') {
      return '#088F8F'
    } else if (statName === 'productivity') {
      return '#FF7F50'
    } 
    return '#619DC4'
  }

  async function fetchPastMonthEntries () {

    try {
      
      const {user_id} = await getUserPG(user)

      const fetchGet = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/daily-entry/last-month-entries?user_id=${user_id}`)

      const entries = await fetchGet.json()

      setPastMonthEntries(entries)
      console.log(entries);

    } catch (error) {
      setStatsAreLoading(false)
      console.error(error)
    }
  }

  const formatEntriesForVis = () => {
    const overallData: { rating : number}[] = []
    const moodData: { rating : number}[] = []
    const productivityData: { rating : number}[] = []


    pastMonthEntries.forEach((entry, index) => {
      const overallRating = Number(((entry.mood_rating + entry.productivity_rating) / 2).toFixed(1))

      const moodRating = entry.mood_rating

      const productivityRating = entry.productivity_rating

      overallData.push({ rating: overallRating})

      moodData.push({ rating: moodRating })

      productivityData.push({ rating: productivityRating})

    })

    setBasicStats({
      overall: overallData,
      mood: moodData,
      productivity: productivityData
    })

    setStatsAreLoading(false)

  }

  useEffect(()=> {

    
    if(pastMonthEntries.length > 0) {
      formatEntriesForVis()
    }

  },[pastMonthEntries])

  useEffect(()=> {
    if(user && !error && !isLoading) {
      fetchPastMonthEntries()
    }
  },[user, error, isLoading])
 
  return (
    <div className="flex flex-col md:flex-row items-center gap-2  w-full">
      <div className="w-full rounded-lg bg-black text-white h-full md:mr-2 border-black border-2 p-2 flex flex-col items-center md:w-64">
        <span className=" w-full text-left text-sm font-bold">Overall</span>
        <span className=" w-full flex items-center justify-center  h-full font-bold text-2xl">7 / 10</span>

      </div>

      <div className="flex items-center gap-2 w-full h-32">
      
      {
      !statsAreLoading ?
      Object.entries(basicStats).map(([statName, data]) => (
       
        <StatCard className="w-full" 
        statName={statName} 
        data={data}
        lineColor={getColorByStatName(statName)}
        key={statName} 
        />
      ))
      :
      Object.entries(basicStats).map(([key, _]) => (
        <StatBarSkeleton key={key}/>
      ))
      }
      </div>

    </div>
  )
}