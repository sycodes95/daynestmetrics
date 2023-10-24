
'use client'

import { Input } from "@/components/ui/input"
import { useState } from "react"
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Button } from "@/components/ui/button";
type LifestyleFactors = {
  category: number;
  factors: string[];
}[]
export default function Habits() {

  const [lifestyleFactors, setlifestyleFactors] = useState<LifestyleFactors>(Array(12).fill({
    category: '',
    factors: ['meow', 'bark','meow', 'bark','meow', ]
  }))

  const replaceLifestyleFactor = (categoryIndex: number, factorIndex: number, value: string) => {
    const newLifestyleFactors = [...lifestyleFactors];
    const newFactors = [...newLifestyleFactors[categoryIndex].factors];
    newFactors[factorIndex] = value;
    newLifestyleFactors[categoryIndex] = { ...newLifestyleFactors[categoryIndex], factors: newFactors };
    setlifestyleFactors(newLifestyleFactors);
  }


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
      gap-x-4 gap-y-8 
      justify-between">
      
      {
      lifestyleFactors.map((data, catIndex) => (
        <div key={catIndex} className="rounded-lg text-black w-full h-full flex flex-col gap-2 ">
          <div className="flex items-center h-fit gap-2 ">
            <Input className="w-full "  onChange={(e) => console.log(e.target.value)} placeholder={`Category ${catIndex + 1}`} />
            <Button className="bg-primary text-primary-foreground" variant={'outline'}>Add</Button>
          </div>
          <div>
            {
            data.factors.map((factor, facIndex) => (
              <div key={facIndex} className="flex items-center ">
                <Input  className="" value={factor} onChange={(e) => replaceLifestyleFactor(catIndex, facIndex, e.target.value)}  placeholder="test"/>
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
//im gonna go workout, see u in an hour :)