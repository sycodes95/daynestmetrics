
'use client'

import { useEffect, useState } from "react"

import { nanoid } from 'nanoid'

import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover" 

import { getUserId } from "@/lib/user/getUserId";
import { useUser } from '@auth0/nextjs-auth0/client';
import { getLifestyleFactors } from "@/lib/lifestyle-factors/getLifestyleFactors";
import { replaceLifestyleCategory, updateLifestyleCategory } from "./utils/replaceLifestyleCategory";
import { createOrUpdateCategoryPG } from "./utils/createOrUpdateCategoryPG";
import { updateFactorPG } from "./utils/updateFactorPG";
import { updateLifestyleFactors } from "./utils/updateLifestyleFactors";
import { deleteFactorFromCategory } from "./utils/deleteFactorFromCategory";


export type LifestyleCategory = { 
  user_id? : number;
  lifestyle_category_id? : number;
  name: string;
  order_position: number;
  factors: LifestyleFactor[];
};

export type LifestyleFactor = { 
  user_id? : number;
  lifestyle_factor_id?: number;
  lifestyle_category_id? : number;
  nano_id: string; 
  name: string; 
  order_position: number;
  created_at? : string;
};


export default function LifestyleFactors() {

  const { user, error, isLoading } = useUser();

  const [lifestyleFactors, setLifestyleFactors] = useState<LifestyleCategory[]>([])

  useEffect(()=> {

    if(user && !error && !isLoading) getLSFactors()
  },[user, error, isLoading])


  async function getLSFactors () {

    if(user) {

      const lsFactors = await getLifestyleFactors(user)

      lsFactors && lsFactors.length > 0 ? setLifestyleFactors(lsFactors) : setLifestyleFactors([]) 

    };

  };


  const addFactorToCategory = async (categoryIndex: number) => {
    const pgUser = await getUserId(user)

    const newLifestyleFactors = [...lifestyleFactors];

    const newFactors = [...newLifestyleFactors[categoryIndex].factors]

    const { user_id, lifestyle_category_id, name } = newLifestyleFactors[categoryIndex]

    const factor = { 
      user_id: pgUser.user_id, 
      lifestyle_category_id,
      nano_id: nanoid(), 
      name: '', 
      order_position: newFactors.length
    }

    const addFactor = await addFactorToPG(factor)
    if(addFactor) getLSFactors()

    newFactors.push(factor);

    newLifestyleFactors[categoryIndex] = { 
      user_id, 
      lifestyle_category_id,
      name, 
      order_position: categoryIndex, 
      factors: newFactors
    };


    setLifestyleFactors(newLifestyleFactors)
  }

  const addFactorToPG = async (factor : LifestyleFactor) => {
    const result = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/lifestyle-factors/factor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(factor)
    })
    return result
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
      justify-between
      ">

      {
      lifestyleFactors.map((data, catIndex) => (
        <div key={catIndex} className="rounded-lg text-black w-full h-full flex flex-col gap-2 " >

          <div className="flex items-center h-fit gap-2 ">

            <Input className="w-full !border-b-1 border-gray-300 text-md text-gray-600 placeholder-shown:placeholder-gray-400 font-semibold caret-black" 
            value={lifestyleFactors[catIndex].name}  
            onChange={(e) => 
              setLifestyleFactors(updateLifestyleCategory(catIndex, e.target.value, lifestyleFactors))
            }
            onBlur={()=> 
              createOrUpdateCategoryPG(catIndex, user, lifestyleFactors).then(res => {
                if(res) getLSFactors()
              }) 
            }
            onKeyDown={(e) => {
              if(e.key === 'Enter') {

                createOrUpdateCategoryPG(catIndex, user, lifestyleFactors).then(res => {
                  if(res) getLSFactors()
                }) 

              }
            }}
            placeholder={`Category ${catIndex + 1}`} 
            />
            
            <Button className="bg-primary text-primary-foreground" onClick={()=> {
              addFactorToCategory(catIndex)
              
            }} variant={'outline'}>Add</Button>
          </div>


          <div className="h-full flex flex-col gap-1 ">
            {
            data.factors.map((factor) => (
            <div key={factor.nano_id} className="flex items-center h-fit  ">
              <Input  className="h-10 border-none placeholder-shown:placeholder-gray-400 text-sm shadow-sm shadow-slate-300" value={factor.name} 
              onChange={(e) => setLifestyleFactors(updateLifestyleFactors(catIndex, factor.nano_id, e.target.value, lifestyleFactors))}  
              onBlur={()=> updateFactorPG(catIndex, factor.nano_id, lifestyleFactors).then(res => {
                if(res) getLSFactors()
              })}
              placeholder="test"/>
              <Popover>
                <PopoverTrigger>
                  <DeleteOutlineIcon className="hover:text-red-500 transition-all" />
                </PopoverTrigger>
                <PopoverContent>
                  <div className="flex flex-col gap-2">
                    <span>Are you sure you want to delete this factor?</span>
                    <Button variant={'destructive'} onClick={()=> {
                      deleteFactorFromCategory(
                      catIndex, 
                      factor.lifestyle_factor_id ? factor.lifestyle_factor_id : null,  
                      factor.nano_id,
                      lifestyleFactors
                      ).then(res => {
                        if(res) setLifestyleFactors(res)
                      })
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
