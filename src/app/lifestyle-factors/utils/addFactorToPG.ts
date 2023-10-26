import { LifestyleFactor } from "../page"

export const addFactorToPG = async (factor : LifestyleFactor) => {

  try {

    const result = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/lifestyle-factors/factor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(factor)
    })
    if(result.ok) {
      return true
    }
    return false
  } catch (err) {
    
    console.error('Error adding factor to PG', err)
    return null
  }
  
}