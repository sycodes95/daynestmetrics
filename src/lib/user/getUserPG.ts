import { getSession } from "@auth0/nextjs-auth0";

export const getUserPG = async (user: any)  => {
  try {
    if(user) {
      const getUserFromPG = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/user?sub=${user.sub}`)
      const pgUser = await getUserFromPG.json()
      return pgUser
    } 
    return null
    
  } catch (error) {
    console.error('getUserPG, Error getting pgUser', error)

    return null
  }
  
}