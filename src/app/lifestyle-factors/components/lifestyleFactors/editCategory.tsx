import { useState } from "react"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"

import { LifestyleCategory } from "@/types/lifestyleFactors";
import { getUserIdFromSub } from "@/lib/user/getUserIdFromSub";
import { UserProfile } from "@auth0/nextjs-auth0/client";
import { updateCategory } from "../../services/updateCategory";


type EditCategoryProps = {
  user: UserProfile | undefined;
  category: LifestyleCategory;
  setLifestyleCategories: React.Dispatch<React.SetStateAction<LifestyleCategory[] | []>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;

}
export default function EditCategory({ 
  user, 
  category, 
  setLifestyleCategories,
  setErrorMessage
} : EditCategoryProps) {

  const [newCategoryName, setNewCategoryName] = useState('')

  const optimisticUpdate = (lifestyle_category_id: number) => {
    setLifestyleCategories(prevCategories =>
      prevCategories.map(category =>
        category.lifestyle_category_id === lifestyle_category_id
        ? { ...category, name: newCategoryName }
        : category
      )
    );
  };

  const handleUpdate = async (lifestyle_category_id: number) => {

    try {
      if(!user) return setErrorMessage('Error updating category name, user is undefined')

      const user_id = await getUserIdFromSub(user)

      // patch update category on backend
      const updateAndReturnCategory = await updateCategory(newCategoryName, lifestyle_category_id, user_id)

      if(!updateAndReturnCategory) return setErrorMessage('Error updating category name')

      return setNewCategoryName('')

    } catch (error) {
      console.error('Error updating category name')
      setErrorMessage('Error updating category name')
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={`w-full ${category.name ? 'text-primary' : 'text-gray-400'} flex justify-start items-center p-2 bg-white border-gray-300 h-full rounded-lg border hover:border-black transition-colors `}
        onClick={()=> setNewCategoryName(category.name)} >
          {category.name ? category.name: `Category...`}
        </button>

      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">

        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Name
            </Label>
            <Input className="col-span-3" 
            value={newCategoryName} 
            onChange={(e)=> setNewCategoryName(e.target.value)} 
            placeholder="..."  
            />
          </div>
          
        </div>
        
        <DialogFooter>
          <DialogClose>
            <Button onClick={()=> {
              optimisticUpdate(category.lifestyle_category_id)
              handleUpdate(category.lifestyle_category_id)
            }}>Save category</Button>
          </DialogClose>
          
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}