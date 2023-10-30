'use client'

import { useEffect, useState } from "react"

import { Slider } from "@/components/ui/slider"
import TaskAltIcon from '@mui/icons-material/TaskAlt';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Button } from "@/components/ui/button";
import { useUser } from "@auth0/nextjs-auth0/client";
import { LifestyleCategory, LifestyleFactor } from "../lifestyle-factors/page";
import { getLifestyleFactors } from "@/lib/lifestyle-factors/getLifestyleFactors";
import { getUserPG } from "@/lib/user/getUserPG";
import { Oval } from 'react-loader-spinner'
import { putDailyEntry } from "./services/putDailyEntry";
import { getDayFactors } from "./services/getDayFactors";
import { deleteDailyFactors } from "./services/deleteDayFactors";
import { didDailyFactors, postDailyFactors } from "./services/postDailyFactors";

type DailyEntryProps = {
  currentDate: string;
}

export type DailyEntry = {
  daily_entry_id?: number,
  entry_date: string,
  journal: string,
  mood_rating: number,
  productivity_rating: number,
  user_id: number,
}

export default function DailyEntry( { currentDate } : DailyEntryProps) {

  const { user, error, isLoading } = useUser();

  const [lifestyleFactors, setLifestyleFactors] = useState<LifestyleCategory[]>([])

  const [didToday, setDidToday] = useState<LifestyleFactor[]>([])

  const [didNotDoToday, setDidNotDoToday] = useState<LifestyleFactor[]>([])

  const [moodRating, setMoodRating] = useState(0)

  const [productivityRating, setProductivityRating] = useState(0)
  
  const [journalValue, setJournalValue] = useState('')
  
  const [dailyEntryIsSaving, setDailyEntryIsSaving] = useState(false)

  useEffect(()=> {
    
    if(user && !error && !isLoading) {
      getDailyEntry()
    }
    
  },[user, error, isLoading])

  const handleDidOrNot = (factor : LifestyleFactor, didOrNot: string) => {
    if(didOrNot === 'did') {

      if(!didToday.some(f=> f.lifestyle_factor_id === factor.lifestyle_factor_id)){
        // if factor doesn't already exist in did today, add it
        setDidToday(prev => [...prev, factor])
      } else {
        // if factor DOES already exist in did today, remove it.
        setDidToday(prev => {
          const updated = prev.filter(pre => pre.lifestyle_factor_id !== factor.lifestyle_factor_id)
          return updated
        })
      };

      if(didNotDoToday.some(f=> f.lifestyle_factor_id === factor.lifestyle_factor_id)){
        // if factor exist in didNot state, remove it
        const newArr = Array.from(didNotDoToday).filter(f => f.lifestyle_factor_id !== factor.lifestyle_factor_id)
        setDidNotDoToday(newArr)
      }
    }

    if(didOrNot === 'did not'){
      if(!didNotDoToday.some(f=> f.lifestyle_factor_id === factor.lifestyle_factor_id)) {
        // if factor doesn't already exist in didNot today, add it
        setDidNotDoToday(prev => [...prev, factor])
      } else {
        setDidNotDoToday(prev =>  {
        // if factor DOES already exist in didNot today, remove it.
          const updated = prev.filter(pre => pre.lifestyle_factor_id !== factor.lifestyle_factor_id)
          return updated
        })

      }

      if(didToday.some(f => f.lifestyle_factor_id === factor.lifestyle_factor_id)){
        // if factor exist in did state, remove it
        const newArr = Array.from(didToday).filter(f => f.lifestyle_factor_id !== factor.lifestyle_factor_id)
        setDidToday(newArr)
      }
    }
  }


  const getDailyEntry = async () => {
    const pgUser = await getUserPG(user)

    if(!pgUser) return null
    const entry: DailyEntry = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/daily-entry/day?entry_date=${currentDate}&user_id=${pgUser.user_id}`)
    .then(res => res.json())

    console.log(entry);

  }

  const handleSave = async () => {
    try {
      
      setDailyEntryIsSaving(true)

      const { user_id } = await getUserPG(user)

      if(!user_id) return null

      const dailyEntryData : DailyEntry = {
        user_id,
        entry_date: currentDate,
        mood_rating: moodRating,
        productivity_rating: productivityRating,
        journal : journalValue
      }

      const dailyEntry = await putDailyEntry(dailyEntryData)

      const daily_entry_id = dailyEntry?.daily_entry_id

      if(!dailyEntry || !daily_entry_id) return null
      
      const dayFactors = await getDayFactors(user_id, daily_entry_id)

      if(dayFactors && dayFactors.length > 0) {
        //if daily entry is saved successfully and day factors already exist for this day, delete all factors.

        const fetchDeleteDailyFactors = await deleteDailyFactors( user_id, daily_entry_id)
        
        if(!fetchDeleteDailyFactors) return null

      } 

      const postDailyFactorsResults = await postDailyFactors(didToday, didNotDoToday, daily_entry_id, user_id)
      
      if(!postDailyFactorsResults) return null

      

      return {
        
      }


    } catch (err) {

      console.error('error saving daily entry and corresponding factors', err)

      setDailyEntryIsSaving(false)

      return null
    }
  }

  useEffect(()=> {
    if(user && !error && !isLoading) {
      
      getLifestyleFactors(user).then(lsFactors => {
        if(lsFactors) {
          setLifestyleFactors(lsFactors.filter(cat => cat.name))

        }
      })
    }
  },[user, error, isLoading])

  

  return (
    <div className="flex flex-col gap-8 h-full grow ">
      <span className="text-xl mt-2">{currentDate}</span>

      <div className="flex flex-col gap-4 ">
        <div className="flex justify-between text-lg">
          <span>Mood Rating</span>
          <span>{moodRating} / 10</span>
        </div>
        <Slider className=""
        defaultValue={[0]} 
        max={10} step={1} 
        onValueChange={(e) => setMoodRating(e[0])}
        />
      </div>

      <div className="flex flex-col gap-4 ">
        <div className="flex justify-between text-lg">
          <span>Productivity Rating</span>
          <span>{productivityRating} / 10</span>
        </div>
        <Slider className=""
        defaultValue={[0]} 
        max={10} step={1} 
        onValueChange={(e) => setProductivityRating(e[0])}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full grow">
      
        <div className="relative flex flex-col flex-1  gap-2">
          <span className="text-lg text-left">Lifestyle Factors</span>
          <div className="w-full md:max-h-96 flex flex-col flex-1 gap-2 md:overflow-y-auto pt-2 pb-2">
            {
            lifestyleFactors.map((category, index) => (
              <div key={index} className="w-full flex flex-col gap-2 rounded-lg ">
                <span className="whitespace-nowrap overflow-hidden text-left text-ellipsis font-semibold text-black border border-b-gray-300 pt-2 pb-2">
                  {category.name}
                </span>
                {
                category.factors.map((factor, index) => (
                  <div className="flex items-center justify-between gap-2 w-full" key={factor.nano_id}>
                    <span className="">{factor.name}</span>
                    <div className="flex gap-2">
                      <button className={`
                      ${didToday.some(f => f.lifestyle_factor_id === factor.lifestyle_factor_id) ? 'text-emerald-400' : 'text-gray-400'}
                       cursor-pointer hover:text-emerald-400 transition-all
                      `}
                      onClick={()=> {
                        handleDidOrNot(factor, 'did')
                      }}>
                        <TaskAltIcon className=""  />
                      </button>
                      <button className={`
                      ${didNotDoToday.some(f => f.lifestyle_factor_id === factor.lifestyle_factor_id) ? 'text-red-400' : 'text-gray-400'}
                       cursor-pointer hover:text-red-400 transition-all
                      `}
                      onClick={()=> {
                        handleDidOrNot(factor, 'did not')
                      }}>
                        <HighlightOffIcon className="" />
                      </button>
                    </div>
                  </div>
                ))
                }
                
              </div>
            ))
            }
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-2  ">
          <span className="text-lg text-left">Journal</span>
          <textarea 
          className="md:h-full h-80 rounded-lg border border-gray-300 p-4 outline-none resize-none" 
          placeholder="..." 
          name="journal" 
          onChange={(e)=> setJournalValue(e.target.value)}
          id=""/>
        </div>

      </div>

      <div className="flex justify-end">
        <Button onClick={()=> handleSave()}>
          {
          dailyEntryIsSaving ? 
          <Oval
            height={20}
            width={20}
            color="#4fa94d"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor="#4fa94d"
            strokeWidth={2}
            strokeWidthSecondary={2}

          />
          :
          <span>Save</span>

          }
        </Button>
      </div>
      
    </div>
  )
}
