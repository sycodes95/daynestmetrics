
'use client'

import { Input } from "@/components/ui/input"
import { useState } from "react"
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Button } from "@/components/ui/button";

export default function Habits() {

  const [lifestyleFactors, setlifestyleFactors] = useState(Array(12).fill({
    category: '',
    habits: ['meow', 'bark']
  }))

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-2 w-full"> 
        <div className="text-primary text-2xl flex gap-2 items-center">
          <span>
            Lifestyle Factors
          </span>
          <DirectionsRunIcon />

        </div>

        <span className="text-gray-500 ">
          Add lifestyle factors that you want to track daily.
        </span>

      </div>
      

      <div className="w-full h-full grid 
      grid-cols-1 
      sm:grid-cols-2 
      md:grid-cols-3  
      lg:grid-cols-4 
      gap-4 
      justify-between">
      
      {
      lifestyleFactors.map((data, index) => (
        <div key={index} className="rounded-lg text-black w-full h-full flex flex-col gap-2 ">
          <div className="flex items-center h-fit gap-2 ">
            <Input className="w-full "  onChange={(e) => console.log(e.target.value)} placeholder={`Category ${index + 1}`} />
            <Button className="bg-primary text-primary-foreground" variant={'outline'}>Add</Button>
          </div>
          <div>
            {
            data.habits.map((habit, index) => (
              <div key={index} className="flex items-center ">
                <Input key={index} className="" value={habit} placeholder="test"/>
                <button ><DeleteOutlineIcon /></button>
                
              </div>
            ))
            }
          </div>
        </div>
      ))
      }
      </div>
    </div>
  )
}

//currently trying to come up with how i want to layout this page.
// not sure if i should even make a category, maybe just list out each habit in a simple table...
//i dont think people would use more than 20 habits 
//most common ones are likely, exercise, eat clean, meditate, drink , drugs?
// i think categories would be nice tho, currently thinking how im going to implement this in my head..
//i think on unfocus is better.
//i think i need to add error if user tries to add a factor under category that doesnt have a category name