import { useCallback, useEffect, useState } from "react"
import { DailyEntry } from "@/app/entryDialog/entryDialog";
import { DailyEntryFactor } from "@/types/dailyEntryFactor";
import { LifestyleFactor } from "@/types/lifestyleFactors";
import { DateRange } from "react-day-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import { format } from "date-fns"
import { cn } from "@/lib/utils"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "@radix-ui/react-icons"


type ScatterPlotProps = {
  dailyEntries: DailyEntry[], 
  lifestyleFactors: LifestyleFactor[], 
  dailyEntryFactors: DailyEntryFactor[], 
}

type ScatterChartData = {
  id: string;
  data: { y:number,  x:number, entries:number}[]
}

export default function ScatterPlot ({
  dailyEntries,
  lifestyleFactors,
  dailyEntryFactors,
}: ScatterPlotProps) {


  const [scatterChartData, setScatterChartData] = useState<ScatterChartData[]>([])

  const [selectedLifestyleFactorIds, setSelectedLifestyleFactorIds] = useState<number[]>([])

  const [didOrDidNot, setDidOrDidNot] = useState<"Did" | "Did Not">("Did")

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined
  })

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

      const dailyEntriesWithinDateRange = dailyEntries.filter(entry => {
        const entryDate = new Date(entry.entry_date)

        if(dateRange && dateRange.from && dateRange.to && entryDate <= dateRange.to && entryDate >= dateRange.from) {
          //if date range has a date for both from and to add entry to filtered array
          return true
        } else if(!dateRange || (!dateRange.from && !dateRange.to)){
          //if there is no date range or any corresponding properties add entry to array
          return true
        }
      } )

      // get y and x values from all entries that has selected factor that references the entry
      const entriesYXValues = entryFactors.map(eF => {
        const entry = dailyEntriesWithinDateRange.find(e => e.daily_entry_id === eF.daily_entry_id);
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
    
  },[dailyEntries, lifestyleFactors, dailyEntryFactors, selectedLifestyleFactorIds, didOrDidNot, dateRange])

  const resetDateRange = () => {
    setDateRange({
      from: undefined,
      to: undefined
    })
  }

  const populateSelectedLifestyleFactors = useCallback(() => {
    setSelectedLifestyleFactorIds(lifestyleFactors.map(factor => factor.lifestyle_factor_id))
  },[lifestyleFactors])

  const handleSelectFactor = (id: number) => {
    if(selectedLifestyleFactorIds.includes(id)){
      return setSelectedLifestyleFactorIds(prev => prev.filter(prevId => prevId !== id))
    } else if (!selectedLifestyleFactorIds.includes(id)){
      return setSelectedLifestyleFactorIds(prev => [...prev, id])
    }
  }

  useEffect(()=> {
    if(lifestyleFactors.length > 0 && dailyEntryFactors.length > 0 && dailyEntries.length > 0) {
      // makeFeaturedStatisticsData()
      populateSelectedLifestyleFactors()
    }
  },[lifestyleFactors, dailyEntryFactors, dailyEntries, populateSelectedLifestyleFactors])

  useEffect(()=> {
    makeScatterData()
    
  },[selectedLifestyleFactorIds, didOrDidNot, makeScatterData, dateRange])

  return (
    <div className="flex flex-col gap-2">
      <div>
        <span className="text-xl text-gray-500">Scatter Plot</span>
      </div>
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="dateRange"
              variant={'ghost'}
              className={cn(
                "w-fit justify-start text-left font-normal h-8 hover:bg-none ",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-background bg-opacity-40" align="start">
            <Calendar
              className="bg-opacity-20"
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={(dateRange) => {
                setDateRange(dateRange)
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <Button className="p-2 h-6 w-16" onClick={()=> resetDateRange()}>
          Reset
        </Button>

      </div>
      <div className="h-96 w-full">
        <ResponsiveScatterPlot
          data={scatterChartData}
          margin={{ top: 40, right: 120, bottom: 60, left: 50 }}
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
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Productivity',
            legendPosition: 'middle',
            legendOffset: 46,
            tickValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
          }}
          axisLeft={{
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

      <div className="flex items-center pl-4 pr-4">
        <button 
        className={`${didOrDidNot === 'Did' ? 'border-black' : 'border-gray-400'} p-2  border rounded-l-lg w-20 h-8 flex items-center justify-center `}
        onClick={()=> setDidOrDidNot('Did')}
        >Did</button>
        <button 
        className={`${didOrDidNot === 'Did Not' ? 'border-black' : 'border-gray-400'} p-2  border rounded-r-lg w-20 h-8 flex items-center justify-center `}
        onClick={()=> setDidOrDidNot('Did Not')}
        >Did Not</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 w-full h-fit p-4">
        { 
          lifestyleFactors.length > 0 ?
          lifestyleFactors.map((factor) => (
          <div className="flex gap-3 items-center h-8" key={factor.lifestyle_factor_id}>
            <Checkbox checked={selectedLifestyleFactorIds.includes(factor.lifestyle_factor_id)} onCheckedChange={()=> handleSelectFactor(factor.lifestyle_factor_id)} />
            <span>{factor.name}</span>

          </div>
          ))
          :
          <div className="text-gray-500">No Lifestyle Factors...</div>
        }
      </div>
    </div>
  )
}