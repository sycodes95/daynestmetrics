import { LifestyleFactor } from "@/app/lifestyle-factors/page"

export const getDayFactors = async (user_id: number , daily_entry_id: number ) => {

  const fetchDayFactors = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/daily-entry/day-factor?user_id=${user_id}&daily_entry_id=${daily_entry_id}`)

  const dayFactors : {
    daily_entry_id: number,
    lifestyle_factor_id: number,
    user_id: number,
    did: boolean
  }[] | null = await fetchDayFactors.json()

  return dayFactors
  
} 