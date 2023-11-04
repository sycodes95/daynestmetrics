import { getUserPG } from "@/lib/user/getUserPG"
import { UserProfile } from "@auth0/nextjs-auth0/client"
import { DailyEntry } from "../entryDialog"



export const getEntry = async (user: UserProfile, entry_date: string) => {

  const pgUser = await getUserPG(user)

  if(!pgUser) return null

  const getEntry = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/daily-entry/entry?entry_date=${entry_date}&user_id=${pgUser.user_id}`)

  const entry : DailyEntry | null = await getEntry.json()

  return entry;

}