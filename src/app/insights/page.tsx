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

  const [selectedLifestyleFactorIds, setSelectedLifestyleFactorIds] = useState<number[]>([])

  const [didOrDidNot, setDidOrDidNot] = useState<"Did" | "Did Not">("Did")

  const [scatterChartData, setScatterChartData] = useState<ScatterChartData[]>([])

  const makeScatterData = () => {
    // check if user wants to see did or did not factor data
    let did = didOrDidNot === 'Did';

    const scatterData: ScatterChartData[] = []

    // iterate thru selectedLifestyleFactorIds to get 
    // 1. name of lifestyle factor for scatter data Id
    // 2. average mood / prod for Y / X axis from all daily entries where user either did or did not do selected factor
    
    selectedLifestyleFactorIds.forEach((id) => {

      // find lifestyle factor that matches the id
      const lifestyleFactor = lifestyleFactors.find(f => f.lifestyle_factor_id === id)

      //get all entry factors that matches selected factor id
      const entryFactors = dailyEntryFactors.filter(eFactor => eFactor.did === did && eFactor.lifestyle_factor_id === id)

      // get y and x values from all entries that has selected factor that references the entry
      const entriesYXValues = entryFactors.map(eF => {
        const entry = dailyEntries.find(e => e.daily_entry_id === eF.daily_entry_id);
        return entry ? { y: entry.mood_rating, x: entry.productivity_rating } : { y: null, x: null };
      }).filter(data => data.y !== null && data.x !== null);

      // get sum of mood and productivity ratings for selected factor
      let moodSum = 0, prodSum = 0;

      // iterate thru YX values and add the sums of mood and prod
      entriesYXValues.forEach(({y , x} ) => {
        if(y !== null && x !== null){
          moodSum += y;
          prodSum += x;
        }
      });

      const count = entriesYXValues.length;
      if (count > 0 && lifestyleFactor) {
        // get average mood and productivity for selected factor
        const moodAvg = Number((moodSum / count).toFixed(2));
        const prodAvg = Number((prodSum / count).toFixed(2));
        // push data into scatterData array
        scatterData.push({
          id: lifestyleFactor.name,
          data: [{ y: moodAvg, x: prodAvg, entries: count }]
        });
      }
    });

    setScatterChartData(scatterData)
    
  }

  const handleSelectFactor = (id: number) => {
    if(selectedLifestyleFactorIds.includes(id)){
      return setSelectedLifestyleFactorIds(prev => prev.filter(id => id !== id))
    } else if (!selectedLifestyleFactorIds.includes(id)){
      return setSelectedLifestyleFactorIds(prev => [...prev, id])
    }
  }

  const populateSelectedLifestyleFactors = () => {
    setSelectedLifestyleFactorIds(lifestyleFactors.map(factor => factor.lifestyle_factor_id))
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
    if(lifestyleFactors.length > 0 && dailyEntryFactors.length > 0 && dailyEntries.length > 0) {
      populateSelectedLifestyleFactors()
    }
  },[lifestyleFactors, dailyEntryFactors, dailyEntries])

  useEffect(()=> {
    console.log(scatterChartData);
  },[scatterChartData])

  useEffect(()=> {
    makeScatterData()
  },[selectedLifestyleFactorIds, didOrDidNot])

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
        margin={{ top: 40, right: 120, bottom: 70, left: 50 }}
        xScale={{ type: 'linear', min: 0, max: 10 }}
        xFormat=">-0.2f"
        yScale={{ type: 'linear', min: 0, max: 10 }}
        yFormat=">-0.2f"
        blendMode="multiply"
        axisTop={null}
        axisRight={null}
        colors={{scheme: 'set1'}}
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

      <div className="flex items-center gap-2 p-4">
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
        <div className="flex gap-3 items-center h-12" key={factor.lifestyle_factor_id}>
          <Checkbox checked={selectedLifestyleFactorIds.includes(factor.lifestyle_factor_id)} onCheckedChange={()=> handleSelectFactor(factor.lifestyle_factor_id)} />
          <span>{factor.name}</span>

        </div>
      ))
      }
      </div>
    </div>
  )
}