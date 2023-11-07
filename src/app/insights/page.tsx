'use client'

import PageHeading from "@/components/pageHeading";
import { getAllLSFactors } from "@/lib/lifestyle-factors/getAllLSFactors";
import { getUserIdFromSub } from "@/lib/user/getUserIdFromSub";
import { DailyEntryFactor } from "@/types/dailyEntryFactor";
import { LifestyleFactor } from "@/types/lifestyleFactors";
import { useUser } from "@auth0/nextjs-auth0/client";
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import { useEffect, useState } from "react";
import { DailyEntry } from "../entryDialog/entryDialog";
import { getLifestyleFactors } from "./services/getLifestyleFactors";
import { getEntryFactors } from "./services/getEntryFactors";
import { getDailyEntries } from "./services/getDailyEntries";
import { Checkbox } from "@/components/ui/checkbox";
import { ResponsiveScatterPlot } from '@nivo/scatterplot'

type ScatterChartData = {
  id: string;
  data: { y:number,  x:number, entries:number}[]
}
export default function Insights() {

  const { user, error, isLoading } = useUser()

  const [userLoaded, setUserLoaded] = useState(false)

  const [dailyEntries, setDailyEntries ] = useState<DailyEntry[]>([])

  const [lifestyleFactors, setLifestyleFactors] = useState<LifestyleFactor[]>([])

  const [dailyEntryFactors, setDailyEntryFactors] = useState<DailyEntryFactor[]>([])

  const [selectedLifestyleFactors, setSelectedLifestyleFactors] = useState<number[]>([])

  const [didOrDidNot, setDidOrDidNot] = useState<"Did" | "Did Not">("Did")

  const [scatterChartData, setScatterChartData] = useState<ScatterChartData[]>([])

  const makeScatterData = () => {

    let did : boolean;

    if(didOrDidNot === 'Did'){
      did = true
    } else if( didOrDidNot === 'Did Not') {
      did = false
    }
    const data: ScatterChartData[] = []
    selectedLifestyleFactors.forEach((factorId) => {
      const id = lifestyleFactors.find(f => f.lifestyle_factor_id === factorId)
      const entryFactors = dailyEntryFactors.filter(eFactor => eFactor.did === did && eFactor.lifestyle_factor_id === factorId)
      const entriesWithEntryFactors = entryFactors.map(eF => {
        const entry = dailyEntries.find(e => e.daily_entry_id === eF.daily_entry_id)
        if(!entry) {
          return {
            y: null,
            x: null
          }
          
        }
        return {
          y: entry?.mood_rating,
          x: entry?.mood_rating
        }
        
      })

      let moodSum: number = 0 ;
      let prodSum: number = 0 ;
      entriesWithEntryFactors.forEach((rating ) => {
        if(rating.x && rating.y) {
           moodSum += rating.x 
           prodSum += rating.y
        }
       
      })

      let moodAvg: number = Number((moodSum / entriesWithEntryFactors.length).toFixed(2))
      let prodAvg: number = Number((prodSum / entriesWithEntryFactors.length).toFixed(2))

      if(entriesWithEntryFactors.length > 0){
        data.push({
          id: id ? id.name : '',
          data: [
            {
              y: moodAvg, 
              x: prodAvg,
              entries: entriesWithEntryFactors.length
            }
          ]
        })

      }
      

      
    })

    setScatterChartData(data)


    
  }

  const handleSelectFactor = (factorId: number) => {
    if(selectedLifestyleFactors.includes(factorId)){
      return setSelectedLifestyleFactors(prev => prev.filter(id => id !== factorId))
    } else if (!selectedLifestyleFactors.includes(factorId)){
      return setSelectedLifestyleFactors(prev => [...prev, factorId])
    }
  }

  useEffect(()=> {
    if(user && !error && !isLoading) setUserLoaded(true)
  },[user, error, isLoading]) 

  useEffect(()=> {
    if(userLoaded && user) {
      getLifestyleFactors(user).then(factors => setLifestyleFactors(factors))
      getEntryFactors(user).then(entryFactors => setDailyEntryFactors(entryFactors))
      getDailyEntries(user).then(entries => setDailyEntries(entries))
    }
  },[userLoaded])

  useEffect(()=> {
    console.log(scatterChartData);
  },[scatterChartData])

  useEffect(()=> {
    makeScatterData()
  },[selectedLifestyleFactors, didOrDidNot])

  return (
    <div className="w-full h-full flex flex-col">
      <PageHeading
      header="Insights" 
      body="Get insights into how your lifestyle factors correlates to mood and productivity"
      >
        <StackedBarChartIcon/>
      </PageHeading>

      <div className="h-96 w-full grow">

      

      <ResponsiveScatterPlot
        data={scatterChartData}
        margin={{ top: 40, right: 100, bottom: 70, left: 50 }}
        xScale={{ type: 'linear', min: 0, max: 10 }}
        xFormat=">-0.2f"
        yScale={{ type: 'linear', min: 0, max: 10 }}
        yFormat=">-0.2f"
        blendMode="multiply"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Productivity',
          legendPosition: 'middle',
          legendOffset: 46,
          tickValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Mood',
          legendPosition: 'middle',
          legendOffset: -40,
          tickValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        }}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 130,
            translateY: 0,
            itemWidth: 100,
            itemHeight: 12,
            itemsSpacing: 5,
            itemDirection: 'left-to-right',
            symbolSize: 14,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemOpacity: 1
                }
              }
            ]
          }
        ]}
      />
      </div>

      <div className="flex items-center gap-4 p-4">
        <button 
        className={`${didOrDidNot === 'Did' ? 'border-black' : 'border-gray-400'} p-2  border rounded-lg w-20 h-8 flex items-center justify-center `}
        onClick={()=> setDidOrDidNot('Did')}
        >Did</button>
        <button 
        className={`${didOrDidNot === 'Did Not' ? 'border-black' : 'border-gray-400'} p-2  border rounded-lg w-20 h-8 flex items-center justify-center `}
        onClick={()=> setDidOrDidNot('Did Not')}
        >Did Not</button>


      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 w-full h-fit p-4">
      { 
      lifestyleFactors.map((factor) => (
        <div className="flex gap-4 items-center h-12" key={factor.lifestyle_factor_id}>
          <Checkbox checked={selectedLifestyleFactors.includes(factor.lifestyle_factor_id)} onCheckedChange={()=> handleSelectFactor(factor.lifestyle_factor_id)} />
          <span>{factor.name}</span>

        </div>
      ))
      }
      </div>
    </div>
  )
}