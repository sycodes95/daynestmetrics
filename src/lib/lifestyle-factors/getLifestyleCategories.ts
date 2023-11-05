import { LifestyleCategory, LifestyleFactor } from "@/types/lifestyleFactors";
import { getUserPG } from "../user/getUserPG";
import { UserProfile } from "@auth0/nextjs-auth0/client";
import { getUserIdFromSub } from "../user/getUserIdFromSub";

export async function getLifestyleCategories(user : UserProfile) {

  try {

    const user_id = await getUserIdFromSub(user)
  
    // const defaultArray: LifestyleCategory[] = Array.from({ length: 12 }, (_, index) => ({
    //   name: '', 
    //   order_position: index,
    //   factors: [],
    // }));
    
    // FETCH EXISTING CATEGORIES

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

    const lifestyleFactors: LifestyleFactor[] = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/lifestyle-factors/factor?user_id=${user_id}`).then(res => res.json())

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

      return formattedCategory

    })

    return formattedLifestyleCategories
    console.log(formattedLifestyleCategories);
    
    // lifestyleCategories.forEach((data: LifestyleCategory) => {
    //   defaultArray[data.order_position] = {
    //     user_id : data.user_id,
    //     lifestyle_category_id : data.lifestyle_category_id,
    //     name : data.name,
    //     order_position : data.order_position,
    //     factors : [],
    //   }
    // });
    // if(!lifestyleFactors) return defaultArray
    // lifestyleFactors.forEach((data: LifestyleFactor) => {
    //   const categoryIndex = defaultArray.findIndex(el => el.lifestyle_category_id === data.lifestyle_category_id)
    //   defaultArray[categoryIndex].factors.push(data)
    //   defaultArray[categoryIndex].factors.sort((a, b) => {
    //     const dateA = a.created_at ? new Date(a.created_at).getTime() : 0 ;
    //     const dateB = b.created_at ? new Date(b.created_at).getTime() : 0 ;
    //     return dateA - dateB;
    //   })
    // })
  
    // console.log(defaultArray);
    // return defaultArray;
    
  } catch (error) {

    console.error('Error fetching lifestyle factors', error)    
    return []
  }

  
}