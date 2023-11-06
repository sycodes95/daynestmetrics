'use client'

import { LifestyleCategory, LifestyleFactor } from "@/types/lifestyleFactors";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover" 

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { Button } from "@/components/ui/button";
import { getLifestyleCategories } from "@/lib/lifestyle-factors/getLifestyleCategories";
import EditCategory from "./editCategory";
import AddCircle from "@mui/icons-material/AddCircle";
import AddFactor from "./addFactor";
import CategorySection from "../categorySection/categorySection";
import { getUserIdFromSub } from "@/lib/user/getUserIdFromSub";
import ArchivedFactors from "../archivedFactors/archivedFactors";
import { useToast } from "@/components/ui/use-toast";

export default function LifestyleFactors () {

  const { user, error, isLoading } = useUser();

  const { toast } = useToast()

  const [userLoaded, setUserLoaded] = useState(false)

  const [lifestyleCategories, setLifestyleCategories] = useState<LifestyleCategory[]>([])

  const [archivedFactors, setArchivedFactors] = useState<LifestyleFactor[]>([])

  const [showArchived, setShowArchived] = useState(false)

  const [errorMessage, setErrorMessage] = useState('')

  const optimisticArchiveFactor = (
    user_id: number, 
    lifestyle_factor_id: number, 
    lifestyle_category_id: number
    ) => {

    setLifestyleCategories(prev => {

      const newLifestyleCategories = [...prev]

      const categoryIndexForFactor = newLifestyleCategories.findIndex(category => category.lifestyle_category_id === lifestyle_category_id)
      
      if(categoryIndexForFactor > -1) {

        const archivedFactorIndex = newLifestyleCategories[categoryIndexForFactor].factors.findIndex(
          factor => factor.lifestyle_factor_id === lifestyle_factor_id
        )
        archivedFactorIndex > -1 && newLifestyleCategories[categoryIndexForFactor].factors.splice(archivedFactorIndex, 1)
      }

      return newLifestyleCategories
    })

  }

  const archiveFactor = async (
    user_id: number, 
    lifestyle_factor_id: number, 
    ) => {

    try {

      const request = {
        archive: true,
        user_id,
        lifestyle_factor_id
      }

      const archiveFactor = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/lifestyle-factors/archive`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      })

      if(!archiveFactor) setErrorMessage('Error archiving lifestyle factor.') 
      
    } catch (error) {
      console.error('Error archiving lifestyle factor.', error)
      setErrorMessage('Error archiving lifestyle factor.') 
    }

  }
  
  useEffect(()=> {
    if(user && !error && !isLoading) setUserLoaded(true)
  },[user, error, isLoading])

  useEffect(() => {
    userLoaded && getLsCategories()
  },[userLoaded])

  async function getLsCategories () {

    if(user) {
      const lsFactors = await getLifestyleCategories(user)
      setLifestyleCategories(lsFactors)
    };

  };

  return (
    <>
      
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
        lifestyleCategories.map((category, catIndex) => (
        <CategorySection key={catIndex} className="rounded-lg text-black w-full h-full flex flex-col gap-2 " >

          <div className="flex items-center h-fit gap-2 ">

            <EditCategory 
            user={user}
            category={category}
            setLifestyleCategories={setLifestyleCategories}
            setErrorMessage={setErrorMessage}
            />

            <AddFactor 
            categoryIndex={catIndex}
            user={user}
            lifestyleCategories={lifestyleCategories}
            setLifestyleCategories={setLifestyleCategories}
            setErrorMessage={setErrorMessage}
            />

          </div>


          <div className="h-full flex flex-col gap-1 ">
            {
            category.factors.map((factor) => (
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
                    <Button 
                    variant={'destructive'} 
                    onClick={()=> {
                      optimisticArchiveFactor(factor.user_id, factor.lifestyle_factor_id, category.lifestyle_category_id)
                      archiveFactor(factor.user_id, factor.lifestyle_factor_id)
                      toast({
                        title: "Factor Archived",
                        description: `Factor Name : "${factor.name}`,
                        
                      })
                    }}
                      >Archive</Button>
                  </div>
                </PopoverContent>
              </Popover>
              
            </div>
            ))
            }
          </div>
        </CategorySection>
        ))
        }
      </div>

      <ArchivedFactors 
      user={user} 
      lifestyleCategories={lifestyleCategories}
      setLifestyleCategories={setLifestyleCategories}
      setErrorMessage={setErrorMessage}
      />

      {/* <Button className="w-fit h-fit bg-red-500 transition-all duration-300" onClick={()=> setShowArchived(prev => !prev)}>
        {!showArchived ? 'View Archived' : 'Hide Archived'}
      </Button>

      <div className={`${showArchived ? 'h-full opacity-100' : 'h-0 opacity-0 pointer-events-none'} w-full flex flex-col gap-4 transition-all duration-300`} >
        
        <div className="">
          <span className="text-2xl">Archived Factors</span>
        </div>

        <div className="w-full h-full flex flex-wrap gap-4 ">
          {
          archivedFactors.map((factor, index) => (
            <button className={`${factor.name ? 'text-primary' : 'text-gray-400'} p-2 border border-gray-300 h-fit rounded-lg hover:border-black transition-all`} key={factor.lifestyle_factor_id}>
              <span>{factor.name ? factor.name : 'N/A'}</span>
            </button>
          ))
          }

        </div>

      </div> */}
    </>
  )
}