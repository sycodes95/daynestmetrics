'use client'

import { Button } from "@/components/ui/button"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

import { getUserIdFromSub } from "@/lib/user/getUserIdFromSub"
import { LifestyleCategory, LifestyleFactor } from "@/types/lifestyleFactors"
import { UserProfile } from "@auth0/nextjs-auth0/client"
import { useEffect, useState } from "react"
import { tr } from "date-fns/locale"

type ArchivedFactors = {
  user: UserProfile | undefined;
  lifestyleCategories: LifestyleCategory[];
  setLifestyleCategories: React.Dispatch<React.SetStateAction<LifestyleCategory[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

export default function ArchivedFactors ({ 
  user, 
  lifestyleCategories,
  setLifestyleCategories,
  setErrorMessage
}: ArchivedFactors
  ) {

  const { toast } = useToast()

  const [archivedFactors, setArchivedFactors] = useState<LifestyleFactor[]>([])
  const [showArchived, setShowArchived] = useState(false)

  const getAllArchivedFactors = async () => {
    try {

      if(!user) return

      const user_id = await getUserIdFromSub(user)
      const fetchGet = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/lifestyle-factors/all-archived-factors?user_id=${user_id}`)

      const archivedFactors = await fetchGet.json()

      setArchivedFactors(archivedFactors)      
    } catch (error) {
      console.error('Error fetching archived factors' , error)


    }
  }

  const findArchivedFactorCategoryName = (factor: LifestyleFactor) => {
    const category = lifestyleCategories.find(cat => cat.lifestyle_category_id === factor.lifestyle_category_id)
    if(!category || !category.name) return 'N/A'
    return category.name
  }
  

  const optimisticRemoveFromArchivedList = (factor: LifestyleFactor) => {
    setArchivedFactors(prev => prev.filter(prevFactor => prevFactor.lifestyle_factor_id !== factor.lifestyle_factor_id))
  }

  const optimisticReinstateArchived = (factor: LifestyleFactor) => {
    console.log('TWICE');
    setLifestyleCategories(prev => 
      prev.map((category) => {

        let factors = [...category.factors]
        if(category.lifestyle_category_id === factor.lifestyle_category_id){
          factors = [...category.factors, factor]
          factors.sort((a, b) => new Date(a.created_at).getTime() -  new Date(b.created_at).getTime())
        }
        return {
          ...category, 
          factors
        }
      }))
  }

  const reinstateArchived = async (factor: LifestyleFactor) => {
    try {
      const { user_id, lifestyle_factor_id } = factor

      const request = {
        archive: false,
        user_id,
        lifestyle_factor_id
      }

      const fetchPatch = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/lifestyle-factors/archive`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      })

      if(!fetchPatch) setErrorMessage('Error unarchiving factor')
      
    } catch (error) {
      setErrorMessage('Error unarchiving factor')
      console.error('Error unarchiving factor', error)
    }
    

  }

  const optimisticPermDelete = (factor: LifestyleFactor) => {
    setArchivedFactors(prev => prev.filter(prevFactor => prevFactor.lifestyle_factor_id !== factor.lifestyle_factor_id))
  }

  const permDelete = async (factor: LifestyleFactor) => {
    try {
      const { user_id, lifestyle_factor_id } = factor
      const request = {
        user_id,
        lifestyle_factor_id
      }
      const fetchDelete = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/lifestyle-factors/factor`, {
        method: 'DELETE',
        headers: { 'Content-type' : 'application/json'},
        body: JSON.stringify(request)
      })

      if(!fetchDelete) setErrorMessage('Error deleting factor')


    } catch (error) {
      console.error('Error deleting factor', error)
    }

  }

  useEffect(()=> {
    if(user) getAllArchivedFactors()
  },[user, lifestyleCategories])

  return (
    <>

    <Sheet>
      <SheetTrigger className="flex justify-start">
        <button className=" h-fit rounded-lg bg-red-500 w-28 text-white transition-all duration-300 p-2" onClick={()=> setShowArchived(prev => !prev)}>
        View Archived
        </button>
      </SheetTrigger>

      <SheetContent className="min-h-[33%] rounded-t-lg flex justify-center max-h-screen overflow-y-auto " side={'bottom'}>
      {
      <div className={` w-full flex flex-col gap-4 transition-all duration-300 h-full max-w-7xl `} >
        <SheetHeader>
          <SheetTitle>
            <span className="text-2xl">Archived Factors</span>
          </SheetTitle>
          <SheetDescription>
            <span>Reinstate or delete archived factors.</span>
          </SheetDescription>
        </SheetHeader>

        <div className="w-full h-full flex flex-wrap gap-4 ">
          {
          archivedFactors.length > 0 ?
          archivedFactors.map((factor, index) => (
            <Dialog key={factor.lifestyle_factor_id}>

              <DialogTrigger className={`${factor.name ? 'text-primary' : 'text-gray-400'} p-2 border border-gray-300 h-fit rounded-lg hover:border-black transition-all`}>
                <span>{factor.name ? factor.name : 'N/A'}</span>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="">
                    Edit Archived Factor
                  </DialogTitle>
                  <div className="flex gap-4 items-center p-4">
                    <span className="font-bold">Factor </span>
                    <span className="">{factor.name}</span>

                  </div>
                </DialogHeader>
                <DialogClose className="flex flex-col md:flex-row md:justify-end md:items-center items-end gap-2">
                  <Button className=" text-gray-400 bg-background" variant={'ghost'}>
                    Cancel
                  </Button>
                  <Button className="" onClick={()=> {
                    optimisticRemoveFromArchivedList(factor)
                    optimisticReinstateArchived(factor)
                    reinstateArchived(factor)
                    toast({
                      title: "Lifestyle Factor Reinstated",
                      description: `Factor "${factor.name}" added under Category: "${findArchivedFactorCategoryName(factor)}"`,
                      
                    })
                  }}>
                    Reinstate
                  </Button>
                  <Button className="" variant={'destructive'} onClick={()=> {
                    optimisticPermDelete(factor)
                    permDelete(factor)
                  }}>
                    Delete Permanently
                  </Button>
                  
                </DialogClose>

              </DialogContent>
              {/* <button className={`${factor.name ? 'text-primary' : 'text-gray-400'} p-2 border border-gray-300 h-fit rounded-lg hover:border-black transition-all`} key={factor.lifestyle_factor_id}>
                
              </button> */}
            </Dialog>
          ))
          :
          <span className="text-gray-400">No archived factors..</span>
          }
        </div>
      </div>
      }
      </SheetContent>
    </Sheet>
    </>


  )
}