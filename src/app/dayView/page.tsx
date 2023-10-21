'use client'

import { useState } from "react"

export default function DayView() {

  const testFactors = [
    'nicotine',
    'coffee',
    'alcohol',
    'work out',
    'cardio',
    'meditation',
    'ice bath'
  ]

  const [factors, setFactors] = useState<string[]>(testFactors)
  const [didToday, setDidToday] = useState<string[]>()
  const [didNotDoToday, setDidNotDoToday] = useState<string[]>()
  
  return (
    <div className="flex flex-col gap-8">
      <span className="text-xl">Day</span>
      {
      
      }


    </div>
  )
}