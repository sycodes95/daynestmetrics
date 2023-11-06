import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"

import { LifestyleCategory } from "@/types/lifestyleFactors";
import { getUserIdFromSub } from "@/lib/user/getUserIdFromSub";
import { UserProfile } from "@auth0/nextjs-auth0/client";
import { updateCategory } from "../../services/updateCategory";
import { useState } from "react";
import { addFactorToCategory } from "../../services/addFactorToCategory";

type AddFactorProps = {
  categoryIndex: number;
  user: UserProfile | undefined;
  lifestyleCategories: LifestyleCategory[];
  setLifestyleCategories: React.Dispatch<React.SetStateAction<LifestyleCategory[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;

}

export default function AddFactor ({ categoryIndex, user, lifestyleCategories, setLifestyleCategories ,setErrorMessage } : AddFactorProps) {

  const [factorInput, setFactorInput] = useState('')

  const submitFactor = async (categoryIndex: number) => {

    const newLifestyleFactors = await addFactorToCategory(categoryIndex, lifestyleCategories, user, factorInput)

    if(newLifestyleFactors) {
      setLifestyleCategories(newLifestyleFactors)
      setFactorInput('')
    }

  }

  return (
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
            <Button type="submit" onClick={()=> submitFactor(categoryIndex)}>Save factor</Button>
          </DialogClose>
          
        </DialogFooter>
      </DialogContent>
    </Dialog>

  )
}