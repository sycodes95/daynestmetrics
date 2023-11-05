import { UserProfile } from "@auth0/nextjs-auth0/client";

export const getUserIdFromSub = async (user: UserProfile) => {
  try {
    if(user) {
      const getUserFromPG = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/user?sub=${user.sub}`)
      const { user_id } = await getUserFromPG.json()
      return user_id
    } 
    return null
    
  } catch (error) {
    console.error('getUserPG, Error getting pgUser', error)

    return null
  }
}