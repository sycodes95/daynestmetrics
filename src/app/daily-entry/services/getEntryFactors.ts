import { DailyEntryFactor } from "@/types/dailyEntryFactor"

export const getEntryFactors = async (user_id: number , daily_entry_id: number ) => {

  const fetchDayFactors = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/daily-entry/day-factor?user_id=${user_id}&daily_entry_id=${daily_entry_id}`)

  const dayFactors : DailyEntryFactor[] | null = await fetchDayFactors.json()

  return dayFactors
  
} 