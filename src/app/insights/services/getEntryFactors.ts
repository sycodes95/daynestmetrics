import { getUserIdFromSub } from "@/lib/user/getUserIdFromSub"
import { DailyEntryFactor } from "@/types/dailyEntryFactor"
import { UserProfile } from "@auth0/nextjs-auth0/client"

export const getEntryFactors = async (user: UserProfile) : Promise<DailyEntryFactor[] | []> => {
  try {

    if(!user) return []

    const user_id = await getUserIdFromSub(user)

    const fetchGet = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/daily-entry/all-entry-factors?user_id=${user_id}`)

    const entryFactors = await fetchGet.json()
    return entryFactors

  } catch (error) {
    console.error('Error fetching entry factors in Insights', error)
    return []
  }
}