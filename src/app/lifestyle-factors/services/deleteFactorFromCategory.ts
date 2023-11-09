// import { LifestyleCategory } from "../page";

// export const deleteFactorFromCategory = async (
//   categoryIndex: number, 
//   lifestyle_factor_id: number | null, 
//   nano_id: string,
//   lifestyleFactors: LifestyleCategory[]
// ) => {

//   try {
//     console.log(categoryIndex, lifestyle_factor_id, nano_id, lifestyleFactors);
//     const newLifestyleFactors = [...lifestyleFactors];

//     const factorToDelete = newLifestyleFactors[categoryIndex].factors.find(data => data.lifestyle_factor_id === lifestyle_factor_id)

//     const deleteFactor = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/lifestyle-factors/factor`, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(factorToDelete)
//     })

//     if(!deleteFactor.ok) return false

//     newLifestyleFactors[categoryIndex].factors = newLifestyleFactors[categoryIndex].factors.filter(factor => factor.nano_id !== nano_id);
    
//     return newLifestyleFactors

//   } catch (err) {
    
//     console.error('Error deleting factor from category', err);

//     return null;
//   }

// }

import { UserProfile } from "@auth0/nextjs-auth0/client";
import { getUserPG } from "@/lib/user/getUserPG";
import { LifestyleCategory } from "@/types/lifestyleFactors";

export const deleteFactorFromCategory = async (
  user: UserProfile,
  categoryIndex: number, 
  lifestyle_factor_id: number | null, 
  nano_id: string,
  lifestyleFactors: LifestyleCategory[]
) => {

  try {

    const {user_id} = await getUserPG(user)


    const fetchDelete = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/lifestyle-factors/factor`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id,
        nano_id
      })
    });
    const deletedFactor = await fetchDelete.json()

    if(!deletedFactor) return null

    const prevLifestyleFactors = [...lifestyleFactors]
    prevLifestyleFactors[categoryIndex].factors = prevLifestyleFactors[categoryIndex].factors.filter(factor => factor.nano_id !== nano_id)
    
    return prevLifestyleFactors

  } catch (err) {
    
    console.error('Error deleting factor from category', err);

    return null;
  }

}