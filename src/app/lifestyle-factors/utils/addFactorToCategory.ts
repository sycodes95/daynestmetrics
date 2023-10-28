import { UserProfile } from "@auth0/nextjs-auth0/client";
import { LifestyleCategory } from "../page";
import { getUserPG } from "@/lib/user/getUserPG";
import { nanoid } from "nanoid";
import { addFactorToPG } from "./addFactorToPG";

export const addFactorToCategory = async (categoryIndex: number, lifestyleFactors: LifestyleCategory[], user: UserProfile | undefined) => {

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
      name: '', 
      order_position: newFactors.length
    }

    const addFactor = await addFactorToPG(factor)
    if(!addFactor) return null

    newFactors.push(factor);

    newLifestyleFactors[categoryIndex] = { 
      user_id, 
      lifestyle_category_id,
      name, 
      order_position: categoryIndex, 
      factors: newFactors
    };

    return newLifestyleFactors
    
  } catch (err) {

    console.error(err)
    return null

  }
  

}