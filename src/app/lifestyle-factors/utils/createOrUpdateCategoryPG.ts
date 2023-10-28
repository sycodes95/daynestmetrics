import { getUserPG } from "@/lib/user/getUserPG"
import { UserProfile } from "@auth0/nextjs-auth0/client"
import { LifestyleCategory } from "../page"
import { getLifestyleFactors } from "@/lib/lifestyle-factors/getLifestyleFactors"

export const createOrUpdateCategoryPG = async (catIndex: number, user: UserProfile | undefined, lifestyleFactors: LifestyleCategory[]) => {

  try {
  
    if(!user) return false

    const pgUser = await getUserPG(user)

    const lifestyleCategory = lifestyleFactors[catIndex]

    const result = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/lifestyle-factors/category?user_id=${pgUser.user_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(lifestyleCategory)
    })
    
    if(result.ok){
      return true
      //if true getLSFactors() is run on the page to update the lifestyleFactors on the front end with the backend.
    }

    return false
    //false getLSFactors() does not run on the page.
  } catch( err ) {

    console.error('Error creating or updating lifestyle category PG', err)

    return false
  }
}
