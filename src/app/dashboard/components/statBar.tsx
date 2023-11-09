'use client'

import { useCallback, useEffect, useState } from "react"
import StatCard from "./statCard"
import { useUser } from "@auth0/nextjs-auth0/client";
import { getUserPG } from "@/lib/user/getUserPG";
import { Skeleton } from "@mui/material";
import StatBarSkeleton from "./statCardSkeleton";

import { CircularProgressbar } from 'react-circular-progressbar';
import { DailyEntry } from "@/app/entryDialog/entryDialog";

type BasicStats = {
  overall: { rating : number }[] | [],
  mood:{ rating : number }[] | [],
  productivity: Rating[] | []
}

export type Rating = { rating: number }

export default function StatBar () {

  const { user, error, isLoading } = useUser();

  const [allEntries, setAllEntries] = useState<DailyEntry[] | []>([])

  const [pastMonthEntries, setPastMonthEntries] = useState<DailyEntry[] | []>([])

  const [overallAvg, setOverallAvg] = useState<number | string>('No Data')

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

  const getPastMonthEntries = useCallback(async () => {

    try {
      
      const {user_id} = await getUserPG(user)

      const fetchGet = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/daily-entry/last-month-entries?user_id=${user_id}`)

      const entries = await fetchGet.json()

      setPastMonthEntries(entries)

    } catch (error) {
      setStatsAreLoading(false)
    }
  },[user])

  const getAllEntries = useCallback(async () => {

    try {
      
      const {user_id} = await getUserPG(user)

      const fetchGet = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/daily-entry/all-entries?user_id=${user_id}`)

      const entries = await fetchGet.json()

      setAllEntries(entries)

    } catch (error) {
      setStatsAreLoading(false)
    }
  },[user])


  

  const formatEntriesForVis = useCallback(() => {
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

  },[pastMonthEntries]);
  useEffect(()=> {
    if(allEntries.length > 0){
      const avg = allEntries.reduce((acc, cur, index) => {
        let curAvg = (cur.mood_rating + cur.productivity_rating) / 2;

        if(index === 0) return curAvg
        
        return ((acc * index) + curAvg) / (index + 1)
      },0)

      setOverallAvg(Number(avg.toFixed(1)))
    }
  },[allEntries])

  useEffect(()=> {

    
    if(pastMonthEntries.length > 0) {
      formatEntriesForVis()
    } else {
      setStatsAreLoading(false)
    }

  },[pastMonthEntries, formatEntriesForVis])

  useEffect(()=> {
    if(user && !error && !isLoading) {
      getPastMonthEntries()
      getAllEntries()
    }
  },[user, error, isLoading, getPastMonthEntries, getAllEntries])
 
  return (
    <div className="flex flex-col md:flex-row items-center gap-2  w-full">
      <div className="w-full rounded-lg bg-black bg-opacity-90 text-white h-full md:mr-2 border-black border-2 p-2 flex flex-col items-center gap-2 md:w-64">
        <div className="w-full flex justify-start font-semibold text-xs">Overall Avg</div>
        {
        typeof overallAvg === 'number' ?
        <div className="flex p-2 items-center justify-center">
          <CircularProgressbar className="h-20 w-20"  
          maxValue={10} 
          value={overallAvg} 
          text={`${overallAvg} / 10`} 
          styles={{
            path: {
              stroke:'#FFFFFF'
            },
            trail: {
              stroke: '#242424',
              strokeLinecap: 'butt',
              transform: 'rotate(0.25turn)',
              transformOrigin: 'center center',
            },
            text: {
              fill: '#FFFFFF',
              fontSize: '16px',
            },
            
          }}
          />
        </div>
        :
        <div className="text-secondary h-full flex items-center">
          No Data...
        </div>
        }

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