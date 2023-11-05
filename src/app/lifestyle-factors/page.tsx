
'use client'

import { useEffect, useState } from "react"

import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover" 

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


import { AlertCircle } from "lucide-react"
 
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import { useUser } from '@auth0/nextjs-auth0/client';
import { getLifestyleFactorsInCategories } from "@/lib/lifestyle-factors/getLifestyleFactorsInCategories";
import { updateLifestyleCategory } from "./services/replaceLifestyleCategory";
import { createOrUpdateCategoryPG } from "./services/createOrUpdateCategoryPG";
import { updateFactorPG } from "./services/updateFactorPG";
import { updateLifestyleFactors } from "./services/updateLifestyleFactors";
import { deleteFactorFromCategory } from "./services/deleteFactorFromCategory";
import { addFactorToCategory } from "./services/addFactorToCategory";
import PageHeading from "@/components/pageHeading";
import { LifestyleCategory } from "@/types/lifestyleFactors";


export default function LifestyleFactors() {

  const { user, error, isLoading } = useUser();

  const [lifestyleCategories, setLifestyleCategories] = useState<LifestyleCategory[]>([])

  const [factorInput, setFactorInput] = useState('')

  const submitFactor = async (catIndex: number) => {

    const newLifestyleFactors = await addFactorToCategory(catIndex, lifestyleCategories, user, factorInput)

    if(newLifestyleFactors) {
      setLifestyleCategories(newLifestyleFactors)
    }

  }

  const archiveFactor = async (user_id: number, lifestyle_factor_id: number) => {

    const request = {
      archive: true,
      user_id,
      lifestyle_factor_id
    }

    const archiveFactor = await fetch (`${process.env.NEXT_PUBLIC_DOMAIN}/api/lifestyle-factors/archive`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    })

    if(archiveFactor) {
      const newLifestyleFactors = [...lifestyleCategories]
      
    }


  }
 
  useEffect(()=> {

    if(user && !error && !isLoading) getLSFactors()
  },[user, error, isLoading])


  async function getLSFactors () {

    if(user) {

      const lsFactors = await getLifestyleFactorsInCategories(user)

      lsFactors && lsFactors.length > 0 ? setLifestyleCategories(lsFactors) : setLifestyleCategories([]) 

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
        lifestyleCategories.map((data, catIndex) => (
          <div key={catIndex} className="rounded-lg text-black w-full h-full flex flex-col gap-2 " >

            <div className="flex items-center h-fit gap-2 ">

              <Input className="w-full !border-b-1 border-gray-300 focus:bg-background text-md  text-gray-600 placeholder-shown:placeholder-gray-400 font-semibold caret-black" 
              value={lifestyleCategories[catIndex].name}  
              onChange={(e) => 
                setLifestyleCategories(updateLifestyleCategory(catIndex, e.target.value, lifestyleCategories))
              }
              onBlur={()=> 
                createOrUpdateCategoryPG(catIndex, user, lifestyleCategories).then(res => {
                  if(res) getLSFactors()
                }) 
              }
              onKeyDown={(e) => {
                if(e.key === 'Enter') {
                  createOrUpdateCategoryPG(catIndex, user, lifestyleCategories).then(res => {
                    if(res) getLSFactors()
                  }) 
                }
              }}
              placeholder={`Category ${catIndex + 1}`} 
              />
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground" >Add</Button>

                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add factor</DialogTitle>
                    <DialogDescription>
                      Make sure to double check spelling, you cannot edit a factor once created!
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">
                        Factor
                      </Label>
                      <Input id="name" value={factorInput} onChange={(e)=> setFactorInput(e.target.value)} placeholder="..." className="col-span-3" />
                    </div>
                    
                  </div>
                  
                  <DialogFooter>
                    <DialogClose>
                      <Button type="submit" onClick={()=> submitFactor(catIndex)}>Save factor</Button>
                    </DialogClose>
                    
                  </DialogFooter>
                </DialogContent>
              </Dialog>

            </div>


            <div className="h-full flex flex-col gap-1 ">
              {
              data.factors.map((factor) => (
              <div key={factor.nano_id} className="flex items-center h-fit justify-between p-2">
                <span  className=" border-none placeholder-shown:placeholder-gray-400 text-sm shadow-sm shadow-slate-300" 
                >
                  {factor.name}
                </span>
                <Popover>
                  <PopoverTrigger>
                    <DeleteOutlineIcon className="hover:text-red-500 transition-all" />
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="flex flex-col gap-2">
                      <span>Are you sure you want to archive this factor?</span>
                      <Button variant={'destructive'} onClick={()=> archiveFactor(factor.user_id, factor.lifestyle_factor_id)} >Archive</Button>
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
