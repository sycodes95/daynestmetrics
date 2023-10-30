import { DailyEntry } from "../page";

export const putDailyEntry = async (dailyEntryData : DailyEntry) : Promise<DailyEntry | null> => {

  const fetchPut = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/daily-entry/day`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dailyEntryData)
  })

  const dailyEntry = await fetchPut.json()

  if(dailyEntry) return dailyEntry
  
  return null
  
}