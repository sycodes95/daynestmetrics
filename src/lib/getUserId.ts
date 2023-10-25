import { getSession } from "@auth0/nextjs-auth0";

export const getUserId = async (user: any)  => {
  
  if(user) {
    const getUserFromPG = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/user?sub=${user.sub}`)
    const pgUser = await getUserFromPG.json()
    return pgUser
  } 
  return null
}