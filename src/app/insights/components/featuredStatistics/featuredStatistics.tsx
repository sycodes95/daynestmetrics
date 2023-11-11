import { DailyEntry } from "@/app/entryDialog/entryDialog";
import { DailyEntryFactor } from "@/types/dailyEntryFactor";
import { LifestyleFactor } from "@/types/lifestyleFactors";
import { useCallback, useEffect, useState } from "react"
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

type FeaturedStatisticsProps = {
  dailyEntries: DailyEntry[];
  lifestyleFactors: LifestyleFactor[];
  dailyEntryFactors: DailyEntryFactor[];
}

type FeaturedStatisticsState = {
  "Top Overall": FactorSumData[];
  "Top Mood": FactorSumData[];
  "Top Productivity": FactorSumData[];
  "Bottom Overall": FactorSumData[];
  "Bottom Mood": FactorSumData[];
  "Bottom Productivity": FactorSumData[];
}

type FeaturedStatisticsStateValue = {
  factor : string;
  avgRating: number;
}

type FactorSumData = {
  factor: string;
  overall: number;
  mood: number;
  productivity: number;
  entries: number;
  did: boolean;
}

export default function FeaturedStatistics( {dailyEntries, lifestyleFactors, dailyEntryFactors} : FeaturedStatisticsProps) {
  const [featuredStatistics, setFeaturedStatistics] = useState<FeaturedStatisticsState>({
    "Top Overall": [],
    "Top Mood": [],
    "Top Productivity": [],
    "Bottom Overall": [],
    "Bottom Mood": [],
    "Bottom Productivity": [],

  })

  const makeFeaturedStatisticsData = useCallback(() => {
    const factorSumData: Map<string, FactorSumData> = new Map<string, FactorSumData>();

    dailyEntries.forEach((entry) => {

      const { daily_entry_id, mood_rating, productivity_rating } = entry;

      const overall = ((mood_rating + productivity_rating) / 2);

      dailyEntryFactors.forEach((factor) => {
        if (factor.daily_entry_id !== daily_entry_id) {
          return;
        }

        // determine if the factor is "did" or "didNot"
        const status = factor.did ? 'Did' : 'DidNot';
        const factorName = lifestyleFactors.find(lf => lf.lifestyle_factor_id === factor.lifestyle_factor_id)?.name;

        if (factorName) {
          const key = `${factorName}-${status}`;
          const data = factorSumData.get(key) 
          || { factor: factorName, overall: 0, mood: 0, productivity: 0, entries: 0, did: status === 'Did' ? true : false};

          data.mood = (data.mood * data.entries + mood_rating) / (data.entries + 1);
          data.productivity = (data.productivity * data.entries + productivity_rating) / (data.entries + 1);
          data.overall = (data.overall * data.entries + overall) / (data.entries + 1);
          data.entries += 1;
          data.did = status === 'Did' ? true : false

          factorSumData.set(key, data);
        }
      });
    });
    // Convert the Map to an array of data objects.
    const factorSumsData = Array.from(factorSumData.values());

    const sortedByOverall = factorSumsData.map(data => data).sort((a, b) => b.overall - a.overall)
    const sortedByMood = factorSumsData.map(data => data).sort((a, b) => b.mood - a.mood)
    const sortedByProductivity = factorSumsData.map(data => data).sort((a, b) => b.productivity - a.productivity)

    setFeaturedStatistics({
      "Top Overall": getTopAndBottomThreeElements(sortedByOverall).top,
      "Top Mood": getTopAndBottomThreeElements(sortedByMood).top,
      "Top Productivity": getTopAndBottomThreeElements(sortedByProductivity).top,
      "Bottom Overall": getTopAndBottomThreeElements(sortedByOverall).bottom,
      "Bottom Mood": getTopAndBottomThreeElements(sortedByMood).bottom,
      "Bottom Productivity": getTopAndBottomThreeElements(sortedByProductivity).bottom
      
    })
    
  },[dailyEntries, lifestyleFactors, dailyEntryFactors])  

  const getTopAndBottomThreeElements = (arr: any[]) => {
    return {
      top: Array.from(arr).splice(0, 3),
      bottom: Array.from(arr).reverse().splice(0, 3)
    }
  }

  useEffect(()=> {
    const allDataIsAvailable = dailyEntries.length > 0 && lifestyleFactors.length > 0 && dailyEntryFactors.length > 0
    if(allDataIsAvailable) makeFeaturedStatisticsData()

  },[dailyEntries, lifestyleFactors, dailyEntryFactors, makeFeaturedStatisticsData])

  const getCorrectFactorAvgByKey = (key: string, factor: FactorSumData) => {
    switch (key) {
      case "Top Overall": return factor.overall
      case "Top Mood": return factor.mood
      case "Top Productivity": return factor.productivity
      case "Bottom Overall": return factor.overall
      case "Bottom Mood": return factor.mood
      case "Bottom Productivity": return factor.productivity
      default: return null
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-gray-500 text-xl">
        Featured Statistics
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {
        Object.entries(featuredStatistics).map(([key, factors]) => (
          <div className="flex flex-col w-full gap-2 p-2" key={key}>
            <div className="flex justify-start gap-2 text-md">
              {
              key.includes("Top") ? 
              <KeyboardDoubleArrowUpIcon className="text-teal"/>
              :
              <KeyboardDoubleArrowDownIcon className="text-red-500"/>
              }
              <span className="flex items-center">
                {key}
              </span>
            </div>
            {
            factors.length > 0 ?
            factors.map((data, index) => (
              <div className={`flex gap-2 p-2 w-full ${index + 1 < factors.length && 'border-b border-dotted'} border-black`} key={data.factor}>
                {/* <div className="w-[100px] h-[44px] min-h-max text-secondary bg-black flex items-center rounded-full justify-center text-center min-w-max">
                  {index + 1}
                </div> */}
                <div className="flex w-full flex-col overflow-hidden p-2">
                  <div className="flex flex-col gap-2 justify-between w-full overflow-hidden text-ellipsis">
                    <span className={`${data.did ? 'text-teal ' : ' text-red-500'} font-semibold border whitespace-nowrap text-xs  border-b-0 rounded-t-lg`}>{data.did ? 'Did' : 'Did Not'}</span>
                    <span className="whitespace-nowrap text-ellipsis overflow-hidden w-full font-semibold">{data.factor}</span>
                    <div className="flex justify-between rounded-b-lg rounded-lg">
                      <span>Average</span>
                      <span className=" rounded-lg bg-primary w-12 text-primary-foreground flex justify-center items-center">{getCorrectFactorAvgByKey(key, data)?.toFixed(1)}</span>

                    </div>
                    

                  </div>
                  

                  
                </div>
              </div>
            ))
            :
            <div className="">Not Enough Data Yet</div>
            }
          </div>
          
        ))
        }

      </div>
      
    </div>
  )
}