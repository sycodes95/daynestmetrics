import { LifestyleFactor } from "@/app/lifestyle-factors/page"

export const postDailyFactors = async (
  didToday : LifestyleFactor[], 
  didNotDoToday : LifestyleFactor[], 
  daily_entry_id : number, 
  user_id : number,
  ) => {

  const didPromises = Promise.all(didToday.map(async (factor) => {
    const posted = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/daily-entry/day-factor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        daily_entry_id,
        lifestyle_factor_id: factor.lifestyle_factor_id,
        user_id: user_id,
        did: true
      })
    }).then(res => res.json())

    if(posted) return posted

  }))
  //so there should be only 2 rows in daily factors, lets check
  const didNotPromises = Promise.all(didNotDoToday.map(async (factor) => {
    const posted = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/daily-entry/day-factor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        daily_entry_id,
        lifestyle_factor_id: factor.lifestyle_factor_id,
        user_id: user_id,
        did: false
      })
    }).then(res => res.json())

    if(posted) return posted

  }))

  const didTodayFactors = await didPromises;

  const didNotDoTodayFactors = await didNotPromises;

  if(didTodayFactors.includes(null) || didNotDoTodayFactors.includes(null)) {
    return null
  }

  return {
    didToday : didTodayFactors,
    didNotDoToday : didNotDoTodayFactors,
  }

}
