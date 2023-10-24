
'use client'

import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"



type LifestyleFactors = {
  category: string;
  factors: string[];
}[]
export default function LifestyleFactors() {

  const [lifestyleFactors, setlifestyleFactors] = useState<LifestyleFactors>([])

  const [openPopover, setOpenPopover] = useState<{ catIndex: number; facIndex: number } | null>(null);

  useEffect(()=> {
    if(lifestyleFactors.length < 1){
      const defaultArray = Array.from({ length: 12 }, (_, index) => ({
        category: '',
        factors: [],
        index
      }));
      setlifestyleFactors(defaultArray)
    }
    
  },[])

  const replaceLifestyleCategory = (categoryIndex: number, value: string) => {
    const newLifestyleFactors = [...lifestyleFactors];
    const newFactors = [...newLifestyleFactors[categoryIndex].factors]
    newLifestyleFactors[categoryIndex] = { category: value, factors: newFactors};
    setlifestyleFactors(newLifestyleFactors)
  }

  const replaceLifestyleFactor = (categoryIndex: number, factorIndex: number, value: string) => {
    const newLifestyleFactors = [...lifestyleFactors];
    const newFactors = [...newLifestyleFactors[categoryIndex].factors];
    newFactors[factorIndex] = value;
    newLifestyleFactors[categoryIndex] = { ...newLifestyleFactors[categoryIndex], factors: newFactors };
    setlifestyleFactors(newLifestyleFactors);
  }

  const addFactorToCategory = (categoryIndex: number) => {
    const newLifestyleFactors = [...lifestyleFactors];
    const newFactors = [...newLifestyleFactors[categoryIndex].factors]
    const newCategory = newLifestyleFactors[categoryIndex].category
    newFactors.push('')
    newLifestyleFactors[categoryIndex] = { category: newCategory, factors: newFactors};
    setlifestyleFactors(newLifestyleFactors)
  }

  const deleteFactorFromCategory = (categoryIndex: number, factorIndex: number) => {
    const newLifestyleFactors = [...lifestyleFactors];
    newLifestyleFactors[categoryIndex].factors.splice(factorIndex, 1)
    setlifestyleFactors(newLifestyleFactors)
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
      

      <div className="w-full h-fit 
      grid 
      grid-cols-1 
      sm:grid-cols-2 
      md:grid-cols-3  
      lg:grid-cols-4 
      gap-x-4 gap-y-8 
      items-center
      justify-between">

      {
      lifestyleFactors.map((data, catIndex) => (
        <div key={catIndex} className="rounded-lg text-black w-full h-full flex flex-col gap-2 ">
          <div className="flex items-center h-fit gap-2 ">
            <Input className="w-full " value={lifestyleFactors[catIndex].category}  onChange={(e) => replaceLifestyleCategory(catIndex, e.target.value)} placeholder={`Category ${catIndex + 1}`} />
            <Button className="bg-primary text-primary-foreground" onClick={()=> {
              if(data.category) {
                addFactorToCategory(catIndex)
              }
            }} variant={'outline'}>Add</Button>
          </div>
          <div className="h-full overflow-y-auto">
            {
            data.factors.map((factor, facIndex) => (
              <div key={facIndex} className="flex items-center ">
                <Input  className="" value={factor} onChange={(e) => replaceLifestyleFactor(catIndex, facIndex, e.target.value)}  placeholder="test"/>
                {/* <Popover open={undefined || (openPopover?.catIndex === catIndex && openPopover?.facIndex === facIndex)}> */}
                <button onClick={()=> {
                  deleteFactorFromCategory(catIndex, facIndex)
                  setOpenPopover(null);
                } }>
                  <DeleteOutlineIcon className="hover:text-red-500 transition-all" />
                </button>
                <Popover>
                  <PopoverTrigger onClick={() => setOpenPopover({ catIndex, facIndex })}>
                    <DeleteOutlineIcon className="hover:text-red-500 transition-all" />
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="flex flex-col gap-2">
                      <span>Are you sure you want to delete this factor?</span>
                      <Button variant={'destructive'} onClick={()=> {
                        deleteFactorFromCategory(catIndex, facIndex)
                        setOpenPopover(null);
                      } } >Delete</Button>
                    </div>
                  </PopoverContent>
                </Popover>
                
                
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

//i think i have to redesign lifestyle factors table in pg, for today i just want to finish front end part of this page.