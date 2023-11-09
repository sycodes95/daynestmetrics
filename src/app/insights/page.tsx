'use client'

import PageHeading from "@/components/pageHeading";
import { getAllLSFactors } from "@/lib/lifestyle-factors/getAllLSFactors";
import { getUserIdFromSub } from "@/lib/user/getUserIdFromSub";
import { DailyEntryFactor } from "@/types/dailyEntryFactor";
import { LifestyleFactor } from "@/types/lifestyleFactors";
import { useUser } from "@auth0/nextjs-auth0/client";
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import { useCallback, useEffect, useState } from "react";
import { DailyEntry } from "../entryDialog/entryDialog";
import { getLifestyleFactors } from "./services/getLifestyleFactors";
import { getEntryFactors } from "./services/getEntryFactors";
import { getDailyEntries } from "./services/getDailyEntries";
import { Checkbox } from "@/components/ui/checkbox";
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import { ResponsiveRadar } from '@nivo/radar'

// const demoData = [
//   {
//     "taste": "fruity",
//     "chardonay": 111,
//     "carmenere": 51,
//     "syrah": 30
//   },
//   {
//     "taste": "bitter",
//     "chardonay": 75,
//     "carmenere": 43,
//     "syrah": 104
//   },
//   {
//     "taste": "heavy",
//     "chardonay": 22,
//     "carmenere": 32,
//     "syrah": 108
//   },
//   {
//     "taste": "strong",
//     "chardonay": 41,
//     "carmenere": 113,
//     "syrah": 36
//   },
//   {
//     "taste": "sunny",
//     "chardonay": 24,
//     "carmenere": 53,
//     "syrah": 81
//   },
//   {
//     "taste": "sunny",
//     "chardonay": 24,
//     "carmenere": 53,
//     "syrah": 81
//   },
//   {
//     "taste": "sunny",
//     "chardonay": 24,
//     "carmenere": 53,
//     "syrah": 81
//   },
//   {
//     "taste": "sunny",
//     "chardonay": 24,
//     "carmenere": 53,
//     "syrah": 81
//   },
//   {
//     "taste": "sunny",
//     "chardonay": 24,
//     "carmenere": 53,
//     "syrah": 81
//   },
//   {
//     "taste": "sunny",
//     "chardonay": 24,
//     "carmenere": 53,
//     "syrah": 81
//   },
//   {
//     "taste": "sunny",
//     "chardonay": 24,
//     "carmenere": 53,
//     "syrah": 81
//   },
//   {
//     "taste": "sunny",
//     "chardonay": 24,
//     "carmenere": 53,
//     "syrah": 81
//   },
//   {
//     "taste": "sunny",
//     "chardonay": 24,
//     "carmenere": 53,
//     "syrah": 81
//   },
//   {
//     "taste": "sunny",
//     "chardonay": 24,
//     "carmenere": 53,
//     "syrah": 81
//   },
//   {
//     "taste": "sunny",
//     "chardonay": 24,
//     "carmenere": 53,
//     "syrah": 81
//   },
//   {
//     "taste": "sunny",
//     "chardonay": 24,
//     "carmenere": 53,
//     "syrah": 81
//   },
//   {
//     "taste": "sunny",
//     "chardonay": 24,
//     "carmenere": 53,
//     "syrah": 81
//   },
//   {
//     "taste": "sunny",
//     "chardonay": 24,
//     "carmenere": 53,
//     "syrah": 81
//   },
//   {
//     "taste": "sunny",
//     "chardonay": 24,
//     "carmenere": 53,
//     "syrah": 81
//   },
//   {
//     "taste": "sunny",
//     "chardonay": 24,
//     "carmenere": 53,
//     "syrah": 81
//   }
// ]

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

  const makeScatterData = useCallback(() => {
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
    
  },[dailyEntries, lifestyleFactors, dailyEntryFactors, selectedLifestyleFactorIds, didOrDidNot])

  const handleSelectFactor = (id: number) => {
    if(selectedLifestyleFactorIds.includes(id)){
      return setSelectedLifestyleFactorIds(prev => prev.filter(prevId => prevId !== id))
    } else if (!selectedLifestyleFactorIds.includes(id)){
      return setSelectedLifestyleFactorIds(prev => [...prev, id])
    }
  }

  const populateSelectedLifestyleFactors = useCallback(() => {
    setSelectedLifestyleFactorIds(lifestyleFactors.map(factor => factor.lifestyle_factor_id))
  },[lifestyleFactors])

  useEffect(()=> {
    if(user && !error && !isLoading) setUserLoaded(true)
  },[user, error, isLoading]) 

  useEffect(()=> {
    if(userLoaded && user) {
      getLifestyleFactors(user).then(factors => setLifestyleFactors(factors))
      getEntryFactors(user).then(entryFactors => setDailyEntryFactors(entryFactors))
      getDailyEntries(user).then(entries => setDailyEntries(entries))
      
    }
  },[userLoaded, user])

  useEffect(()=> {
    if(lifestyleFactors.length > 0 && dailyEntryFactors.length > 0 && dailyEntries.length > 0) {
      populateSelectedLifestyleFactors()
    }
  },[lifestyleFactors, dailyEntryFactors, dailyEntries, populateSelectedLifestyleFactors])

  useEffect(()=> {
  },[scatterChartData])

  useEffect(()=> {
    makeScatterData()
  },[selectedLifestyleFactorIds, didOrDidNot, makeScatterData])

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
        tooltip={({node }) => (
          <div className="flex flex-col items-center gap-2 p-2 bg-black bg-opacity-80 rounded-lg">
            <div className="flex items-center justify-start gap-2">
              <div className="h-4 w-4 rounded-lg" style={{'background' : node.color}}></div>
              <span className="text-secondary">{node.serieId}</span>

            </div>
            <div className="h-4 flex items-center text-sm gap-4 text-white">
              <span className="font-semibold">X: {node.data.x}</span>
              <span className="font-semibold">Y: {node.data.y}</span>


            </div>
              <span className="font-semibold text-secondary">Entries: {node.data.entries}</span>

          </div>
        )}
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
      lifestyleFactors.length > 0 ?
      lifestyleFactors.map((factor) => (
        <div className="flex gap-3 items-center h-12" key={factor.lifestyle_factor_id}>
          <Checkbox checked={selectedLifestyleFactorIds.includes(factor.lifestyle_factor_id)} onCheckedChange={()=> handleSelectFactor(factor.lifestyle_factor_id)} />
          <span>{factor.name}</span>

        </div>
      ))
      :
      <div className="text-gray-500">No Lifestyle Factors...</div>
      }
      </div>


      <div className="h-96 grow w-full">
        {/* <ResponsiveRadar
          data={demoData}
          keys={[ 'chardonay', 'carmenere', 'syrah' ]}
          indexBy="taste"
          valueFormat=">-.2f"
          margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
          borderColor={{ from: 'color' }}
          gridLabelOffset={36}
          dotSize={10}
          dotColor={{ theme: 'background' }}
          dotBorderWidth={2}
          colors={{ scheme: 'nivo' }}
          blendMode="multiply"
          motionConfig="wobbly"
          legends={[
            {
              anchor: 'top-left',
              direction: 'column',
              translateX: -50,
              translateY: -40,
              itemWidth: 80,
              itemHeight: 20,
              itemTextColor: '#999',
              symbolSize: 12,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#000'
                  }
                }
              ]
            }
          ]}
        /> */}


      </div>
    </div>
  )
}