import { LifestyleFactor } from "@/types/lifestyleFactors"

export const addFactorToPG = async (factor : LifestyleFactor) => {

  try {

    const fetchPost = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/lifestyle-factors/factor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(factor)
    })
    
    const postedFactor = await fetchPost.json()

    return postedFactor
    
  } catch (err) {
    
    console.error('Error adding factor to PG', err)
    return null
  }
  
}