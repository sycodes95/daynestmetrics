import { LifestyleCategory, LifestyleFactor } from "@/types/lifestyleFactors";
import { getUserPG } from "../user/getUserPG";
import { UserProfile } from "@auth0/nextjs-auth0/client";
import { getUserIdFromSub } from "../user/getUserIdFromSub";

export async function getLifestyleCategories(user : UserProfile, archived: boolean = false) {

  try {

    const user_id = await getUserIdFromSub(user)

    let lifestyleCategories: LifestyleCategory[] = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/lifestyle-factors/category?user_id=${user_id}`).then(res => res.json())
    
    //if no existing categories (new user) create 12 default categories and return all in an array

    if(lifestyleCategories.length < 1) {
      const createDefaultCategories = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/lifestyle-factors/category/add-default`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id })
      })
      console.log(createDefaultCategories);
      lifestyleCategories = await createDefaultCategories.json()
    }

    // get all lifestyle factors from user

    // const lifestyleFactors: LifestyleFactor[] = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/lifestyle-factors/factor?user_id=${user_id}`).then(res => res.json())

    const lifestyleFactors: LifestyleFactor[] = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/lifestyle-factors/${archived ? 'all-archived-factors' : 'all-factors'}?user_id=${user_id}`).then(res => res.json())

    const formattedLifestyleCategories: LifestyleCategory[] = lifestyleCategories.map((category, index) => {

      const { 
        user_id, 
        lifestyle_category_id, 
        name, 
        order_position 
      } = category

      const formattedCategory: LifestyleCategory = {
        user_id, 
        lifestyle_category_id, 
        name, 
        order_position,
        factors: []
      }

      if(!lifestyleFactors) return formattedCategory

      const lsFactorsUnderCategory = lifestyleFactors.filter(factor => factor.lifestyle_category_id === category.lifestyle_category_id)

      lsFactorsUnderCategory.forEach((factor) => formattedCategory.factors.push(factor))

      formattedCategory.factors.sort((a, b) => new Date(a.created_at).getTime() -  new Date(b.created_at).getTime())

      return formattedCategory

    })

    return formattedLifestyleCategories
    
  } catch (error) {

    console.error('Error fetching lifestyle factors', error)    
    return []
  }

  
}