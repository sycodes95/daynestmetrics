
'use client'

import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Button } from "@/components/ui/button";
import { nanoid } from 'nanoid'

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover" 
import { getUser } from "@/lib/getUser";
import { getUserId } from "@/lib/getUserId";

import { useUser } from '@auth0/nextjs-auth0/client';


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
};



export default function LifestyleFactors() {

  const { user, error, isLoading } = useUser();

  const [lifestyleFactors, setLifestyleFactors] = useState<LifestyleCategory[]>([])

  useEffect(()=> {
    
    getLifestyleFactors()
    
  },[])

  useEffect(()=> {
    console.log(lifestyleFactors);
    
  },[lifestyleFactors])

  async function getLifestyleFactors() {
    const pgUser = await getUserId(user)

    const defaultArray: LifestyleCategory[] = Array.from({ length: 12 }, (_, index) => ({
      name: '', 
      order_position: index,
      factors: [],
    }));

    const lifestyleCategories = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/lifestyle-factors/category?user_id=${pgUser.user_id}`).then(res => res.json())

    const lifestyleFactors = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/lifestyle-factors/factor?user_id=${pgUser.user_id}`).then(res => res.json())

    lifestyleCategories.forEach((data: LifestyleCategory) => {
      defaultArray[data.order_position] = {
        user_id : data.user_id,
        lifestyle_category_id : data.lifestyle_category_id,
        name : data.name,
        order_position : data.order_position,
        factors : [],
      }
    });

    lifestyleFactors.forEach((data: LifestyleFactor) => {
      const categoryIndex = defaultArray.findIndex(el => el.lifestyle_category_id === data.lifestyle_category_id)
      defaultArray[categoryIndex].factors.push(data)
    })

    setLifestyleFactors(defaultArray)

  }

  const createOrUpdateCategory = async (catIndex: number) => {
    const pgUser = await getUserId(user)
    const lifestyleCategory = lifestyleFactors[catIndex]
    const result = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/lifestyle-factors/category?user_id=${pgUser.user_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(lifestyleCategory)
    })
    .then(res => res.json())

  }

  const updateFactor = async () => {
    const patchFactor = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/lifestyle-factors/factor`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(factor)
    })

  }

  const replaceLifestyleCategory = (categoryIndex: number, value: string) => {
    const newLifestyleFactors = [...lifestyleFactors];
    const newFactors = [...newLifestyleFactors[categoryIndex].factors]
    newLifestyleFactors[categoryIndex] = { name: value, order_position: categoryIndex, factors: newFactors};
    setLifestyleFactors(newLifestyleFactors)
  }

  const replaceLifestyleFactor = async (categoryIndex: number, nano_id: string, value: string) => {
    const newLifestyleFactors = [...lifestyleFactors];
    const factor = newLifestyleFactors[categoryIndex].factors.find(f => f.nano_id === nano_id);

    if (factor) {
      factor.name = value;
      setLifestyleFactors(newLifestyleFactors);
    }
  }

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

    await addFactorToPG(factor)

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

  }

  const deleteFactorFromCategory = async (categoryIndex: number, lifestyle_factor_id: number | null, nano_id: string) => {
    const newLifestyleFactors = [...lifestyleFactors];

    const factorToDelete = newLifestyleFactors[categoryIndex].factors.find(data => data.lifestyle_factor_id === lifestyle_factor_id)

    const deleteFactor = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/lifestyle-factors/factor`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(factorToDelete)
    })

    newLifestyleFactors[categoryIndex].factors = newLifestyleFactors[categoryIndex].factors.filter(factor => factor.nano_id !== nano_id);
    
    setLifestyleFactors(newLifestyleFactors);

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
            <Input className="w-full " 
            value={lifestyleFactors[catIndex].name}  
            onChange={(e) => replaceLifestyleCategory(catIndex, e.target.value)} 
            onBlur={()=> createOrUpdateCategory(catIndex) }
            placeholder={`Category ${catIndex + 1}`} />
            <Button className="bg-primary text-primary-foreground" onClick={()=> {
              if(data.name) {
                addFactorToCategory(catIndex)
              }
            }} variant={'outline'}>Add</Button>
          </div>
          <div className="h-full ">
            {
            data.factors.map((factor) => (
              <div key={factor.nano_id} className="flex items-center h-fit ">
                <Input  className="h-10" value={factor.name} 
                onChange={(e) => replaceLifestyleFactor(catIndex, factor.nano_id, e.target.value)}  

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
                          factor.nano_id
                          )

                        
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

