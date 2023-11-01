
'use client'

import { useEffect, useState } from "react"

import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover" 

import { AlertCircle } from "lucide-react"
 
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import { useUser } from '@auth0/nextjs-auth0/client';
import { getLifestyleFactors } from "@/lib/lifestyle-factors/getLifestyleFactors";
import { updateLifestyleCategory } from "./utils/replaceLifestyleCategory";
import { createOrUpdateCategoryPG } from "./utils/createOrUpdateCategoryPG";
import { updateFactorPG } from "./utils/updateFactorPG";
import { updateLifestyleFactors } from "./utils/updateLifestyleFactors";
import { deleteFactorFromCategory } from "./utils/deleteFactorFromCategory";
import { addFactorToCategory } from "./utils/addFactorToCategory";
import PageHeading from "@/components/pageHeading";
import { LifestyleCategory } from "@/types/lifestyleFactors";


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

  return (
    <>
      {
      user &&
      <div className="flex flex-col gap-8 w-full">
        <div className="flex flex-col justify-between gap-4  items-center w-full">
           <PageHeading
            header="Lifestyle Factors"
            body="Add lifestyle factors that you want to track daily."
            >
              <DirectionsRunIcon />
            </PageHeading>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription className="text-xs">
              Deleting any lifestyle factors that are used in a daily entry will also remove it from the entry.
            </AlertDescription>
          </Alert>
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
                addFactorToCategory(catIndex, lifestyleFactors, user).then(newState => {
                  if(newState)  setLifestyleFactors(newState)
                })
                
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
                        user,
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
      }
    </>
  )
}
