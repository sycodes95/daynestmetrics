import { DailyEntry } from "@/app/entryDialog/entryDialog"
import { getAllLSFactors } from "@/lib/lifestyle-factors/getAllLSFactors"
import { getUserPG } from "@/lib/user/getUserPG"
import { DailyEntryFactor } from "@/types/dailyEntryFactor"
import { LifestyleFactor } from "@/types/lifestyleFactors"
import { UserProfile } from "@auth0/nextjs-auth0/client"

export const getEntriesData = async (user: UserProfile) => {

  try {

    const { user_id } = await getUserPG(user)

    const fetchGetAllEntries = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/daily-entry/all-entries?user_id=${user_id}`)

    const entries = await fetchGetAllEntries.json()

    if(!entries || entries.length < 1) return 

    const fetchGetAllEntryFactors = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/daily-entry/all-entry-factors?user_id=${user_id}`)

    const entryFactors: DailyEntryFactor[] = await fetchGetAllEntryFactors.json()

    const lsFactors: LifestyleFactor[] | [] = await getAllLSFactors(user_id)

    const newData = entries.map((entryData: DailyEntry) => {

      const { daily_entry_id } = entryData;

      const didFactors: string[] = []
      const didNotFactors: string[] = []

      // make new array and retrieve all factors that reference this daily factor

      const thisEntryFactors: DailyEntryFactor[] =  entryFactors.filter(data => data.daily_entry_id === daily_entry_id)

      thisEntryFactors.forEach((enFactor) => {
        //find lifestyle factor that reference entry factor
        const lsFactor = lsFactors.find(lsFactor => lsFactor.lifestyle_factor_id === enFactor.lifestyle_factor_id)
        if(lsFactor) {
          enFactor.did ? didFactors.push(lsFactor.name) : didNotFactors.push(lsFactor.name)
        }
      })

      return {
        ...entryData,
        didFactors,
        didNotFactors
      }
    })
    return newData
    
  } catch (error) {
    console.error('Error getting all daily entries in entries page')
    return []
  }

}