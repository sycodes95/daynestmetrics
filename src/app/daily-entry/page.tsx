'use client'

import { Slider } from "@/components/ui/slider"

import { useEffect, useState } from "react"

import TaskAltIcon from '@mui/icons-material/TaskAlt';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Button } from "@/components/ui/button";
import { useUser } from "@auth0/nextjs-auth0/client";
import { LifestyleCategory } from "../lifestyle-factors/page";
import { getLifestyleFactors } from "@/lib/lifestyle-factors/getLifestyleFactors";

export default function DailyEntry() {

  const { user, error, isLoading } = useUser();

  

  const [lifestyleFactors, setLifestyleFactors] = useState<LifestyleCategory[]>([])

  useEffect(()=> {

    if(user && !error && !isLoading) {
      getLifestyleFactors(user).then(lsFactors => {
        if(lsFactors) {
          setLifestyleFactors(lsFactors.filter(cat => cat.name))
        }
      })
    }
  },[user, error, isLoading])

  useEffect(()=> {
    console.log(lifestyleFactors);
  },[lifestyleFactors])

  const [didToday, setDidToday] = useState<string[]>()
  const [didNotDoToday, setDidNotDoToday] = useState<string[]>()

  const [moodValue, setMoodValue] = useState(0)
  const [productivityValue, setProductivityValue] = useState(0)

  useEffect(()=> {
    console.log(productivityValue);
  },[productivityValue])
  return (
    <div className="flex flex-col gap-8 h-full grow ">
      {/* <span className="text-xl mt-2">How was your day?</span> */}
      <span className="text-xl mt-2">Oct 10 2023</span>

      <div className="flex flex-col gap-4 ">
        <div className="flex justify-between">
          <span>Mood Rating</span>
          <span>{moodValue} / 10</span>
        </div>
        <Slider className=""
        defaultValue={[0]} 
        max={10} step={1} 
        onValueChange={(e) => setMoodValue(e[0])}
        />
      </div>

      <div className="flex flex-col gap-4 ">
        <div className="flex justify-between">
          <span>Productivity Rating</span>
          <span>{productivityValue} / 10</span>
        </div>
        <Slider className=""
        defaultValue={[0]} 
        max={10} step={1} 
        onValueChange={(e) => setProductivityValue(e[0])}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full grow">
      
        <div className="relative flex flex-col flex-1  gap-2">
          <span className="sticky top-0">Lifestyle Factors</span>
          <div className="w-full md:max-h-96 flex flex-col flex-1 gap-2 md:overflow-y-auto ">
            {
            lifestyleFactors.map((category, index) => (
              <div key={index} className="w-full flex flex-col gap-2 rounded-lg ">
                <span className="whitespace-nowrap overflow-hidden text-ellipsis font-semibold text-black border border-b-gray-400">
                  {category.name}
                </span>
                {
                category.factors.map((factor, index) => (
                  <div className="flex items-center justify-between gap-2 w-full" key={factor.nano_id}>
                    <span className="">{factor.name}</span>
                    <div className="flex gap-2">
                      <button className="text-gray-400 cursor-pointer hover:text-emerald-400 transition-all">
                        <TaskAltIcon className=""  />
                      </button>
                      <button className="text-gray-400 cursor-pointer hover:text-red-400 transition-all">
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
          <span>Journal</span>
          <textarea className="md:h-full h-80 rounded-lg border border-gray-300 p-4 outline-none resize-none" placeholder="..." name="journal" id=""></textarea>
        </div>

      </div>

      <div className="flex justify-end">
        <Button>Save</Button>
      </div>
      
    </div>
  )
}