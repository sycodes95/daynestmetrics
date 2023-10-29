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
import { Oval } from 'react-loader-spinner'

type DailyEntryProps = {
  currentDate: string;
}

export type DailyEntry = {
  daily_entry_id: number,
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
        setDidToday(prev =>  {
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
      const putDailyEntry: DailyEntry = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/daily-entry/day`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dailyEntryData)
      }).then(result => result.json())

      if(!putDailyEntry) return null
      
      const getDayFactors = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/daily-entry/day-factor?user_id=${pgUser.user_id}&daily_entry_id=${putDailyEntry.daily_entry_id}`)
      .then(res => res.json())

      console.log('day factors', getDayFactors);
      if(getDayFactors && getDayFactors.length > 0) {
        //if daily entry is saved successfully and day factors already exist for this day, delete all factors.
        const deleted = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/daily-entry/day-factor`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id: pgUser.user_id,
            daily_entry_id: putDailyEntry.daily_entry_id,
          })
        }).then(res => res.json())

        if(!deleted) return 


      } 
      
      const didPromises = Promise.all(didToday.map(async (factor) => {
        const posted = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/daily-entry/day-factor`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            daily_entry_id: putDailyEntry.daily_entry_id,
            lifestyle_factor_id: factor.lifestyle_factor_id,
            user_id: pgUser.user_id,
            did: true
          })
        }).then(res => res.json())
        if(posted) return posted
         

      }))
      //so there should be only 2 rows in daily factors, lets check
      const didNotPromises = Promise.all(didNotDoToday.map(async (factor) => {
        const posted = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/daily-entry/day-factor`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            daily_entry_id: putDailyEntry.daily_entry_id,
            lifestyle_factor_id: factor.lifestyle_factor_id,
            user_id: pgUser.user_id,
            did: false
          })
        }).then(res => res.json())

        if(posted) return posted

      }))

      setDailyEntryIsSaving(false)


      console.log(putDailyEntry, didPromises, didNotPromises)
    } catch (err) {
      console.error('error saving daily entry', err)
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

  


  // now lets test if it deletes it when saving it again
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
