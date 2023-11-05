import { UserProfile } from "@auth0/nextjs-auth0/client";
import { getUserPG } from "@/lib/user/getUserPG";
import { nanoid } from "nanoid";
import { addFactorToPG } from "./addFactorToPG";
import { LifestyleCategory } from "@/types/lifestyleFactors";

export const addFactorToCategory = async (
  categoryIndex: number, 
  lifestyleFactors: LifestyleCategory[], 
  user: UserProfile | undefined,
  factorInput: string
  ) => {
  

  try {
    
    if(!user) return null

    const pgUser = await getUserPG(user)

    const newLifestyleFactors = [...lifestyleFactors];

    const newFactors = [...newLifestyleFactors[categoryIndex].factors]

    const { user_id, lifestyle_category_id, name } = newLifestyleFactors[categoryIndex]

    const factor = { 
      user_id: pgUser.user_id, 
      lifestyle_category_id,
      nano_id: nanoid(), 
      name: factorInput, 
      archive: false
    }

    //adds factor then returns the factor with its id
    const addAndReturnFactor = await addFactorToPG(factor)

    if(!addAndReturnFactor) return null

    newFactors.push(addAndReturnFactor);

    newLifestyleFactors[categoryIndex] = { 
      user_id, 
      lifestyle_category_id,
      name: factorInput, 
      order_position: categoryIndex, 
      factors: newFactors
    };
    
    return newLifestyleFactors
    
  } catch (err) {

    console.error(err)
    return null

  }
  

}

