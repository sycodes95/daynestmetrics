import { getAllLSFactors } from "@/lib/lifestyle-factors/getAllLSFactors";
import { getUserIdFromSub } from "@/lib/user/getUserIdFromSub";
import { LifestyleFactor } from "@/types/lifestyleFactors";
import { UserProfile } from "@auth0/nextjs-auth0/client";

export const getLifestyleFactors = async (user: UserProfile) : Promise<LifestyleFactor[] | []> => {
  try {

    if(!user) return []

    const user_id = await getUserIdFromSub(user)

    const factors = await getAllLSFactors(user_id)
    return factors

  } catch (error) {
    console.error('Error fetching all ls factors in Insights', error)
    return []    
  }
}