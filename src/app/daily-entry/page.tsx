'use client'

import { Slider } from "@/components/ui/slider"

import { useEffect, useState } from "react"

import TaskAltIcon from '@mui/icons-material/TaskAlt';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Button } from "@/components/ui/button";
import { useUser } from "@auth0/nextjs-auth0/client";
import { LifestyleCategory, LifestyleFactor } from "../lifestyle-factors/page";
import { getLifestyleFactors } from "@/lib/lifestyle-factors/getLifestyleFactors";
import { getUserPG } from "@/lib/user/getUserPG";
import { getMDYFromDate } from "@/util/getMDYFromDate";

type DailyEntryProps = {
  currentDate: string;
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
    console.log(currentDate);
    if(user && !error && !isLoading) {
      getDailyEntry()
    }

  },[user, error, isLoading])

  const handleDidOrNot = (factor : LifestyleFactor, didOrNot: string) => {
    if(didOrNot === 'did') {

      if(!didToday.some(f=> f.lifestyle_factor_id === factor.lifestyle_factor_id)){
        setDidToday(prev => [...prev, factor])
      }

      if(didNotDoToday.some(f=> f.lifestyle_factor_id === factor.lifestyle_factor_id)){
        const newArr = Array.from(didNotDoToday).filter(f => f.lifestyle_factor_id !== factor.lifestyle_factor_id)
        setDidNotDoToday(newArr)
      }
    }

    if(didOrNot === 'did not'){
      if(!didNotDoToday.some(f=> f.lifestyle_factor_id === factor.lifestyle_factor_id)) {
        setDidNotDoToday(prev => [...prev, factor])
      }

      if(didToday.some(f => f.lifestyle_factor_id === factor.lifestyle_factor_id)){
        const newArr = Array.from(didToday).filter(f => f.lifestyle_factor_id !== factor.lifestyle_factor_id)
        setDidToday(newArr)
      }
    }
  }

  const getDailyEntry = async () => {
    const pgUser = await getUserPG(user)

    if(!pgUser) return null
    const entry = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/daily-entry/day?entry_date=${currentDate}&user_id=${pgUser.user_id}`)
    .then(res => res.json())


    console.log(entry);

  }

  const handleSave = async () => {
    try {
      setDailyEntryIsSaving(true)
      const pgUser = await getUserPG(user)

      const dailyEntryData = {
        user_id: pgUser.user_id,
        entry_date: currentDate,
        mood_rating: moodRating,
        productivity_rating: productivityRating,
        journal : journalValue
      }
      const putDailyEntry = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/daily-entry/day`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dailyEntryData)
      }).then(result => result.json())


      console.log(putDailyEntry);
      
    } catch (error) {
      
    }
  }

  useEffect(()=> {
    console.log(currentDate);
    if(user && !error && !isLoading) {
      getLifestyleFactors(user).then(lsFactors => {
        if(lsFactors) {
          setLifestyleFactors(lsFactors.filter(cat => cat.name))

        }
      })
    }
  },[user, error, isLoading])

  useEffect(()=> {
    console.log(didToday);
  },[didToday])

  useEffect(()=> {
    console.log(lifestyleFactors);
  },[lifestyleFactors])
  return (
    <div className="flex flex-col gap-8 h-full grow ">
      {/* <span className="text-xl mt-2">How was your day?</span> */}
      {/* <span className="text-xl mt-2">{getMDYFromDate(currentDate)}</span> */}
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
        <Button onClick={()=> handleSave()}>Save</Button>
      </div>
      
    </div>
  )
}
