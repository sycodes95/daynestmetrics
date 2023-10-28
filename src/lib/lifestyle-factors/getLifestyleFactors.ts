import { LifestyleCategory, LifestyleFactor } from "@/app/lifestyle-factors/page";
import { getUserPG } from "../user/getUserPG";
import { UserProfile } from "@auth0/nextjs-auth0/client";

export async function getLifestyleFactors(user : UserProfile | undefined) {

  try {
    if(!user) return null
  
    const pgUser = await getUserPG(user)
  
    const defaultArray: LifestyleCategory[] = Array.from({ length: 12 }, (_, index) => ({
      name: '', 
      order_position: index,
      factors: [],
    }));
  
    const lifestyleCategories = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/lifestyle-factors/category?user_id=${pgUser.user_id}`).then(res => res.json())
  
    const lifestyleFactors = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/lifestyle-factors/factor?user_id=${pgUser.user_id}`).then(res => res.json())
  
    lifestyleCategories.forEach((data: LifestyleCategory) => {
      defaultArray[data.order_position] = {
        user_id : data.user_id,
        lifestyle_category_id : data.lifestyle_category_id,
        name : data.name,
        order_position : data.order_position,
        factors : [],
      }
    });
  
    lifestyleFactors.forEach((data: LifestyleFactor) => {
      const categoryIndex = defaultArray.findIndex(el => el.lifestyle_category_id === data.lifestyle_category_id)
      defaultArray[categoryIndex].factors.push(data)
      defaultArray[categoryIndex].factors.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0 ;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0 ;
        return dateA - dateB;
      })
    })
  
  
    return defaultArray;
    
  } catch (error) {

    console.error('Error fetching lifestyle factors', error)    
    return null
  }

  
}