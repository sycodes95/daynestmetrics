import { DailyEntry } from "@/app/entryDialog/entryDialog"
import { getUserIdFromSub } from "@/lib/user/getUserIdFromSub"
import { UserProfile } from "@auth0/nextjs-auth0/client"

export const getDailyEntries = async (user: UserProfile) : Promise<DailyEntry[] | []> => {
  try {

    if(!user) return []

    const user_id = await getUserIdFromSub(user)

    const fetchGet = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/daily-entry/all-entries?user_id=${user_id}`)

    const entries = await fetchGet.json()

    return entries

  } catch (error) {
    console.error('Error fetching daily entries in Insights', error)
    return []
  }
}